# RAG Deployment Guide - Pinecone Vector Storage

## Summary of Implementation

This deployment integrates RAG (Retrieval-Augmented Generation) with Pinecone vector storage for intelligent semantic search across all agent knowledge bases.

### Key Features
- **Semantic Search:** Agents can now understand the meaning behind user queries, not just keywords.
- **Vector Embeddings:** Knowledge documents are converted into vectors using OpenAI's `text-embedding-3-small` model.
- **Pinecone Integration:** Vectors are stored and queried in Pinecone, a high-performance vector database.
- **Agent-Specific Knowledge:** Each agent has their own namespace in Pinecone, ensuring knowledge is not shared.
- **RAG-Enhanced Responses:** Agent responses are now augmented with relevant knowledge retrieved from Pinecone.

## Deployment Steps

### 1. Set Environment Variables

Add these to your production environment (Vercel, Railway, etc.):

```bash
# Pinecone API Key (Required)
PINECONE_API_KEY=your_pinecone_api_key

# OpenAI API Key (Required)
OPENAI_API_KEY=your_openai_api_key

# Database URL (Required)
DATABASE_URL=postgresql://...
```

### 2. Run Knowledge Indexing Script

This script will:
1. Create the Pinecone index if it doesn't exist.
2. Fetch all knowledge documents from your database.
3. Generate vector embeddings for each document chunk.
4. Upsert the vectors into Pinecone under the correct agent namespace.

```bash
# Run from project root
pnpm tsx server/index-knowledge-vectors.ts
```

**Expected Output:**
```
🚀 Starting knowledge indexing process...
Found 20 knowledge documents to index.

--- Indexing for Agent: mgmt_ceo_evelyn ---
✅ Indexed 4 chunks for document: Unicorn Scaling Strategy
✅ Indexed 3 chunks for document: Market Expansion Plan
...

🎉 All knowledge documents indexed successfully!
```

### 3. Deploy Application

Push the latest code to your hosting provider (Vercel, Railway, etc.). The new RAG system is now live!

```bash
# Commit and push changes
git add -A
git commit -m "feat: Implement RAG with Pinecone vector storage"
git push
```

## How It Works

1. **User sends message:** e.g., "What's our strategy for entering the European market?"
2. **Query embedding:** The user's message is converted into a vector embedding.
3. **Pinecone query:** The vector is used to search the relevant agent's namespace in Pinecone (e.g., `mgmt_ceo_evelyn`).
4. **Retrieve knowledge:** Pinecone returns the most relevant knowledge chunks based on semantic similarity.
5. **Build context:** The retrieved chunks are compiled into a context block.
6. **Generate response:** The context, user query, and conversation history are sent to GPT-4.1-mini to generate a RAG-enhanced response.
7. **User receives response:** The agent provides a detailed, context-aware answer based on their knowledge base.

## Testing the RAG System

### 1. Verify Indexing

After running the indexing script, check your Pinecone dashboard:
- Verify the `tdai-knowledge-base` index exists.
- Check the vector count and namespaces.

### 2. Test CEO Chat

1. Go to the CEO Dashboard.
2. Ask a question that requires knowledge from the agent's documents (e.g., "What are the key pillars of our unicorn scaling strategy?").
3. Verify the response is detailed and references the knowledge base.

### 3. Check Logs

- Vercel runtime logs should show successful queries to Pinecone.
- No errors related to embedding generation or vector search.

## New Files

- `server/rag-vector-store.ts`: Core RAG and Pinecone integration logic.
- `server/index-knowledge-vectors.ts`: Script to index all knowledge documents.

## Modified Files

- `server/routers.ts`: Updated `ceoChat.sendMessage` to use `generateRAGResponse`.

## Strategic Impact

- **Smarter Agents:** Agents can now provide much more intelligent and context-aware responses.
- **Scalable Knowledge:** Easily add new knowledge documents and re-index.
- **Improved User Experience:** Users get more accurate and relevant answers.
- **Competitive Advantage:** State-of-the-art AI architecture.

## Next Steps

- **Add more knowledge documents:** The more high-quality knowledge you add, the smarter the agents become.
- **Fine-tune chunking:** Experiment with different chunk sizes and overlaps for optimal retrieval.
- **Implement hybrid search:** Combine keyword search with vector search for even better results.
- **Monitor performance:** Track query latency and response quality.

---

**Status:** ✅ RAG system complete and ready for deployment.
