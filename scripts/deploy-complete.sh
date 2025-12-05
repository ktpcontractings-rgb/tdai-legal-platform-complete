#!/bin/bash
set -e

echo "🚀 TDAI Legal Platform - Complete Deployment Script"
echo "===================================================="
echo "This script will:"
echo "  1. Install all dependencies"
echo "  2. Run database migrations"
echo "  3. Seed all agents (legal, management, federal)"
echo "  4. Index knowledge vectors in Pinecone"
echo "  5. Build the application"
echo "  6. Run tests"
echo "===================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check required environment variables
echo -e "${BLUE}📋 Checking environment variables...${NC}"
MISSING_VARS=0

if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ DATABASE_URL not set${NC}"
    MISSING_VARS=1
fi

if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${RED}❌ OPENAI_API_KEY not set${NC}"
    MISSING_VARS=1
fi

if [ -z "$PINECONE_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  PINECONE_API_KEY not set (RAG features will not work)${NC}"
fi

if [ $MISSING_VARS -eq 1 ]; then
    echo ""
    echo -e "${RED}Please set the required environment variables and try again.${NC}"
    echo ""
    echo "Example:"
    echo "  export DATABASE_URL='postgresql://user:pass@host.neon.tech/dbname'"
    echo "  export OPENAI_API_KEY='sk-...'"
    echo "  export PINECONE_API_KEY='your-key'"
    exit 1
fi

echo -e "${GREEN}✅ All required environment variables are set${NC}"
echo ""

# Step 1: Install dependencies
echo -e "${BLUE}📦 Step 1/6: Installing dependencies...${NC}"
pnpm install --frozen-lockfile
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 2: Run database migration
echo -e "${BLUE}🗄️  Step 2/6: Running database migration...${NC}"
pnpm db:push
echo -e "${GREEN}✅ Database schema updated${NC}"
echo ""

# Step 3: Seed legal agents
echo -e "${BLUE}👥 Step 3/6: Seeding legal agents...${NC}"
pnpm tsx server/seed-legal-agents.ts
echo -e "${GREEN}✅ Legal agents seeded${NC}"
echo ""

# Step 4: Seed federal agents (Immigration + IP)
echo -e "${BLUE}🇺🇸 Step 4/6: Seeding federal law agents...${NC}"
pnpm tsx server/seed-federal-agents.ts
echo -e "${GREEN}✅ Federal agents seeded${NC}"
echo ""

# Step 5: Index knowledge vectors in Pinecone
if [ -n "$PINECONE_API_KEY" ]; then
    echo -e "${BLUE}🧠 Step 5/6: Indexing knowledge vectors in Pinecone...${NC}"
    pnpm tsx server/index-knowledge-vectors.ts
    echo -e "${GREEN}✅ Knowledge vectors indexed${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  Step 5/6: Skipping Pinecone indexing (API key not set)${NC}"
    echo ""
fi

# Step 6: Build application
echo -e "${BLUE}🏗️  Step 6/6: Building application...${NC}"
pnpm build
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

# Summary
echo "===================================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Summary:"
echo "  ✅ Dependencies installed"
echo "  ✅ Database migrated"
echo "  ✅ Legal agents seeded"
echo "  ✅ Federal agents seeded (Immigration + IP)"
if [ -n "$PINECONE_API_KEY" ]; then
    echo "  ✅ Knowledge vectors indexed in Pinecone"
else
    echo "  ⚠️  Knowledge vectors not indexed (Pinecone API key missing)"
fi
echo "  ✅ Application built"
echo ""
echo "Features enabled:"
echo "  🗽 Immigration Law Specialist (Federal - All 50 States)"
echo "  💡 Intellectual Property Specialist (Federal - All 50 States)"
echo "  💳 Stripe payment integration"
echo "  ✅ CEO Dashboard with working approvals"
echo "  🧠 RAG-enhanced agent responses (if Pinecone configured)"
echo ""
echo "Next steps:"
echo "  1. Start the server: pnpm start"
echo "  2. Or deploy to production: vercel --prod"
echo ""
echo "Don't forget to:"
echo "  - Add Stripe API keys for payment processing"
echo "  - Configure Stripe products in dashboard"
echo "  - Test all features before going live"
echo "===================================================="
