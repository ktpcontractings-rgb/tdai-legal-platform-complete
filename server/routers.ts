import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";
import { consultations, managementAgents, agentDecisions, ceoChatMessages } from "../drizzle/schema";
// Voice features removed
import { voiceConsultationRouter } from "./voice-consultation";
import { trafficTicketRouter } from "./traffic-tickets";

export const appRouter = router({
  system: systemRouter,
  voiceConsultation: voiceConsultationRouter,
  trafficTickets: trafficTicketRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================================================================
  // LEGAL AGENTS - Customer-facing AI specialists
  // ============================================================================
  legalAgents: router({
    getStats: publicProcedure.query(async () => {
      const agents = await db.getAllLegalAgents();
      const totalCases = agents.reduce((sum, a) => sum + (a.casesHandled || 0), 0);
      const successfulCases = agents.reduce((sum, a) => sum + Math.floor((a.casesHandled || 0) * (Number(a.successRate) || 0) / 100), 0);
      const successRate = totalCases > 0 ? (successfulCases / totalCases) * 100 : 0;
      
      return {
        totalAgents: agents.length,
        activeAgents: agents.filter(a => a.status === "active").length,
        totalCases,
        successRate,
        activeConsultations: 12, // Mock data for now
      };
    }),
    // Get all active legal agents
    list: publicProcedure.query(async () => {
      return await db.getAllLegalAgents();
    }),

    // Get agents by specialization
    bySpecialization: publicProcedure
      .input(z.object({ specialization: z.string() }))
      .query(async ({ input }) => {
        return await db.getLegalAgentsBySpecialization(input.specialization);
      }),

    // Get single agent details
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getLegalAgentById(input.id);
      }),

    // Start voice consultation with agent
    startConsultation: protectedProcedure
      .input(z.object({
        agentId: z.string(),
        caseType: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const consultationId = nanoid();
        
        // Create consultation record
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new Error("Database not available");

        await dbInstance.insert(consultations).values({
          id: consultationId,
          userId: ctx.user.id,
          legalAgentId: input.agentId,
          caseType: input.caseType,
          status: "scheduled",
          scheduledAt: new Date(),
        });

        // Log audit
        await db.logAudit(
          "consultation",
          consultationId,
          "started",
          ctx.user.id.toString(),
          `Started consultation with agent ${input.agentId} for ${input.caseType}`
        );

        return {
          consultationId,
          message: "Consultation started successfully",
        };
      }),

    // Generate voice response from agent
    generateVoiceResponse: publicProcedure
      .input(z.object({
        agentId: z.string(),
        text: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Voice generation disabled
        throw new Error("Voice generation has been disabled");
      }),
  }),

  // ============================================================================
  // MANAGEMENT AGENTS - SIGMA system
  // ============================================================================
  managementAgents: router({
    // Get all management agents
    list: publicProcedure.query(async () => {
      return await db.getAllManagementAgents();
    }),

    // Get single management agent
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getManagementAgentById(input.id);
      }),

    // Initialize new management agent
    initialize: protectedProcedure
      .input(z.object({
        role: z.enum(["CEO", "CTO", "PM", "MARKETING", "BILLING", "LEGAL"]),
        name: z.string(),
        title: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const agentId = nanoid();
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new Error("Database not available");

        // Create agent
        await dbInstance.insert(managementAgents).values({
          id: agentId,
          name: input.name,
          role: input.role,
          title: input.title,
          status: "pending",
        });

        // Create initial decision for approval
        const decisionId = nanoid();
        await dbInstance.insert(agentDecisions).values({
          id: decisionId,
          agentId: agentId,
          decision: `Initialize ${input.name} as ${input.title}`,
          status: "pending",
          priority: "high",
        });

        // Log audit
        await db.logAudit(
          "management_agent",
          agentId,
          "initialized",
          ctx.user.id.toString(),
          `Initialized ${input.role} agent: ${input.name}`
        );

        return {
          agentId,
          decisionId,
          message: `${input.name} initialized successfully`,
        };
      }),
  }),

  // ============================================================================
  // AGENT DECISIONS & APPROVALS
  // ============================================================================
  decisions: router({
    // Get all pending decisions
    pending: publicProcedure.query(async () => {
      return await db.getPendingDecisions();
    }),

    // Get decisions by agent
    byAgent: publicProcedure
      .input(z.object({ agentId: z.string() }))
      .query(async ({ input }) => {
        return await db.getDecisionsByAgentId(input.agentId);
      }),

    // Approve decision
    approve: protectedProcedure
      .input(z.object({ decisionId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const decision = await db.approveDecision(
          input.decisionId,
          ctx.user.id.toString()
        );

        // Log audit
        await db.logAudit(
          "decision",
          input.decisionId,
          "approved",
          ctx.user.id.toString(),
          "Decision approved by owner"
        );

        return decision;
      }),

    // Reject decision
    reject: protectedProcedure
      .input(z.object({ decisionId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const decision = await db.rejectDecision(
          input.decisionId,
          ctx.user.id.toString()
        );

        // Log audit
        await db.logAudit(
          "decision",
          input.decisionId,
          "rejected",
          ctx.user.id.toString(),
          "Decision rejected by owner"
        );

        return decision;
      }),
  }),

  // ============================================================================
  // SUBSCRIPTIONS & BILLING
  // ============================================================================
  subscriptions: router({
    // Get user's current subscription
    current: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserSubscription(ctx.user.id);
    }),

    // Get all active subscriptions (admin only)
    all: protectedProcedure.query(async () => {
      return await db.getAllActiveSubscriptions();
    }),
  }),

  // ============================================================================
  // CONSULTATIONS
  // ============================================================================
  consultations: router({
    // Get user's consultations
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserConsultations(ctx.user.id);
    }),

    // Get single consultation
    get: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getConsultationById(input.id);
      }),
  }),

  // ============================================================================
  // BUSINESS METRICS
  // ============================================================================
  metrics: router({
    // Get metrics by category
    byCategory: publicProcedure
      .input(z.object({
        category: z.enum(["revenue", "users", "agents", "consultations", "satisfaction"]).optional(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getBusinessMetrics(input.category, input.limit);
      }),

    // Record new metric (admin only)
    record: protectedProcedure
      .input(z.object({
        name: z.string(),
        value: z.number(),
        category: z.enum(["revenue", "users", "agents", "consultations", "satisfaction"]),
      }))
      .mutation(async ({ input }) => {
        return await db.recordMetric(input.name, input.value, input.category);
      }),
  }),

  // ============================================================================
  // REGULATORY BOARD
  // ============================================================================
  regulatoryBoard: router({
    // Get all board members
    list: publicProcedure.query(async () => {
      return await db.getAllRegulatoryBoardMembers();
    }),
  }),

  // ============================================================================
  // STRIPE PAYMENTS
  // ============================================================================
  payments: router({
    // Create checkout session for subscription
    createSubscriptionCheckout: protectedProcedure
      .input(z.object({
        priceId: z.string(),
        successUrl: z.string(),
        cancelUrl: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createSubscriptionCheckout } = await import("./stripe-config");
        const session = await createSubscriptionCheckout(
          ctx.user.id,
          input.priceId,
          input.successUrl,
          input.cancelUrl
        );
        return { sessionId: session.id, url: session.url };
      }),

    // Create checkout session for one-time payment
    createOneTimeCheckout: protectedProcedure
      .input(z.object({
        priceId: z.string(),
        successUrl: z.string(),
        cancelUrl: z.string(),
        metadata: z.record(z.string()).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createOneTimeCheckout } = await import("./stripe-config");
        const session = await createOneTimeCheckout(
          ctx.user.id,
          input.priceId,
          input.successUrl,
          input.cancelUrl,
          input.metadata
        );
        return { sessionId: session.id, url: session.url };
      }),

    // Get pricing tiers
    getPricingTiers: publicProcedure.query(async () => {
      const { PRICING_TIERS, ONE_TIME_SERVICES } = await import("./stripe-config");
      return {
        subscriptions: PRICING_TIERS,
        oneTime: ONE_TIME_SERVICES,
      };
    }),

    // Create customer portal session
    createPortalSession: protectedProcedure
      .input(z.object({
        returnUrl: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Get user's subscription to find customer ID
        const subscription = await db.getUserSubscription(ctx.user.id);
        if (!subscription?.stripeCustomerId) {
          throw new Error("No active subscription found");
        }

        const { createCustomerPortalSession } = await import("./stripe-config");
        const session = await createCustomerPortalSession(
          subscription.stripeCustomerId,
          input.returnUrl
        );
        return { url: session.url };
      }),
  }),

  // ============================================================================
  // CEO CHAT - Strategic directives to management agents
  // ============================================================================
  ceoChat: router({    
    // Get chat history
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      const dbInstance = await db.getDb();
      if (!dbInstance) throw new Error("Database not available");
      
      const { eq, desc } = await import("drizzle-orm");
      const messages = await dbInstance
        .select()
        .from(ceoChatMessages)
        .where(eq(ceoChatMessages.userId, ctx.user.id))
        .orderBy(desc(ceoChatMessages.timestamp))
        .limit(50);
      
      return messages.reverse(); // Return oldest first
    }),

    // Send message to a specific management agent
    sendMessage: protectedProcedure
      .input(z.object({ 
        message: z.string(),
        targetAgent: z.enum(["CEO", "CTO", "PM", "MARKETING", "BILLING", "LEGAL"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const dbInstance = await db.getDb();
        if (!dbInstance) throw new Error("Database not available");

        // Save user message
        await dbInstance.insert(ceoChatMessages).values({
          userId: ctx.user.id,
          message: input.message,
          role: "user",
          timestamp: new Date(),
        });

        // Determine which agent to respond (default to CEO agent)
        const targetRole = input.targetAgent || "CEO";
        
        // Get the management agent
        const { eq } = await import("drizzle-orm");
        const agents = await dbInstance
          .select()
          .from(managementAgents)
          .where(eq(managementAgents.role, targetRole))
          .limit(1);

        let agentId = "SIGMA"; // Fallback
        if (agents.length > 0) {
          agentId = agents[0].id;
        }

        // Get conversation history for context
        const recentMessages = await dbInstance
          .select()
          .from(ceoChatMessages)
          .where(eq(ceoChatMessages.userId, ctx.user.id))
          .orderBy(desc(ceoChatMessages.timestamp))
          .limit(10);

        const conversationHistory = recentMessages.reverse().map(msg => ({
          role: msg.role,
          content: msg.message,
        }));

        // Generate RAG-enhanced agent response using their specific knowledge base
        const { generateRAGResponse } = await import("./rag-vector-store");
        const agentResponse = await generateRAGResponse(
          agentId,
          targetRole,
          input.message,
          conversationHistory
        );

        // Save agent response
        await dbInstance.insert(ceoChatMessages).values({
          userId: ctx.user.id,
          message: agentResponse,
          role: "assistant",
          agentId,
          timestamp: new Date(),
        });

        // Log audit
        await db.logAudit(
          "ceo_chat",
          ctx.user.id.toString(),
          "message_sent",
          ctx.user.id.toString(),
          `CEO sent message to ${targetRole}: ${input.message.substring(0, 100)}`
        );

        return {
          userMessage: input.message,
          agentResponse,
          respondingAgent: targetRole,
        };
      }),

    // Initialize knowledge base for an agent
    initializeAgentKnowledge: protectedProcedure
      .input(z.object({
        agentId: z.string(),
        role: z.enum(["CEO", "CTO", "PM", "MARKETING", "BILLING", "LEGAL"]),
      }))
      .mutation(async ({ input }) => {
        const { initializeAgentKnowledge } = await import("./agent-knowledge");
        return await initializeAgentKnowledge(input.agentId, input.role);
      }),
  }),
});

export type AppRouter = typeof appRouter;
