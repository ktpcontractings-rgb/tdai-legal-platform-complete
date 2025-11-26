import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

const TICKET_PRICES = {
  single: { amount: 2500, credits: 1 },
  pack_5: { amount: 10000, credits: 5 },
  pack_10: { amount: 18000, credits: 10 },
  pack_25: { amount: 40000, credits: 25 },
};

export const trafficTicketRouter = router({
  getCredits: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserTicketCredits(ctx.user.id);
  }),

  getPricing: protectedProcedure.query(() => {
    return Object.entries(TICKET_PRICES).map(([key, value]) => ({
      id: key,
      credits: value.credits,
      amount: value.amount,
      pricePerCredit: value.amount / value.credits,
    }));
  }),

  createCheckoutSession: protectedProcedure
    .input(z.object({ priceId: z.enum(["single", "pack_5", "pack_10", "pack_25"]) }))
    .mutation(async ({ input, ctx }) => {
      const price = TICKET_PRICES[input.priceId];
      throw new TRPCError({
        code: "NOT_IMPLEMENTED",
        message: "Stripe checkout coming soon",
      });
    }),

  submitTicket: protectedProcedure
    .input(
      z.object({
        ticketNumber: z.string().min(1),
        violationType: z.enum([
          "SPEEDING", "RED_LIGHT", "STOP_SIGN", "PARKING",
          "CARELESS_DRIVING", "RECKLESS_DRIVING", "DUI_DWI",
          "LICENSE_ISSUE", "REGISTRATION_ISSUE", "OTHER"
        ]),
        issueDate: z.string(),
        location: z.string().min(5),
        fineAmount: z.number().positive(),
        courtDate: z.string().optional(),
        officerName: z.string().optional(),
        description: z.string().min(20),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const credits = await db.getUserTicketCredits(ctx.user.id);
      if (!credits || credits.balance < 1) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Insufficient credits. Please purchase credits to continue.",
        });
      }

      // Auto-assign to specialist based on violation type
      const agentMapping: Record<string, string> = {
        SPEEDING: "TRAFFIC-SPEED-001",
        RED_LIGHT: "TRAFFIC-SIGNAL-001",
        STOP_SIGN: "TRAFFIC-SIGNAL-001",
        PARKING: "TRAFFIC-PARKING-001",
        CARELESS_DRIVING: "TRAFFIC-RECKLESS-001",
        RECKLESS_DRIVING: "TRAFFIC-RECKLESS-001",
        DUI_DWI: "TRAFFIC-DUI-001",
        LICENSE_ISSUE: "TRAFFIC-LICENSE-001",
        REGISTRATION_ISSUE: "TRAFFIC-LICENSE-001",
        OTHER: "agent_traffic_sarah", // Default to general traffic specialist
      };
      const assignedAgentId = agentMapping[input.violationType];

      await db.deductTicketCredit(ctx.user.id);
      
      const ticketId = await db.createTrafficTicket({
        userId: ctx.user.id,
        ticketNumber: input.ticketNumber,
        violationType: input.violationType,
        issueDate: new Date(input.issueDate),
        location: input.location,
        fineAmount: input.fineAmount.toString(),
        courtDate: input.courtDate ? new Date(input.courtDate) : undefined,
        officerName: input.officerName,
        description: input.description,
        status: "under_review",
        assignedAgentId,
      });

      // Notify both SIGMA-1 and the assigned specialist
      await db.notifyManagementTeam(ticketId, input.violationType);
      await db.createTicketManagementDiscussion({
        ticketId,
        fromAgentId: "SYSTEM",
        toAgentId: assignedAgentId,
        message: `New ${input.violationType} ticket assigned. Ticket #${input.ticketNumber} - ${input.location}. Fine: $${input.fineAmount}. ${input.courtDate ? `Court date: ${input.courtDate}` : "No court date set."}`,
        messageType: "assignment",
        priority: input.violationType === "DUI_DWI" || input.violationType === "RECKLESS_DRIVING" ? "urgent" : "high",
      });

      return { success: true, ticketId };
    }),

  getMyTickets: protectedProcedure.query(async ({ ctx }) => {
    return await db.getUserTrafficTickets(ctx.user.id);
  }),

  getAllTickets: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }
    return await db.getAllTrafficTickets();
  }),

  updateTicketStatus: protectedProcedure
    .input(
      z.object({
        ticketId: z.number(),
        status: z.enum(["submitted", "under_review", "strategy_ready", "in_progress", "resolved", "closed"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      await db.updateTrafficTicketStatus(input.ticketId, input.status);
      return { success: true };
    }),

  getTicketDiscussions: protectedProcedure
    .input(z.object({ ticketId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      return await db.getTicketManagementDiscussions(input.ticketId);
    }),

  getAllDiscussions: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
    }
    return await db.getAllTicketManagementDiscussions();
  }),

  createDiscussion: protectedProcedure
    .input(
      z.object({
        ticketId: z.number(),
        fromAgentId: z.string(),
        toAgentId: z.string().optional(),
        message: z.string(),
        messageType: z.enum([
          "assignment", "strategy_discussion", "status_update",
          "approval_request", "resolution", "escalation"
        ]).default("strategy_discussion"),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      await db.createTicketManagementDiscussion(input);
      return { success: true };
    }),
});
