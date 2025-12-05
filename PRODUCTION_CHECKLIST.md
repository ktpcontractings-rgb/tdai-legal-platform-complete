# Production Deployment Checklist

## Pre-Deployment

### 1. Environment Setup
- [ ] Create Neon PostgreSQL database
- [ ] Create Pinecone account and get API key
- [ ] Get OpenAI API key
- [ ] Create Stripe account (for payments)
- [ ] Set up Vercel account

### 2. Database Configuration
- [ ] Copy Neon connection string
- [ ] Verify database is accessible
- [ ] Set `DATABASE_URL` in environment variables

### 3. API Keys
- [ ] Set `OPENAI_API_KEY`
- [ ] Set `PINECONE_API_KEY`
- [ ] Set `STRIPE_SECRET_KEY` (optional, can add later)

## Deployment Steps

### Option A: Automated Deployment (Recommended)

1. **Clone repository:**
```bash
git clone https://github.com/ktpcontractings-rgb/tdai-legal-platform-complete.git
cd tdai-legal-platform-complete
```

2. **Set environment variables:**
```bash
export DATABASE_URL="postgresql://..."
export OPENAI_API_KEY="sk-..."
export PINECONE_API_KEY="..."
```

3. **Run deployment script:**
```bash
./scripts/deploy-complete.sh
```

4. **Deploy to Vercel:**
```bash
vercel --prod
```

### Option B: Manual Deployment

1. **Install dependencies:**
```bash
pnpm install
```

2. **Run database migration:**
```bash
pnpm db:push
```

3. **Seed legal agents:**
```bash
pnpm tsx server/seed-legal-agents.ts
```

4. **Seed federal agents:**
```bash
pnpm tsx server/seed-federal-agents.ts
```

5. **Index knowledge vectors:**
```bash
pnpm tsx server/index-knowledge-vectors.ts
```

6. **Build application:**
```bash
pnpm build
```

7. **Deploy:**
```bash
vercel --prod
```

## Post-Deployment

### 1. Verify Deployment
- [ ] Visit production URL
- [ ] Check homepage loads
- [ ] Verify CEO Dashboard accessible at `/ceo-dashboard`
- [ ] Check legal agents page

### 2. Test Core Features
- [ ] CEO Dashboard chat with management agents
- [ ] Approve/reject functionality works
- [ ] Legal agents display correctly
- [ ] Immigration agent appears (Federal)
- [ ] IP agent appears (Federal)

### 3. Test RAG System
- [ ] Ask a knowledge-based question in CEO chat
- [ ] Verify response includes relevant knowledge
- [ ] Check Pinecone dashboard for vector count

### 4. Configure Stripe (Optional)
- [ ] Create products in Stripe Dashboard:
  - Individual Plan ($49/month)
  - Small Business Plan ($199/month)
  - Traffic Ticket ($29.99)
  - Document Review ($99.99)
  - Consultation ($149.99)
- [ ] Copy Price IDs
- [ ] Add to Vercel environment variables
- [ ] Redeploy

### 5. Set Up Monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (Sentry recommended)
- [ ] Monitor database performance (Neon dashboard)
- [ ] Monitor Pinecone usage

## Production Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...

# Optional (Stripe)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_INDIVIDUAL_PRICE_ID=price_...
STRIPE_SMALL_BUSINESS_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
STRIPE_TRAFFIC_TICKET_PRICE_ID=price_...
STRIPE_DOCUMENT_REVIEW_PRICE_ID=price_...
STRIPE_CONSULTATION_PRICE_ID=price_...

# Auto-set by Vercel
PORT=3000
NODE_ENV=production
```

## Troubleshooting

### Build Fails
- Check Node version (18.x or 20.x)
- Verify all dependencies installed
- Check for TypeScript errors

### Database Connection Fails
- Verify `DATABASE_URL` format
- Check Neon database is active
- Ensure connection string includes `?sslmode=require`

### Agents Not Appearing
- Run seed scripts
- Check database has data
- Verify schema migration ran successfully

### RAG Not Working
- Verify `PINECONE_API_KEY` is set
- Check Pinecone index exists
- Run indexing script
- Check OpenAI API key is valid

### Stripe Errors
- Verify API keys (test vs live)
- Check Price IDs are correct
- Ensure products exist in Stripe Dashboard

## Performance Optimization

### Database
- [ ] Enable connection pooling
- [ ] Set up read replicas (if needed)
- [ ] Monitor query performance

### Pinecone
- [ ] Monitor vector count
- [ ] Optimize chunk size if needed
- [ ] Consider upgrading plan for production

### Vercel
- [ ] Enable Edge Functions for faster responses
- [ ] Set up CDN for static assets
- [ ] Configure caching headers

## Security

- [ ] Enable HTTPS (Vercel does this automatically)
- [ ] Set up CORS properly
- [ ] Rotate API keys regularly
- [ ] Enable rate limiting
- [ ] Set up DDoS protection (Vercel provides this)

## Scaling Checklist

### When you hit 100 users:
- [ ] Upgrade Neon database plan
- [ ] Upgrade Pinecone plan
- [ ] Monitor OpenAI API usage
- [ ] Consider caching frequently accessed data

### When you hit 1,000 users:
- [ ] Implement Redis for caching
- [ ] Set up database read replicas
- [ ] Optimize vector search queries
- [ ] Consider dedicated infrastructure

### When you hit 10,000 users (Unicorn path 🦄):
- [ ] Migrate to dedicated database cluster
- [ ] Implement microservices architecture
- [ ] Set up multi-region deployment
- [ ] Hire first employee (or stay single-employee unicorn!)

## Support

For issues:
- Check Vercel deployment logs
- Check Neon database logs
- Check browser console errors
- Review Pinecone dashboard

## Status

- [x] All features implemented
- [x] Code pushed to GitHub
- [x] Deployment scripts ready
- [ ] Production deployment complete
- [ ] All tests passing
- [ ] Monitoring set up

---

**Ready to deploy and scale to unicorn status! 🦄**
