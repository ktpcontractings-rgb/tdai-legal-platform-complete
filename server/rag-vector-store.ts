/**
 * RAG Vector Storage System
 * Uses Pinecone for semantic search across agent knowledge bases
 * Each agent has their own namespace for isolated knowledge retrieval
 */

import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

// Initialize OpenAI for embeddings
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// Index configuration
const INDEX_NAME = "tdai-knowledge-base";
const EMBEDDING_MODEL = "text-embedding-3-small"; // 1536 dimensions, cost-effective
const EMBEDDING_DIMENSION = 1536;

/**
 * Get or create Pinecone index
 */
export async function getOrCreateIndex() {
  try {
    // Check if index exists
    const indexes = await pinecone.listIndexes();
    const indexExists = indexes.indexes?.some((idx) => idx.name === INDEX_NAME);

    if (!indexExists) {
      console.log(`Creating Pinecone index: ${INDEX_NAME}`);
      await pinecone.createIndex({
        name: INDEX_NAME,
        dimension: EMBEDDING_DIMENSION,
        metric: "cosine",
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-east-1",
          },
        },
      });
      
      // Wait for index to be ready
      console.log("Waiting for index to be ready...");
      await new Promise((resolve) => setTimeout(resolve, 60000)); // 60 seconds
    }

    return pinecone.index(INDEX_NAME);
  } catch (error) {
    console.error("Error getting/creating Pinecone index:", error);
    throw error;
  }
}

/**
 * Generate embedding for text using OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

/**
 * Chunk text into smaller pieces for better retrieval
 */
export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end - overlap; // Overlap for context continuity
  }

  return chunks;
}

/**
 * Index a knowledge document with vector embeddings
 */
export async function indexKnowledgeDocument(
  agentId: string,
  documentId: string,
  title: string,
  content: string,
  metadata: Record<string, any> = {}
) {
  try {
    const index = await getOrCreateIndex();
    
    // Chunk the content for better retrieval
    const chunks = chunkText(content);
    
    // Generate embeddings for each chunk
    const vectors = await Promise.all(
      chunks.map(async (chunk, idx) => {
        const embedding = await generateEmbedding(chunk);
        
        return {
          id: `${documentId}-chunk-${idx}`,
          values: embedding,
          metadata: {
            agentId,
            documentId,
            title,
            content: chunk,
            chunkIndex: idx,
            totalChunks: chunks.length,
            ...metadata,
          },
        };
      })
    );

    // Upsert vectors to Pinecone with agent-specific namespace
    await index.namespace(agentId).upsert(vectors);

    console.log(`✅ Indexed ${chunks.length} chunks for document: ${title} (Agent: ${agentId})`);
    
    return {
      success: true,
      documentId,
      chunksIndexed: chunks.length,
    };
  } catch (error) {
    console.error(`Error indexing document ${documentId}:`, error);
    throw error;
  }
}

/**
 * Query vector store for relevant knowledge
 */
export async function queryKnowledge(
  agentId: string,
  query: string,
  topK: number = 5,
  filter?: Record<string, any>
): Promise<Array<{ content: string; score: number; metadata: any }>> {
  try {
    const index = await getOrCreateIndex();
    
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);
    
    // Query Pinecone with agent-specific namespace
    const results = await index.namespace(agentId).query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter,
    });

    // Extract and format results
    const formattedResults = results.matches.map((match) => ({
      content: match.metadata?.content as string || "",
      score: match.score || 0,
      metadata: match.metadata || {},
    }));

    return formattedResults;
  } catch (error) {
    console.error(`Error querying knowledge for agent ${agentId}:`, error);
    throw error;
  }
}

/**
 * Delete all vectors for a specific document
 */
export async function deleteKnowledgeDocument(agentId: string, documentId: string) {
  try {
    const index = await getOrCreateIndex();
    
    // Delete all chunks for this document
    await index.namespace(agentId).deleteMany({
      documentId,
    });

    console.log(`✅ Deleted document: ${documentId} (Agent: ${agentId})`);
    
    return { success: true, documentId };
  } catch (error) {
    console.error(`Error deleting document ${documentId}:`, error);
    throw error;
  }
}

/**
 * Delete all vectors for a specific agent
 */
export async function deleteAgentKnowledge(agentId: string) {
  try {
    const index = await getOrCreateIndex();
    
    // Delete entire namespace for agent
    await index.namespace(agentId).deleteAll();

    console.log(`✅ Deleted all knowledge for agent: ${agentId}`);
    
    return { success: true, agentId };
  } catch (error) {
    console.error(`Error deleting agent knowledge for ${agentId}:`, error);
    throw error;
  }
}

/**
 * Get index statistics
 */
export async function getIndexStats() {
  try {
    const index = await getOrCreateIndex();
    const stats = await index.describeIndexStats();
    
    return stats;
  } catch (error) {
    console.error("Error getting index stats:", error);
    throw error;
  }
}

/**
 * Build RAG context from query results
 */
export function buildRAGContext(
  results: Array<{ content: string; score: number; metadata: any }>,
  maxTokens: number = 3000
): string {
  let context = "";
  let tokenCount = 0;

  for (const result of results) {
    // Rough token estimation (1 token ≈ 4 characters)
    const estimatedTokens = result.content.length / 4;
    
    if (tokenCount + estimatedTokens > maxTokens) {
      break;

    }
    
    context += `\n\n--- Knowledge Chunk (Relevance: ${(result.score * 100).toFixed(1)}%) ---\n`;
    context += `Title: ${result.metadata.title || "Unknown"}\n`;
    context += `Content: ${result.content}\n`;
    
    tokenCount += estimatedTokens;
  }

  return context;
}

/**
 * Enhanced agent response
 with RAG
 */
export async function generateRAGResponse(
  agentId: string,
  agentRole: string,
  userQuery: string,
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  try {
    // Query vector store for relevant knowledge
    const relevantKnowledge = await queryKnowledge(agentId, userQuery, 5);
    
    // Build context from retrieved knowledge
    const ragContext = buildRAGContext(relevantKnowledge);
    
    // Construct system prompt with RAG context
    const systemPrompt = `You are a ${agentRole} for TDAI Legal Platform with world-class Fortune 500 expertise.

Your mission: Scale TDAI from pre-seed to nationwide unicorn ($1B valuation in 3 years) as the first single-employee unicorn.

Communication style: SUGGEST strategic moves, don't DIRECT. You're an advisor, not a commander.

Use the following knowledge base to inform your response:

${ragContext}

Provide strategic, actionable advice based on the knowledge above and your expertise.`;

    // Generate response with OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        
...conversationHistory,
        { role: "user", content: userQuery },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating RAG response:", error);
    throw error;
  }
}

export default {
  getOrCreateIndex,
  generateEmbedding,
  chunkText,
  indexKnowledgeDocument,
  queryKnowledge,
  deleteKnowledgeDocument,
  deleteAgentKnowledge,
  getIndexStats,
  buildRAGContext,
  generateRAGResponse,
};
