# 🚀 DEPLOYMENT GUIDE

**Complete production deployment for Mythology Builder Platform**

---

## 🎯 DEPLOYMENT OVERVIEW

**Hosting Stack:**
- **Frontend:** Vercel (Next.js 14 hosting)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Domain:** Custom domain (optional, e.g., mythologybuilder.com)
- **SSL:** Automatic via Vercel
- **CDN:** Vercel Edge Network (global)

**Cost:** $0/month for pilot (40 students), ~$25-50/month at scale (500+ students)

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### **Phase 0: Prerequisites**
- [ ] Git repository created (GitHub/GitLab/Bitbucket)
- [ ] Vercel account created (sign up with GitHub)
- [ ] Supabase account created
- [ ] OpenAI API key obtained
- [ ] Domain purchased (optional, can use vercel.app subdomain)
- [ ] All code committed to `main` branch

---

## 🔧 STEP 1: SUPABASE SETUP (Backend)

### **A) Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in details:
   - **Name:** `mythology-builder-prod`
   - **Database Password:** Generate strong password (save to password manager)
   - **Region:** Choose closest to your users (e.g., `us-east-1`, `eu-west-1`)
   - **Pricing Plan:** Start with **Free** (upgrades available later)
4. Click **"Create new project"** (takes ~2 minutes)

### **B) Run Database Migrations**

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

Alternatively, run migrations manually in Supabase SQL Editor:

1. Go to **SQL Editor** in Supabase dashboard
2. Run each migration file in order:
   - `supabase/migrations/20240101_create_core_tables.sql`
   - `supabase/migrations/20240102_create_content_tables.sql`
   - ... (all 7 migration files)

### **C) Seed Reference Data**

Run seed script to populate:
- Badges (50+ definitions)
- Style presets (8 presets)
- Deity data (optional, for research library)

```sql
-- In Supabase SQL Editor, run:
-- supabase/migrations/20240107_seed_reference_data.sql
```

### **D) Enable Supabase Realtime**

1. Go to **Database** → **Replication**
2. Enable realtime for these tables:
   - `chat_messages`
   - `notifications`
   - `user_presence`
   - `yjs_documents` (if using Yjs with Supabase)

### **E) Configure Storage Buckets**

1. Go to **Storage** in Supabase dashboard
2. Create buckets:
   - **`avatars`** - Public bucket
   - **`images`** - Public bucket (character/creature images)
   - **`maps`** - Public bucket (exported maps)
   - **`audio`** - Private bucket (student narrations)
   - **`exports`** - Private bucket (PowerPoint/PDF files)

3. Set bucket policies (for each bucket):

```sql
-- Policy: Users can upload to their own folder
CREATE POLICY "Users upload own content"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can read their own content
CREATE POLICY "Users read own content"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Public images are readable
CREATE POLICY "Public images readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Repeat for each bucket with appropriate policies
```

### **F) Get API Keys**

1. Go to **Settings** → **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL:** `https://your-project.supabase.co`
   - **anon public key:** `eyJhbGc...` (safe to expose in browser)
   - **service_role key:** `eyJhbGc...` (NEVER expose in client-side code)

---

## 🌐 STEP 2: VERCEL SETUP (Frontend)

### **A) Install Vercel CLI**

```bash
npm install -g vercel
```

### **B) Login to Vercel**

```bash
vercel login
```

### **C) Link Project**

```bash
# From project root
vercel link
```

Follow prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your personal account or team
- **Link to existing project?** No
- **Project name?** `mythology-builder`

### **D) Configure Environment Variables**

Add environment variables in Vercel dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add the following:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI (for AI features)
OPENAI_API_KEY=sk-your-openai-api-key

# Image Generation (choose one)
IMAGE_GENERATOR=dalle
DALLE_MODEL=dall-e-3
DALLE_SIZE=1024x1024

# App Settings
NEXT_PUBLIC_APP_URL=https://mythology-builder.vercel.app
NODE_ENV=production

