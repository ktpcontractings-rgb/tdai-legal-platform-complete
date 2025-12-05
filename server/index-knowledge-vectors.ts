/**
 * Index Knowledge Vectors
 * Reads all knowledge documents from the database and indexes them in Pinecone
 */

import { getDb } from "./db";
import { knowledgeDocuments } from "../drizzle/schema";
import { indexKnowledgeDocument, deleteAgentKnowledge } from "./rag-vector-store";

async function indexAllKnowledge() {
  console.log("🚀 Starting knowledge indexing process...");

  const db = await getDb();
  if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
  }

  try {
    // Fetch all knowledge documents
    const allDocuments = await db.select().from(knowledgeDocuments);
    console.log(`Found ${allDocuments.length} knowledge documents to index.`);

    // Group documents by agent
    const documentsByAgent = allDocuments.reduce((acc, doc) => {
      if (!acc[doc.agentId]) {
        acc[doc.agentId] = [];
      }
      acc[doc.agentId].push(doc);
      return acc;
    }, {} as Record<string, typeof allDocuments>);

    // Index documents for each agent
    for (const agentId in documentsByAgent) {
      console.log(`\n--- Indexing for Agent: ${agentId} ---`);
      
      // Clear existing knowledge for this agent to prevent duplicates
      await deleteAgentKnowledge(agentId);
      
      const agentDocs = documentsByAgent[agentId];
      for (const doc of agentDocs) {
        await indexKnowledgeDocument(
          doc.agentId,
          doc.id,
          doc.title,
          doc.content,
          {
            category: doc.category,
            sourceType: doc.sourceType,
            importance: doc.importance,
          }
        );
      }
      console.log(`✅ Finished indexing for agent: ${agentId}`);
    }

    console.log("\n🎉 All knowledge documents indexed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Error indexing knowledge documents:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  indexAllKnowledge();
}

export { indexAllKnowledge };
