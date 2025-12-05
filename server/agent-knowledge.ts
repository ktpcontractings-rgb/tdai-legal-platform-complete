/**
 * Agent-Specific Knowledge Base Management
 * Each management agent has their own isolated knowledge database
 */

import { getDb } from "./db";
import { knowledgeDocuments } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { agentKnowledgeBases, type AgentRole } from "./agent-knowledge-init";

/**
 * Get all knowledge documents for a specific agent
 */
export async function getAgentKnowledge(agentId: string) {
  const dbInstance = await getDb();
  if (!dbInstance) throw new Error("Database not available");

  const knowledge = await dbInstance
    .select()
    .from(knowledgeDocuments)
    .where(eq(knowledgeDocuments.agentId, agentId))
    .orderBy(knowledgeDocuments.importance);

  return knowledge;
}

/**
 * Build context string from agent's knowledge base for AI prompts
 */
export async function buildAgentContext(agentId: string): Promise<string> {
  const knowledge = await getAgentKnowledge(agentId);
  
  if (knowledge.length === 0) {
    return "No specific knowledge base loaded yet.";
  }

  const contextParts = knowledge.map(doc => 
    `### ${doc.title}\n${doc.content}`
  );

  return `## Your Knowledge Base:\n\n${contextParts.join("\n\n")}`;
}

/**
 * Get system prompt for a specific agent role
 */
export function getAgentSystemPrompt(role: AgentRole): string {
  const agentConfig = agentKnowledgeBases[role];
  if (!agentConfig) {
    return "You are an AI management agent for TDAI Legal Services Platform.";
  }
  return agentConfig.systemPrompt;
}

/**
 * Initialize knowledge base for a new agent
 */
export async function initializeAgentKnowledge(agentId: string, role: AgentRole) {
  const dbInstance = await getDb();
  if (!dbInstance) throw new Error("Database not available");

  const agentConfig = agentKnowledgeBases[role];
  if (!agentConfig) {
    throw new Error(`No knowledge base configuration for role: ${role}`);
  }

  const { nanoid } = await import("nanoid");

  // Insert initial knowledge documents for this agent
  for (const knowledge of agentConfig.knowledgeAreas) {
    await dbInstance.insert(knowledgeDocuments).values({
      id: nanoid(),
      agentId,
      title: knowledge.title,
      content: knowledge.content,
      category: knowledge.category,
      sourceType: "manual",
      importance: knowledge.importance,
    });
  }

  return {
    success: true,
    documentsAdded: agentConfig.knowledgeAreas.length,
  };
}

/**
 * Add new knowledge to an agent's database (learning)
 */
export async function addAgentKnowledge(
  agentId: string,
  title: string,
  content: string,
  category: "curriculum" | "case_study" | "legal_update" | "training" | "strategy" | "technical" | "market_research",
  sourceType: "manual" | "learned" | "imported" | "generated" = "learned",
  importance: number = 5
) {
  const dbInstance = await getDb();
  if (!dbInstance) throw new Error("Database not available");

  const { nanoid } = await import("nanoid");

  await dbInstance.insert(knowledgeDocuments).values({
    id: nanoid(),
    agentId,
    title,
    content,
    category,
    sourceType,
    importance,
  });

  return { success: true };
}

/**
 * Get agent response with their specific knowledge context
 */
export async function getAgentResponse(
  agentId: string,
  role: AgentRole,
  userMessage: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<string> {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Get agent's system prompt and knowledge base
  const systemPrompt = getAgentSystemPrompt(role);
  const knowledgeContext = await buildAgentContext(agentId);

  // Combine system prompt with knowledge
  const fullSystemPrompt = `${systemPrompt}\n\n${knowledgeContext}\n\nRemember: You SUGGEST strategic moves, you don't DIRECT. The owner makes final decisions.`;

  // Build messages array
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: fullSystemPrompt },
    ...conversationHistory.slice(-10), // Last 10 messages for context
    { role: "user", content: userMessage },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  });

  return completion.choices[0].message.content || "I understand. Let me process that.";
}