# Rate Limiting (optional, requires Upstash Redis)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Error Tracking (optional, for Sentry)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# Analytics (optional, for PostHog)
NEXT_PUBLIC_POSTHOG_KEY=phc_your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Important:** 
- Set these for **Production**, **Preview**, and **Development** environments
- Never commit `.env` file to Git (already in `.gitignore`)

### **E) Deploy to Production**

```bash
# Production deployment
vercel --prod

# Or push to main branch (auto-deploys)
git push origin main
```

Vercel will:
1. Build your Next.js app
2. Run type checking
3. Deploy to global CDN
4. Provide deployment URL (e.g., `https://mythology-builder.vercel.app`)

### **F) Configure Custom Domain (Optional)**

1. Buy domain (Namecheap, Google Domains, Cloudflare)
2. In Vercel dashboard: **Settings** → **Domains**
3. Add custom domain (e.g., `mythologybuilder.com`)
4. Update DNS records (Vercel provides instructions)
   - Add `A` record: `76.76.21.21`
   - Add `CNAME` record: `cname.vercel-dns.com`
5. SSL certificate auto-generated (takes ~5 minutes)

---

## 🔒 STEP 3: SECURITY HARDENING

### **A) Enable Row Level Security (RLS)**

Verify RLS is enabled on all tables:

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Enable RLS on any missing tables
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### **B) Set Up Content Security Policy (CSP)**

```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      connect-src 'self' https://your-project.supabase.co https://api.openai.com;
      frame-src 'self';
    `.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

### **C) Set Up Rate Limiting**

```typescript
// src/app/api/middleware.ts (example using Upstash Redis)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

export async function rateLimit(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(ip);
  
  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }
}
```

### **D) Enable HTTPS Enforcement**

Already handled by Vercel automatically. Verify:
- All requests redirect to HTTPS
- HSTS header is set

---

## 📊 STEP 4: MONITORING & OBSERVABILITY

### **A) Set Up Error Tracking (Sentry)**

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Configure Sentry:

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },
});
```

### **B) Set Up Analytics (PostHog)**

```bash
npm install posthog-js
```

```typescript
// src/lib/analytics.ts
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export { posthog };
```

### **C) Database Monitoring**

1. Go to Supabase dashboard → **Database** → **Query Performance**
2. Monitor slow queries (>100ms)
3. Add indexes for frequently queried columns

### **D) Vercel Analytics**

1. Enable Vercel Analytics in dashboard
2. Monitor:
   - Core Web Vitals (LCP, FID, CLS)
   - Page load times
   - API response times

---

## 🔄 STEP 5: CI/CD PIPELINE

### **A) GitHub Actions for Automated Testing**

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run unit tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npx playwright test
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL_TEST }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY_TEST }}
      
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### **B) Automatic Preview Deployments**

Vercel automatically creates preview deployments for:
- Every push to non-main branches
- Every pull request

Preview URLs: `https://mythology-builder-git-feature-branch.vercel.app`

### **C) Deployment Protection**

1. In Vercel dashboard: **Settings** → **Git**
2. Enable:
   - [ ] Require approval for production deployments
   - [ ] Run checks before deploying (CI must pass)
   - [ ] Lock production branch (only maintainers can merge)

---

## 📝 STEP 6: POST-DEPLOYMENT CHECKLIST

### **Verification Steps**

- [ ] **Homepage loads:** Visit `https://your-app.vercel.app`
- [ ] **Sign up works:** Create test student account
- [ ] **Login works:** Log in with test account
- [ ] **Database connection:** Verify data loads from Supabase
- [ ] **Image upload:** Upload test image (check Supabase Storage)
- [ ] **Content moderation:** Submit text with inappropriate content (should be flagged)
- [ ] **AI generation:** Generate character image (check OpenAI API call)
- [ ] **Real-time features:** Test chat/notifications (check Supabase Realtime)
- [ ] **Mobile responsive:** Test on phone (375px width)
- [ ] **SSL certificate:** Verify HTTPS padlock in browser
- [ ] **Error tracking:** Trigger test error (check Sentry dashboard)
- [ ] **Performance:** Run Lighthouse audit (target: 90+ score)

