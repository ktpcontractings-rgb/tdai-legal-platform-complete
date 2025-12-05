#!/bin/bash
set -e

echo "🚀 TDAI Legal Platform - Production Deployment Script"
echo "======================================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ ERROR: DATABASE_URL not set${NC}"
    echo "Please set DATABASE_URL environment variable:"
    echo "  export DATABASE_URL='postgresql://user:pass@host.neon.tech/dbname'"
    exit 1
fi

# Check if OPENAI_API_KEY is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  WARNING: OPENAI_API_KEY not set${NC}"
    echo "AI features will not work without OpenAI API key"
fi

echo -e "${GREEN}✅ Environment variables checked${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Run database migration
echo "🗄️  Running database migration..."
pnpm db:push
echo -e "${GREEN}✅ Database schema updated${NC}"
echo ""

# Seed legal agents (all existing agents)
echo "👥 Seeding legal agents..."
pnpm tsx server/seed-legal-agents.ts
echo -e "${GREEN}✅ Legal agents seeded${NC}"
echo ""

# Seed federal agents (Immigration + IP)
echo "🇺🇸 Seeding federal law agents..."
pnpm tsx server/seed-federal-agents.ts
echo -e "${GREEN}✅ Federal agents seeded${NC}"
echo ""

# Build application
echo "🏗️  Building application..."
pnpm build
echo -e "${GREEN}✅ Build complete${NC}"
echo ""

echo "======================================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Deploy to Vercel: vercel --prod"
echo "2. Or start locally: pnpm start"
echo ""
echo "Federal agents added:"
echo "  🗽 Maria Hernandez - Immigration Law Specialist"
echo "  💡 Alexander Park - Intellectual Property Specialist"
echo ""
echo "Don't forget to add Stripe keys for payment processing!"
echo "======================================================"
