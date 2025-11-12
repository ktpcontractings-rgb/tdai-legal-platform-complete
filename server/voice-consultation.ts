import OpenAI from "openai";
import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { consultations } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Voice Consultation System (Voice features disabled - text only)
 * Handles real-time text conversations with AI legal agents
 */

// Agent system prompts by specialization
const AGENT_PROMPTS: Record<string, string> = {
  TRAFFIC: `You are Sarah Mitchell, a Traffic Law Specialist with 96.2% success rate and 1,247 cases handled. 
You provide expert guidance on Michigan traffic violations (MCL 257), DUI defense, license restoration, and court procedures. 
Be professional, empathetic, and provide actionable legal information. Always remind users this is information, not legal advice.`,
  
  FAMILY: `You are Michael Rodriguez, a Family Law Expert with 94.7% success rate and 892 cases handled.
You specialize in Michigan divorce (MCL 552), child custody under Michigan Child Custody Act, family mediation, and domestic relations. 
Approach sensitive family matters with compassion while providing clear legal guidance.`,
  
  CORPORATE: `You are Jennifer Chen, a Corporate Law Advisor with 98.1% success rate and 654 cases handled.
You advise on Michigan business formation (LLC, Corp), contracts under Michigan Contract Law, compliance, and corporate governance.
Provide strategic, business-focused legal guidance for startups and enterprises.`,
  
  CRIMINAL: `You are David Thompson, a Criminal Defense Attorney with 91.5% success rate and 1,089 cases handled.
You provide aggressive defense strategies for Michigan criminal charges under MCL 750, misdemeanors, and felonies.
Be direct, strategic, and focused on protecting client rights.`,
  
  BENEFITS: `You are Betty Williams, a Social Security Specialist with 97.3% success rate and 2,156 cases handled.
With 30+ years experience, you help Michigan clients navigate complex benefits systems with fierce advocacy.
Be patient, thorough, and determined in helping clients access their benefits.`,
};

export const voiceConsultationRouter = router({
  /**
   * Start a new voice consultation session
   */
  startSession: protectedProcedure
    .input(z.object({
      agentId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      return {
        sessionId,
      };
    }),

  /**
   * Transcribe audio to text (DISABLED - voice features removed)
   */
  transcribeAudio: protectedProcedure
    .input(z.object({
      audioBase64: z.string(),
      format: z.string(),
    }))
    .mutation(async ({ input }) => {
      throw new Error("Voice transcription has been disabled");
    }),

  /**
   * Process voice message and generate AI response (text only now)
   */
  processVoiceMessage: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
      agentId: z.string(),
      userMessage: z.string(),
      conversationHistory: z.array(z.object({
        role: z.string(),
        content: z.string(),
      })),
    }))
    .mutation(async ({ input }) => {
      const { agentId, userMessage, conversationHistory } = input;

      // Get agent details
      const agent = await db.getLegalAgentById(agentId);
      if (!agent) {
        throw new Error("Agent not found");
      }

      // Build system prompt
      const systemPrompt = AGENT_PROMPTS[agent.specialization] || 
        `You are ${agent.name}, ${agent.title}. Provide expert legal guidance on Michigan state law.`;

      // Build messages for OpenAI
      const messages: any[] = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map(msg => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        })),
        { role: "user", content: userMessage },
      ];

      // Get AI response
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const aiResponse = completion.choices[0].message.content || "I apologize, I couldn't generate a response.";

      return {
        text: aiResponse,
        audio: "", // No audio - voice features disabled
        timestamp: new Date().toISOString(),
      };
    }),

  /**
   * End consultation session
   */
  endSession: protectedProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return { success: true };
    }),
});