### **Create Demo Classroom**

1. Sign up as teacher
2. Create classroom with join code
3. Seed demo data (5 students, 10 mythologies)
4. Share with stakeholders for feedback

---

## 🔧 STEP 7: STAGING ENVIRONMENT (OPTIONAL)

For larger teams, set up separate staging environment:

### **A) Create Staging Supabase Project**

1. Create new Supabase project: `mythology-builder-staging`
2. Run migrations
3. Seed with test data

### **B) Create Staging Vercel Project**

```bash
# Deploy to staging branch
git checkout -b staging
vercel --prod

# Set environment variables in Vercel (staging-specific)
```

### **C) Deployment Workflow**

```
develop branch → Preview deployment (auto)
    ↓
staging branch → Staging deployment (manual approval)
    ↓
main branch → Production deployment (manual approval)
```

---

## 📊 STEP 8: SCALING CONSIDERATIONS

### **When to Upgrade:**

| Metric | Free Tier Limit | When to Upgrade |
|--------|----------------|-----------------|
| **Supabase Database** | 500MB | When >400MB used |
| **Supabase Storage** | 1GB | When >800MB used |
| **Supabase Auth** | 50,000 MAUs | When >40,000 students |
| **OpenAI API** | Pay-as-you-go | Monitor monthly spend |
| **Vercel Bandwidth** | 100GB/month | When >80GB used |

### **Upgrade Path:**

1. **Supabase Pro** ($25/month):
   - 8GB database
   - 100GB storage
   - Daily backups
   - Point-in-time recovery

2. **Vercel Pro** ($20/month):
   - 1TB bandwidth
   - Password protection
   - Advanced analytics

3. **OpenAI API:**
   - Set budget limits in OpenAI dashboard
   - Monitor usage per student
   - Implement rate limiting (max 10 generations/day per student)

---

## 🆘 ROLLBACK PROCEDURES

### **A) Rollback Vercel Deployment**

```bash
# Via Vercel dashboard:
# 1. Go to Deployments
# 2. Find previous working deployment
# 3. Click "..." → "Promote to Production"

# Via CLI:
vercel rollback
```

### **B) Rollback Database Migration**

```bash
# Supabase CLI
supabase db reset

# Or manually in SQL Editor:
DROP TABLE new_table;
-- Restore from backup
```

### **C) Emergency Maintenance Mode**

```typescript
// src/middleware.ts
export function middleware(request: Request) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';
  
  if (isMaintenanceMode) {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }
  
  return NextResponse.next();
}
```

Set `MAINTENANCE_MODE=true` in Vercel environment variables.

---

## 📞 SUPPORT & TROUBLESHOOTING

### **Common Issues:**

1. **"502 Bad Gateway"**
   - Check Supabase connection
   - Verify environment variables
   - Check Vercel function logs

2. **"RLS policy violation"**
   - Verify RLS policies in Supabase
   - Check user authentication
   - Review policy conditions

3. **Images not loading**
   - Check Supabase Storage bucket policies
   - Verify CORS settings
   - Check image URLs

4. **Real-time not working**
   - Enable Realtime in Supabase dashboard
   - Check subscription code
   - Verify WebSocket connection

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.

---

## 🎉 LAUNCH CHECKLIST

### **Soft Launch (Week 1)**
- [ ] Deploy to production
- [ ] Invite 1 teacher, 10 students
- [ ] Monitor error logs daily
- [ ] Gather feedback
- [ ] Fix critical bugs

### **Full Launch (Week 2+)**
- [ ] Send announcement email
- [ ] Update documentation
- [ ] Monitor performance metrics
- [ ] Provide teacher training
- [ ] Set up support channel (email/Slack)

---

**Production deployment complete!** 🚀

---

*Deployment guide complete* ✅
