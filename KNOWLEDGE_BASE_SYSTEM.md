# Individual Knowledge Base System for Management Agents

## Overview

Each management agent (CEO, CTO, PM, MARKETING, BILLING, LEGAL) has their own **isolated knowledge database**. This ensures that each agent has specialized expertise relevant to their role, rather than sharing a single generic knowledge base.

## Architecture

### Database Schema

**`knowledge_documents` table:**
- `id`: Unique identifier
- `agentId`: Links knowledge to specific agent (CRITICAL - each agent has their own knowledge)
- `title`: Knowledge document title
- `content`: The actual knowledge content
- `category`: Type of knowledge (strategy, technical, market_research, etc.)
- `sourceType`: How knowledge was acquired (manual, learned, imported, generated)
- `importance`: Priority level (1-10 scale)
- `vectorId`: For semantic search via Pinecone (optional)
- `createdAt`, `updatedAt`: Timestamps

### Knowledge Initialization

Each agent role has predefined knowledge areas in `server/agent-knowledge-init.ts`:

**CEO Knowledge:**
- Strategic Growth Framework
- Legal Tech Market Analysis  
- Revenue Scaling Playbook
- Focus: Aggressive scaling to unicorn status

**CTO Knowledge:**
- AI Architecture Stack
- Scalability Roadmap
- Security & Compliance
- Focus: Technical excellence and infrastructure

**PM Knowledge:**
- Product Roadmap
- User Persona Research
- Feature Prioritization Framework
- Focus: Product strategy and user needs

**MARKETING Knowledge:**
- Customer Acquisition Strategy
- Brand Positioning
- Growth Metrics
- Focus: User growth and revenue

**BILLING Knowledge:**
- Pricing Strategy
- Revenue Forecasting
- Payment Systems
- Focus: Financial operations

**LEGAL Knowledge:**
- Regulatory Compliance Framework
- Quality Assurance Protocol
- Risk Management
- Focus: Legal compliance and risk mitigation

## API Endpoints

### tRPC Routes

**`ceoChat.getHistory`**
- Get chat conversation history
- Returns messages with timestamps and agent IDs

**`ceoChat.sendMessage`**
- Send message to specific management agent
- Parameters: `message`, `targetAgent` (optional, defaults to CEO)
- Returns: User message, agent response, responding agent

**`ceoChat.initializeAgentKnowledge`**
- Initialize knowledge base for a new agent
- Parameters: `agentId`, `role`
- Loads predefined knowledge for that role

## Knowledge Functions

Located in `server/agent-knowledge.ts`:

**`getAgentKnowledge(agentId)`**
- Retrieve all knowledge documents for an agent

**`buildAgentContext(agentId)`**
- Build formatted context string from agent's knowledge base
- Used in AI prompts

**`getAgentSystemPrompt(role)`**
- Get role-specific system prompt
- Defines agent personality and mandate

**`initializeAgentKnowledge(agentId, role)`**
- Load initial knowledge base for new agent

**`addAgentKnowledge(...)`**
- Add new knowledge to agent's database
- Supports learning and knowledge growth

**`getAgentResponse(agentId, role, userMessage, conversationHistory)`**
- Generate AI response using agent's specific knowledge base
- Combines system prompt + knowledge context + conversation history
- Uses OpenAI GPT-4.1-mini

## Agent Communication Style

All agents follow these principles:
1. **SUGGEST, don't DIRECT** - Agents suggest strategic moves, owner makes final decisions
2. **World-class expertise** - Fortune 500 level knowledge in their domain
3. **Nationwide scope** - Knowledge covers all US markets and regulations
4. **Strategic mandate** - Focus on scaling from pre-seed to unicorn ($1B+ valuation)
5. **Goal** - First single-employee unicorn corporation

## Frontend Integration

### CEO Dashboard (`client/src/pages/CEODashboard.tsx`)

**Features:**
- Agent selector (CEO, CTO, PM, MARKETING, BILLING, LEGAL)
- Chat history display with timestamps
- Real-time message sending
- Visual distinction between user and agent messages
- Agent-specific color coding

**Usage:**
1. Select which management agent to talk to
2. Type message in textarea
3. Press Enter or click "Send to [AGENT]"
4. Agent responds using their specialized knowledge base
5. Conversation history persists in database

## Knowledge Learning & Growth

Agents can learn new knowledge through:
1. **Manual addition** - Admin adds knowledge documents
2. **Learned** - Agent learns from interactions (future feature)
3. **Imported** - Import from external sources
4. **Generated** - AI-generated knowledge synthesis

## Database Migration

To apply the schema changes:

```bash
pnpm db:push
```

This will:
1. Add `ceo_chat_messages` table
2. Update `knowledge_documents` table with `agentId` field
3. Add new category and sourceType enums

## Deployment Notes

**Environment Variables Required:**
- `DATABASE_URL` - Neon PostgreSQL connection
- `OPENAI_API_KEY` - For AI responses

**First-Time Setup:**
1. Deploy schema changes
2. Create management agents (if not exist)
3. Initialize knowledge bases for each agent
4. Test chat functionality

## Future Enhancements

1. **Vector Search** - Use Pinecone for semantic knowledge retrieval
2. **Knowledge Graphs** - Link related knowledge documents
3. **Learning Loop** - Agents automatically learn from successful interactions
4. **Inter-Agent Communication** - Agents consult each other's knowledge
5. **Knowledge Versioning** - Track knowledge evolution over time
6. **Confidence Scoring** - Rate knowledge reliability
7. **Knowledge Pruning** - Remove outdated or incorrect knowledge

## Security Considerations

1. **Access Control** - Only authenticated users can access CEO chat
2. **Audit Logging** - All messages logged for compliance
3. **Data Encryption** - Sensitive knowledge should be encrypted
4. **Rate Limiting** - Prevent API abuse
5. **Input Validation** - Sanitize all user inputs

## Monitoring & Analytics

Track:
- Message volume per agent
- Response quality metrics
- Knowledge utilization rates
- Agent performance comparisons
- User satisfaction with agent responses
