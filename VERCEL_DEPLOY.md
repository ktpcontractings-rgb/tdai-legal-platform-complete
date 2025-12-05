# One-Click Vercel Deployment

## 🚀 Deploy Now

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fktpcontractings-rgb%2Ftdai-legal-platform-complete&env=DATABASE_URL,OPENAI_API_KEY&envDescription=Required%20environment%20variables&envLink=https%3A%2F%2Fgithub.com%2Fktpcontractings-rgb%2Ftdai-legal-platform-complete%2Fblob%2Fmaster%2F.env.railway.example)

## Required Environment Variables

When deploying, you'll be prompted to add these:

### 1. DATABASE_URL (Required)
Get from Neon: https://console.neon.tech

```
postgresql://user:password@host.neon.tech:5432/dbname?sslmode=require
```

### 2. OPENAI_API_KEY (Required)
Get from OpenAI: https://platform.openai.com/api-keys

```
sk-proj-...
```

### 3. Stripe Keys (Optional - Add Later)
Get from Stripe: https://dashboard.stripe.com/apikeys

```
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_INDIVIDUAL_PRICE_ID=price_...
STRIPE_SMALL_BUSINESS_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
STRIPE_TRAFFIC_TICKET_PRICE_ID=price_...
STRIPE_DOCUMENT_REVIEW_PRICE_ID=price_...
STRIPE_CONSULTATION_PRICE_ID=price_...
```

## Post-Deployment Setup

After Vercel deployment completes:

### Option 1: Automatic Setup (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Run setup:
```bash
vercel login
cd tdai-legal-platform-complete
vercel link
vercel env pull .env.local
./scripts/deploy-production.sh
```

### Option 2: Manual SQL Setup

1. Go to Neon Console → SQL Editor
2. Copy and run the schema from `drizzle/schema.ts`
3. Run seed scripts manually or use SQL inserts

## Verify Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Check `/ceo-dashboard` - Should see working chat and approvals
3. Check legal agents - Should see Immigration and IP specialists
4. Test payment flow (if Stripe configured)

## Troubleshooting

**Build Error:**
- Check Node version in Vercel settings (set to 18.x or 20.x)
- Verify `package.json` scripts are correct

**Database Connection Error:**
- Verify DATABASE_URL format includes `?sslmode=require`
- Check Neon database is active
- Ensure IP allowlist includes Vercel IPs (or set to allow all)

**Missing Agents:**
- Run seed scripts via Vercel CLI
- Or manually insert via Neon SQL Editor

## Support

For issues, check:
- Vercel deployment logs
- Neon database logs
- Browser console errors

## What's Included

✅ CEO Dashboard with working approvals
✅ Stripe payment integration
✅ Federal law agents (Immigration + IP)
✅ Management agent chat with individual knowledge bases
✅ Nationwide legal coverage

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Add environment variables
3. ✅ Run database setup
4. 🔄 Configure Stripe products
5. 🔄 Test all features
6. 🚀 Go
