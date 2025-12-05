# 🚀 FASTEST DEPLOYMENT GUIDE - Vercel + Neon

## Quick Deploy (5 minutes)

### Step 1: Deploy to Vercel (2 min)

1. **Go to:** https://vercel.com/new
2. **Import Git Repository:** `ktpcontractings-rgb/tdai-legal-platform-complete`
3. **Click "Deploy"** - Vercel will auto-detect settings from `vercel.json`

### Step 2: Get Neon Database (1 min)

1. **Go to:** https://console.neon.tech
2. **Create new project:** "TDAI Legal Platform"
3. **Copy connection string** (looks like: `postgresql://user:pass@host.neon.tech/dbname`)

### Step 3: Add Environment Variables in Vercel (2 min)

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Required - Database
DATABASE_URL=postgresql://[YOUR_NEON_CONNECTION_STRING]

# Required - OpenAI
OPENAI_API_KEY=sk-[YOUR_OPENAI_KEY]

# Optional - Stripe (add later)
STRIPE_SECRET_KEY=sk_test_[YOUR_STRIPE_KEY]
STRIPE_INDIVIDUAL_PRICE_ID=price_[FROM_STRIPE_DASHBOARD]
STRIPE_SMALL_BUSINESS_PRICE_ID=price_[FROM_STRIPE_DASHBOARD]
STRIPE_ENTERPRISE_PRICE_ID=price_[FROM_STRIPE_DASHBOARD]
STRIPE_TRAFFIC_TICKET_PRICE_ID=price_[FROM_STRIPE_DASHBOARD]
STRIPE_DOCUMENT_REVIEW_PRICE_ID=price_[FROM_STRIPE_DASHBOARD]
STRIPE_CONSULTATION_PRICE_ID=price_[FROM_STRIPE_DASHBOARD]
```

**Click "Save"** then **"Redeploy"**

---

## Step 4: Run Database Setup (After Deploy)

### Option A: Use Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
cd /home/ubuntu/tdai-legal-platform-complete
vercel link

# Run migrations
vercel env pull .env.local
pnpm db:push

# Seed federal agents
pnpm tsx server/seed-federal-agents.ts

# Seed all agents (if needed)
pnpm tsx server/seed-legal-agents.ts
```

### Option B: Use Neon SQL Editor (No CLI needed)

1. **Go to:** Neon Console → SQL Editor
2. **Run migration:** Copy schema from `drizzle/schema.ts`
3. **Seed data:** Run the SQL inserts below

---

## Quick SQL Seed Script (Copy-Paste into Neon)

```sql
-- Add federal agents
INSERT INTO legal_agents (id, name, specialization, title, description, successRate, casesHandled, status, voiceId, avatar, state, trainedBy) VALUES
('agent_immigration_maria', 'Maria Hernandez', 'IMMIGRATION', 'Immigration Law Specialist', 'Expert in federal immigration law (INA), visa applications (H-1B, F-1, K-1), green cards, citizenship, asylum, and deportation defense. Nationwide coverage with USCIS, ICE, and immigration court expertise.', 93.80, 847, 'active', 'EXAVITQu4vr4xnSDxMaL', '🗽', 'FEDERAL', 'ZADE'),
('agent_ip_alexander', 'Alexander Park', 'INTELLECTUAL_PROPERTY', 'Intellectual Property Specialist', 'Federal IP law expert specializing in USPTO trademark and patent applications, copyright registration with US Copyright Office, trade secret protection, and IP licensing. Serves startups, creators, and enterprises nationwide.', 95.40, 612, 'active', 'pNInz6obpgDQGcFmaJgB', '💡', 'FEDERAL', 'ZADE');

-- Note: Knowledge documents will be added via seed script for proper formatting
```

---

## Verify Deployment

1. **Visit your Vercel URL:** `https://your-project.vercel.app`
2. **Check CEO Dashboard:** `/ceo-dashboard`
3. **Check Legal Agents:** Should see Maria (Immigration) and Alexander (IP)
4. **Test Chat:** Send message to management agents

---

## Stripe Setup (Optional - Do Later)

1. **Go to:** https://dashboard.stripe.com
2. **Create Products:**
   - Individual Plan ($49/month)
   - Small Business Plan ($199/month)
   - Traffic Ticket ($29.99 one-time)
   - Document Review ($99.99 one-time)
   - Consultation ($149.99 one-time)
3. **Copy Price IDs** → Add to Vercel Environment Variables
4. **Redeploy**

---

## Troubleshooting

**Build fails:**
- Check Node version (should be 18+)
- Verify all dependencies installed

**Database connection fails:**
- Verify DATABASE_URL format
- Check Neon database is active
- Ensure connection string includes password

**Agents not appearing:**
- Run seed scripts
- Check database has data
- Verify schema migration ran

---

## Status Check Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Check environment variables
vercel env ls
```

---

## 🎯 You're Done!

Your TDAI Legal Platform is now live with:
- ✅ CEO Dashboard with working approvals
- ✅ Stripe payment integration
- ✅ Federal law agents (Immigration + IP)
- ✅ Nationwide coverage

**Next:** Add Stripe keys and start accepting payments! 💰
