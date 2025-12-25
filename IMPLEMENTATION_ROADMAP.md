# 🗺️ MYTHOLOGY PROJECT - IMPLEMENTATION ROADMAP
## Phase-by-Phase, Step-by-Step Integration Plan

*Created: December 18, 2025*  
*Last Updated: December 25, 2025*  
*Status: Phase 2E COMPLETE - Phases 0, 1, 2A-E implemented (80% Complete)*

---

## ✅ CURRENT IMPLEMENTATION STATUS

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0 | ✅ Complete | Project setup, Next.js, Supabase |
| Phase 1 | ✅ Complete | Auth, CRUD, galleries, teacher tools |
| Phase 2A | ✅ Complete | Stories (TipTap rich text) |
| Phase 2B | ✅ Complete | Maps (Konva.js canvas) |
| Phase 2C | ✅ Complete | Relationships (Cytoscape.js) + Realms |
| Phase 2D | ✅ Complete | AI Battles (GPT-4 + animated playback) |
| Phase 2E | ✅ Complete | Crossover Events (battles, alliances, stories) |
| Phase 3 | ⏸️ Next | Gamification (points, badges, levels) |
| Phase 4-7 | ⏸️ Pending | Collaboration, AI Enhancement, Presentations, Polish |

**Test Data:** Oceanborn Legends mythology (87 entities: 35 chars, 25 creatures, 10 realms, 12 stories, 5 maps)

---

## 🎯 MISSION BRIEFING

**Objective:** Transform 16 questions (~12,000 lines of features) + architecture plan into actionable, sequential implementation plan.

**Current State:**
- ✅ PLAN.md exists (basic architecture, high-level phases)
- ✅ BRAINSTORM_DECISIONS.md exists (16 detailed questions, all features approved)
- ❌ No clear hosting decision (Netlify vs Railway vs Vercel)
- ❌ No step-by-step implementation sequence
- ❌ No research task roadmap

**Goal:** Create clear START HERE → STEP 1 → STEP 2 → ... → LAUNCH plan.

---

## 📊 FEATURE INVENTORY (FROM BRAINSTORM_DECISIONS.md)

### **QUESTIONS 1-8: Core Infrastructure**
1. **Teacher Dashboard** - Student profiles, impersonation, bulk actions, analytics
2. **Grading System** - Rubric-based grading, unlimited submissions, AI assistance
3. **Relationship Mapping** - Interactive graphs (Cytoscape.js), multiple views, export
4. **Mobile Experience** - Touch-optimized, speech-to-text, mobile-first responsive
5. **Accessibility** - TTS, STT, WCAG 2.1 AA, screen reader support, keyboard navigation
6. **Onboarding** - Optional tutorials, demo classroom, progressive disclosure, skip option
7. **Themes & Customization** - 12 themes (Cyberpunk Neon, Ancient Scrolls, etc.), badges, profiles
8. **Collaboration** - Real-time co-editing (Yjs CRDT), group chat, mythology merging, permissions

### **QUESTION 9: Story & Narrative System**
- Multiple writing modes (structured, freeform, AI-assisted, template-based, timeline mode)
- Story types (origin, conflict, quest, daily life, prophecy, crossover)
- AI story assistance (prompts, continuation, feedback, conflict generator)
- Version history
- Word count tracking
- Character/creature tagging
- Example: WW2 mythology (1939-1945, Panzer-Thor, Blitzkrieg myths)

### **QUESTION 10: World Maps & Geography**
- Custom coordinate systems (lat/long for any setting)
- Interactive map building (Konva/Fabric.js)
- Drawing tools (regions, mountains, rivers, cities, labels, icons)
- Location markers (clickable, show details)
- Geography-culture integration
- Example: WW2 European theater with military grid coordinates
- Export maps (PNG/SVG)
- Multiple maps per mythology (world map, regional maps, city maps)

### **QUESTION 11: Cross-Mythology Interactions**
- AI-simulated battles (GPT-4 generates outcomes)
- Crossover collaborations (co-author stories)
- Mythology alliances/conflicts
- Teacher-created events (class-wide battles, tournaments)
- Battle reports (narrative + stats)
- Crossover request system
- Battle history tracking
- Seasonal events

### **QUESTION 12: Gamification & Motivation**
- Points system (character creation +50, story completion +100, etc.)
- Badges (50+ types: First Creation, Epic Worldbuilder, Battle Champion, etc.)
- Leaderboards (points, creativity, collaboration - multiple ways to win)
- Streaks (daily login, creation streaks)
- Levels (1-50+)
- Avatar customization:
  - Hybrid system: Avataaars (free base) + custom mythology items
  - Unlockable items (earn through progression)
  - Ready Player Me integration (Phase 4, 3D avatars)
- Card battle system (MTG/Yu-Gi-Oh style, Phase 4)
- Honest-but-encouraging feedback philosophy

### **QUESTION 13: Research & Inspiration Library**
- Curated resources (mythology books, articles, videos, images)
- Teacher can add/remove resources
- Cross-cultural deity comparisons:
  - War gods: Ares, Mars, Odin, Huitzilopochtli, Sekhmet, Morrigan, Kali, Bishamonten
  - Death gods, tricksters, creation gods, sea gods
  - Compare across 8+ cultures (Greek, Roman, Norse, Aztec, Egyptian, Celtic, Hindu, Japanese)
- AI research assistant (answer questions, suggest connections)
- Contextual suggestions (while creating character, AI suggests similar deities)
- Citation tracking (subtle, not intrusive)
- Search & filter

### **QUESTION 14: Version History & Backups**
- Auto-save every 2 minutes
- Keep last 5 auto-save versions (rolling window)
- Manual save points (student can save up to 10 named versions)
- Soft delete (10-day recovery period)
- Edit attribution (who changed what, when)
- Edit conflict prevention (Yjs CRDT)
- Submission workflow (student submits → teacher grades → student revises)
- Orphaned work protection (if student leaves group)
- Export options:
  - PDF (print-ready)
  - HTML (standalone webpage)
  - JSON (data export)
  - Markdown (portable format)
- Teacher backup/restore/rollback controls

### **QUESTION 15: Presentation Mode**
- Distraction-free display (hide UI clutter, full-screen)
- Use student's chosen theme (consistent branding)
- Badge showcase (display achievements on title slide)
- TTS narration:
  - AI reads content aloud
  - Auto-advance slides after reading
  - Adjustable speed & voice selection
- Student records own narration (per-slide audio recording)
- Multi-student presenter mode (group presentations, seamless handoffs)
- Split-screen for co-authors (crossover presentations)
- Export formats:
  - PowerPoint (.pptx)
  - Google Slides (shareable link)
  - PDF (print handouts)
  - HTML (standalone webpage)
- Shareable links (password-protected, view tracking)
- Classroom projector setup (MacBook → HDMI → TV)
- Presenter view (MacBook: notes/timer, TV: clean slides)
- Content selection:
  - Student chooses what to present
  - AI recommends best content
  - Teacher sets requirements (must include X characters, Y stories)

### **QUESTION 16: Image Generation System (THE BIG ONE)**
- Generation engines:
  - Midjourney (artistic, stylized, epic fantasy)
  - DALL-E 3 (fast, realistic, OpenAI integration)
  - Mix-and-match based on use case
- AI prompting intelligence:
  - Simple input ("ice goddess") → AI expands to detailed prompt
  - AI examines character data → builds mega-prompt automatically
  - Students can adjust prompts before generating
  - AI helps improve vague prompts
- Prompt engineering features:
  - Style templates (photorealistic, anime, oil painting, comic book, watercolor, 3D render, sketch)
  - Mythology-specific modifiers (Greek marble statue, Norse woodcut, Egyptian hieroglyphic, etc.)
  - Geography integration (arctic = cold blue lighting, desert = golden hour, etc.)
  - Age-appropriate guardrails (no nudity, no gore, content moderation)
- Student control:
  - Simple mode ("Generate my character" one-click)
  - Advanced mode (choose style, engine, pose, background, lighting, add details)
  - Regenerate with variations
  - Edit and refine prompts
  - Prompt history & templates
- What gets images:
  - Characters (portraits, action poses, full body, multiple angles)
  - Creatures (bestiary showcase, habitat scenes, size comparison)
  - Locations (landscapes, cities, sacred sites, realms)
  - Items/artifacts (weapons, relics, magical objects)
  - Scenes (story moments, battles, ceremonies, relationships)
- Technical integration:
  - Display in: character cards, bestiary, galleries, maps, presentations, stories, relationship maps
  - Image editing (crop, filters, effects, text overlay, borders, background removal)
  - Image versioning (save multiple attempts, set primary, compare, delete)
  - Teacher controls (hide, delete, bulk actions, moderation dashboard, NO approval required)

### **Additional Features (Landing Page, Content Safety, etc.)**
- Landing page: 3-page entry sequence ("The Mythology Codex")
- Content safety: OpenAI Moderation API, zero tolerance, teacher review queue
- Infinite mythology settings (any genre, timeframe, aesthetic)
- Example mythologies (Greek & Harry Potter as templates)
- Bestiary system (creatures with alignment, abilities, danger levels)

---

## 🏗️ HOSTING RESEARCH & DECISION

### **Option 1: Netlify (Frontend + Serverless Functions)**
**Pros:**
- ✅ Free tier: 100GB bandwidth/month (sufficient for classroom)
- ✅ Auto-deploy from Git (push code → live in minutes)
- ✅ Built-in CI/CD
- ✅ Serverless functions (API routes for AI calls)
- ✅ Easy custom domains
- ✅ Form handling, A/B testing, analytics

**Cons:**
- ❌ Serverless functions have execution limits (10 seconds free, 26 seconds Pro)
- ❌ Cold starts (first request after inactivity is slow)
- ❌ Limited background job support
- ❌ No WebSocket support (need external service for real-time collaboration)

**Cost:** FREE for classroom use, ~$19/mo Pro if needed

**Best For:** Static sites, JAMstack, simple API routes

---

### **Option 2: Vercel (Frontend) + Railway (Backend)**
**Pros:**
- ✅ **Vercel Frontend:**
  - Optimized for Next.js (created by Vercel)
  - Edge functions (faster than Netlify)
  - ISR (Incremental Static Regeneration)
  - Free tier: 100GB bandwidth, unlimited sites
  - Superior performance for Next.js apps
- ✅ **Railway Backend:**
  - Full Node.js/Python server (no serverless limits)
  - WebSocket support (real-time collaboration via Yjs)
  - Background jobs (image processing, batch operations)
  - PostgreSQL hosting (alternative to Supabase, if needed)
  - Docker support
  - Environment variable management

**Cons:**
- ❌ More complex setup (two platforms)
- ❌ Railway costs ~$5-10/mo (no free tier anymore)
- ❌ Need to manage two deployments

**Cost:** Vercel FREE + Railway $5-20/mo = $5-20/mo total

**Best For:** Complex apps needing WebSockets, long-running processes, full server control

---

### **Option 3: Railway (Full-Stack Hosting)**
**Pros:**
- ✅ Single platform (frontend + backend + database)
- ✅ WebSocket support
- ✅ Background jobs
- ✅ PostgreSQL hosting
- ✅ Docker support
- ✅ Simple deployment (Nixpacks auto-detects Next.js)

**Cons:**
- ❌ No free tier (~$5-20/mo depending on usage)
- ❌ Less optimized for Next.js than Vercel
- ❌ Smaller community/ecosystem than Vercel/Netlify

**Cost:** $5-20/mo

**Best For:** All-in-one hosting, real-time apps, budget-conscious full-stack

---

### **Option 4: Vercel (Frontend) + Supabase (Backend + DB)**
**Pros:**
- ✅ **Vercel:** Best Next.js performance
- ✅ **Supabase:**
  - FREE tier: 500MB database, 1GB storage, 2GB file uploads/month
  - PostgreSQL + Auth + Storage + Real-time subscriptions
  - Row-level security (students can't edit others' work)
  - Built-in real-time (no need for Yjs? or use both)
  - REST API + GraphQL auto-generated
  - Generous free tier

**Cons:**
- ❌ Supabase free tier limits (need to monitor usage)
- ❌ Real-time via Supabase (Yjs might be better for collaborative editing?)
- ❌ Serverless function limits on Vercel (10s execution)

**Cost:** Vercel FREE + Supabase FREE = $0/mo (pilot), scale to ~$25/mo if needed

**Best For:** Budget-conscious, classroom pilot, database-heavy apps

---

### **🎯 RECOMMENDED HOSTING DECISION**

**PHASE 1 (MVP - Pilot with Your Class):**
- **Frontend:** Vercel (free, best Next.js performance)
- **Backend/Database:** Supabase (free tier, PostgreSQL + Auth + Storage + Real-time)
- **Real-time Collaboration:** Yjs (CRDT) + Supabase real-time (hybrid approach)
- **AI API Calls:** Next.js API routes on Vercel (serverless functions)
- **Image Storage:** Supabase Storage (free 1GB, then $0.021/GB)
- **File Storage:** Supabase Storage

**Cost:** $0/mo for pilot (up to ~40 students, moderate AI usage)

**PHASE 2+ (If Scaling Beyond Classroom):**
- **Frontend:** Vercel (Pro $20/mo if needed)
- **Backend:** Railway ($10-20/mo) for WebSockets, background jobs
- **Database:** Supabase (Pro $25/mo for more storage/bandwidth)
- **Image Generation:** OpenAI API (pay-per-use, ~$0.02/image) + Midjourney API

**Cost:** ~$50-70/mo for multi-classroom deployment

---

### **FINAL HOSTING STACK FOR PHASE 1:**

```
┌─────────────────────────────────────────┐
│         VERCEL (Frontend)               │
│  - Next.js 14 (React + TypeScript)      │
│  - Tailwind CSS                          │
│  - API Routes (AI calls, moderation)    │
│  - Edge Functions (fast serverless)     │
└─────────────────────────────────────────┘
            ↓ (API calls)
┌─────────────────────────────────────────┐
│       SUPABASE (Backend + DB)           │
│  - PostgreSQL (mythology data)          │
│  - Supabase Auth (teacher/student)      │
│  - Supabase Storage (images, files)     │
│  - Real-time subscriptions (Yjs sync)   │
│  - Row-level security                   │
└─────────────────────────────────────────┘
            ↓ (external APIs)
┌─────────────────────────────────────────┐
│         EXTERNAL SERVICES               │
│  - OpenAI API (GPT-4, DALL-E, Mod)      │
│  - Midjourney API (image generation)    │
│  - Avataaars API (avatar generation)    │
└─────────────────────────────────────────┘
```

---

## 🗓️ PHASED IMPLEMENTATION PLAN

### **PHASE 0: PROJECT SETUP** *(Week 1, ~10-15 hours)*

**Goal:** Get development environment ready, hosting configured, core dependencies installed.

**RESEARCH TASKS:**
1. ✅ Finalize hosting decision (Vercel + Supabase)
2. 📝 Research Yjs integration with Supabase real-time
3. 📝 Research OpenAI Moderation API best practices
4. 📝 Research Midjourney API access (requires application? pricing?)
5. 📝 Review WCAG 2.1 AA accessibility guidelines
6. 📝 Research card battle system design (MTG/Yu-Gi-Oh mechanics)

**STEP-BY-STEP:**

**Step 1: Initialize Git Repository**
- [ ] Create GitHub repository: `mythology-project`
- [ ] Clone to local machine
- [ ] Copy existing docs (PLAN.md, BRAINSTORM_DECISIONS.md, etc.) to repo
- [ ] Create `.gitignore` (already exists, verify)
- [ ] Initial commit

**Step 2: Create Vercel Account & Link Repository**
- [ ] Sign up for Vercel (free account)
- [ ] Import GitHub repository to Vercel
- [ ] Configure auto-deploy (main branch → production)
- [ ] Test: Push commit → verify auto-deploy works

**Step 3: Create Supabase Project**
- [ ] Sign up for Supabase (free account)
- [ ] Create new project: "mythology-project-prod"
- [ ] Save credentials (URL, anon key, service role key)
- [ ] Add to `.env.local` (git-ignored)

**Step 4: Initialize Next.js 14 Project**
- [ ] Run: `npx create-next-app@latest mythology-project --typescript --tailwind --app --src-dir`
- [ ] Select options:
  - ✅ TypeScript
  - ✅ ESLint
  - ✅ Tailwind CSS
  - ✅ `src/` directory
  - ✅ App Router (Next.js 14)
  - ✅ Import alias (@/*)
- [ ] Test dev server: `npm run dev` → http://localhost:3000

**Step 5: Install Core Dependencies**
```bash
# Supabase client
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# Real-time collaboration
npm install yjs y-websocket y-indexeddb

# UI Components
npm install @headlessui/react @heroicons/react
npm install react-hot-toast # Notifications
npm install clsx # Conditional classNames

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Visualization
npm install cytoscape # Relationship maps
npm install konva react-konva # Map drawing
npm install react-markdown remark-gfm # Markdown rendering

# AI SDKs
npm install openai # GPT-4 + DALL-E + Moderation
# Midjourney SDK (TBD - research needed)

# Utilities
npm install date-fns # Date formatting
npm install uuid # ID generation
```

**Step 6: Configure Environment Variables**
Create `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-...

# Midjourney (TBD)
MIDJOURNEY_API_KEY=...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Step 7: Set Up Tailwind Config**
Update `tailwind.config.ts`:
```typescript
// Add custom theme colors (12 student themes)
// Add custom fonts
// Add custom animations
// (Full config to be written during Phase 1)
```

**Step 8: Create Folder Structure**
```
src/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Protected routes (student/teacher dashboards)
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/                # Reusable UI (buttons, inputs, modals)
│   ├── dashboard/         # Dashboard-specific components
│   ├── mythology/         # Mythology creation components
│   └── shared/            # Shared components (header, footer)
├── lib/                   # Utilities
│   ├── supabase/          # Supabase client & helpers
│   ├── openai/            # OpenAI API helpers
│   ├── moderation/        # Content moderation logic
│   ├── yjs/               # Real-time collaboration setup
│   └── utils.ts           # General utilities
├── types/                 # TypeScript types
│   ├── database.types.ts  # Supabase generated types
│   └── index.ts           # Custom types
└── hooks/                 # Custom React hooks
    ├── useSupabase.ts
    ├── useUser.ts
    └── useCollaboration.ts
```

**Step 9: Deploy Initial Version**
- [ ] Push to GitHub
- [ ] Verify Vercel auto-deploys
- [ ] Visit production URL (e.g., mythology-project.vercel.app)
- [ ] Confirm: "Welcome to Next.js" page loads

**Step 10: Set Up Supabase Database**
- [ ] Go to Supabase SQL Editor
- [ ] Prepare to run schema migrations (will create tables in Phase 1)
- [ ] Enable Row Level Security (RLS) globally

**PHASE 0 DELIVERABLE:**
✅ Git repository live
✅ Vercel hosting configured (auto-deploy working)
✅ Supabase project created
✅ Next.js 14 project initialized with TypeScript + Tailwind
✅ All dependencies installed
✅ Folder structure created
✅ Environment variables configured
✅ Initial deployment live (placeholder page)

**TIME ESTIMATE:** 10-15 hours (mostly setup, configuration, reading docs)

---

### **PHASE 1: FOUNDATION (MVP CORE)** *(Weeks 2-4, ~60-80 hours)*

**Goal:** Build minimum viable product - students can create mythologies, add characters/creatures, upload images, teacher can view all work.

**FEATURES TO BUILD:**
1. Authentication (teacher/student roles)
2. Basic routing (landing, login, dashboard)
3. Database tables (users, mythologies, characters, creatures)
4. Mythology creation form
5. Character creation form
6. Creature creation form (bestiary)
7. Image upload to Supabase Storage
8. Gallery view (browse all mythologies)
9. Teacher dashboard (view all student work)
10. Content visibility controls (public/teacher-only/hidden)

**STEP-BY-STEP:**

#### **Step 1: Database Schema Migration** *(4-6 hours)*

Create SQL migration file: `supabase/migrations/001_initial_schema.sql`

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- USERS TABLE (Supabase Auth handles this, but add custom fields)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  
  -- Teacher-specific
  school_name TEXT,
  grade_level TEXT,
  
  -- Student-specific
  classroom_id UUID,
  
  -- Gamification
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  
  -- Settings
  preferred_theme TEXT DEFAULT 'cyberpunk_neon',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CLASSROOMS TABLE
CREATE TABLE IF NOT EXISTS public.classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  invite_code TEXT UNIQUE NOT NULL,
  school_year TEXT,
  
  -- Settings
  ai_generation_daily_limit INTEGER DEFAULT 10,
  allow_crossover_collaborations BOOLEAN DEFAULT TRUE,
  allow_ai_battles BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- MYTHOLOGIES TABLE
CREATE TABLE IF NOT EXISTS public.mythologies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  
  -- Setting
  timeframe TEXT, -- 'ancient', 'medieval', 'modern', 'future', 'post_apocalyptic', etc.
  genre TEXT, -- 'fantasy', 'scifi', 'cyberpunk', etc.
  geography_type TEXT, -- 'arctic', 'desert', 'ocean', 'urban', etc.
  setting_description TEXT,
  cultural_inspiration TEXT,
  
  -- Ownership
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  is_group_project BOOLEAN DEFAULT FALSE,
  group_members UUID[], -- Array of profile IDs
  
  -- Visibility
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'teacher_only', 'hidden')),
  locked_by_teacher BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CHARACTERS TABLE
CREATE TABLE IF NOT EXISTS public.characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  character_type TEXT NOT NULL CHECK (character_type IN ('god', 'demigod', 'hero', 'mortal', 'legendary_figure', 'founder', 'spirit', 'other')),
  archetype TEXT, -- 'warrior', 'trickster', 'wise_elder', 'nature_spirit', etc.
  domain TEXT, -- "Ice, Winter, Endurance"
  
  -- Lore
  description TEXT,
  origin_story TEXT,
  personality TEXT,
  geography_connection TEXT,
  powers_abilities TEXT,
  weaknesses TEXT,
  
  -- Visuals
  primary_image_id UUID, -- References generated_images table
  appearance_description TEXT,
  
  -- Visibility
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'teacher_only', 'hidden')),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CREATURES TABLE (Bestiary)
CREATE TABLE IF NOT EXISTS public.creatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  creature_type TEXT CHECK (creature_type IN ('beast', 'monster', 'magical_being', 'spirit', 'undead', 'construct', 'hybrid', 'elemental', 'dragon', 'other')),
  
  -- Classification
  alignment TEXT CHECK (alignment IN ('good', 'neutral', 'evil', 'ambiguous', 'lawful', 'chaotic')),
  intelligence_level TEXT CHECK (intelligence_level IN ('non_sentient', 'animal_intelligence', 'sentient', 'highly_intelligent')),
  size_category TEXT CHECK (size_category IN ('tiny', 'small', 'medium', 'large', 'huge', 'gargantuan')),
  danger_level TEXT CHECK (danger_level IN ('harmless', 'minor_threat', 'dangerous', 'deadly', 'catastrophic')),
  
  -- Lore
  description TEXT,
  habitat TEXT,
  abilities TEXT,
  cultural_significance TEXT,
  origin_story TEXT,
  weaknesses TEXT,
  
  -- Relationships
  related_characters UUID[], -- Array of character IDs
  is_unique BOOLEAN DEFAULT FALSE, -- Unique entity vs species
  
  -- Visuals
  primary_image_id UUID,
  
  -- Visibility
  visibility TEXT DEFAULT 'public',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ... (More tables to be added in subsequent migrations)
-- relationships, stories, locations, generated_images, etc.

-- ROW LEVEL SECURITY POLICIES

-- Profiles: Users can read all, update own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Mythologies: Students can create, read based on visibility, update own
ALTER TABLE public.mythologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mythologies are visible based on visibility setting"
  ON public.mythologies FOR SELECT
  USING (
    visibility = 'public' 
    OR (visibility = 'teacher_only' AND (
      SELECT role FROM public.profiles WHERE id = auth.uid()
    ) = 'teacher')
    OR created_by = auth.uid()
    OR auth.uid() = ANY(group_members)
  );

CREATE POLICY "Students can create mythologies"
  ON public.mythologies FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Students can update own mythologies"
  ON public.mythologies FOR UPDATE
  USING (
    created_by = auth.uid() 
    OR auth.uid() = ANY(group_members)
  );

-- Characters: Similar RLS policies
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- (RLS policies for characters, creatures, etc.)

-- ... (Full RLS policies to be defined)
```

**Actions:**
- [ ] Run migration in Supabase SQL Editor
- [ ] Verify tables created successfully
- [ ] Generate TypeScript types: `npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts`

---

#### **Step 2: Supabase Client Setup** *(2-3 hours)*

Create `src/lib/supabase/client.ts`:
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

export const supabase = createClientComponentClient<Database>();
```

Create `src/lib/supabase/server.ts`:
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({ cookies });
};
```

Create custom hooks:
- `src/hooks/useSupabase.ts` (client-side Supabase access)
- `src/hooks/useUser.ts` (current user data)
- `src/hooks/useMythology.ts` (mythology CRUD operations)

---

#### **Step 3: Authentication System** *(8-10 hours)*

**Components to Build:**
- [ ] `/app/(auth)/login/page.tsx` - Login page
- [ ] `/app/(auth)/signup/page.tsx` - Signup page (teacher vs student)
- [ ] `src/components/auth/LoginForm.tsx`
- [ ] `src/components/auth/SignupForm.tsx`
- [ ] `src/components/auth/RoleSelect.tsx` (teacher/student)

**Features:**
- [ ] Email/password authentication
- [ ] Role selection during signup (teacher/student)
- [ ] Teacher creates classroom → generates invite code
- [ ] Student joins with invite code
- [ ] Redirect after login (teacher → admin dashboard, student → student dashboard)
- [ ] Protected routes (middleware to check auth)

**Middleware:**
Create `src/middleware.ts`:
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}
```

---

#### **Step 4: Landing Page** *(4-6 hours)*

Build 3-page entry sequence from BRAINSTORM_DECISIONS.md:

**Page 1: Title Card**
- [ ] `/app/page.tsx` - Landing page
- [ ] Hero section: "The Mythology Codex"
- [ ] Tagline: "Create Your Own Mythology"
- [ ] CTA: [Enter the Codex →]

**Page 2: Choose Your Path**
- [ ] `/app/choose-path/page.tsx`
- [ ] Two options: Teacher | Student
- [ ] Visual cards with descriptions

**Page 3: Gateway (Login/Signup)**
- [ ] Redirects to `/login` or `/signup` based on role

---

#### **Step 5: Student Dashboard** *(6-8 hours)*

**Pages:**
- [ ] `/app/(dashboard)/student/page.tsx` - Student dashboard home
- [ ] `/app/(dashboard)/student/my-mythologies/page.tsx` - List of student's mythologies

**Components:**
- [ ] `src/components/dashboard/StudentHeader.tsx` (nav, profile menu)
- [ ] `src/components/dashboard/MythologyCard.tsx` (display mythology in grid/list)
- [ ] `src/components/dashboard/QuickStats.tsx` (points, badges, level)

**Features:**
- [ ] Display student's mythologies
- [ ] "Create New Mythology" button
- [ ] Recent activity feed
- [ ] Gamification stats (points, level, badges)
- [ ] Quick links (gallery, research library)

---

#### **Step 6: Mythology Creation Form** *(8-10 hours)*

**Page:**
- [ ] `/app/(dashboard)/mythology/create/page.tsx`

**Form Fields:**
- [ ] Name (text input)
- [ ] Description (textarea)
- [ ] Timeframe (select: ancient, medieval, modern, future, etc.)
- [ ] Genre (select: fantasy, scifi, cyberpunk, etc.)
- [ ] Geography type (select: arctic, desert, ocean, urban, etc.)
- [ ] Setting description (textarea)
- [ ] Cultural inspiration (optional, textarea)
- [ ] Is group project? (checkbox)
  - [ ] If yes: Select group members (multi-select)
- [ ] Visibility (radio: public, teacher-only, hidden)

**AI Assistance:**
- [ ] "Generate Setting Primer" button
  - Calls OpenAI API with timeframe + genre + geography
  - Returns custom worldbuilding prompts
  - Display in modal or side panel

**Validation:**
- [ ] Use `react-hook-form` + `zod` for validation
- [ ] Check: name required, min length, etc.
- [ ] Check: student in classroom
- [ ] Check: moderation API for description text

**Actions:**
- [ ] [Cancel] (go back)
- [ ] [Save Draft] (visibility = hidden)
- [ ] [Create Mythology] (save to database)

**Post-Creation:**
- [ ] Award points (+50 for first mythology)
- [ ] Check for badges ("First Creation" badge)
- [ ] Redirect to mythology detail page

---

#### **Step 7: Character Creation Form** *(8-10 hours)*

**Page:**
- [ ] `/app/(dashboard)/mythology/[id]/character/create/page.tsx`

**Form Fields:**
- [ ] Name (text input)
- [ ] Character type (select: god, demigod, hero, mortal, etc.)
- [ ] Archetype (select: warrior, trickster, wise elder, etc.)
- [ ] Domain (text input, e.g., "Ice, Winter, Endurance")
- [ ] Description (rich text editor or textarea)
- [ ] Origin story (textarea)
- [ ] Personality (textarea)
- [ ] Geography connection (textarea)
- [ ] Powers/abilities (textarea)
- [ ] Weaknesses (textarea)
- [ ] Appearance description (textarea)
- [ ] Upload image (file input → Supabase Storage)
- [ ] Visibility (radio: public, teacher-only, hidden)

**AI Assistance:**
- [ ] "Expand with AI" buttons next to each textarea
  - Calls GPT-4 to expand brief input
  - Example: "ice god" → "Ancient deity of winter, commands blizzards..."
- [ ] "Check Consistency" button
  - Analyzes character vs mythology setting
  - Flags anachronisms or contradictions

**Validation:**
- [ ] Name required
- [ ] Character type required
- [ ] Description min length (50 words?)
- [ ] Moderation API check on all text fields

**Image Upload:**
- [ ] Upload to Supabase Storage bucket: `character-images`
- [ ] File size limit (5MB)
- [ ] Allowed types: PNG, JPG, WEBP
- [ ] Generate thumbnail (use `sharp` library? or Supabase image transformation)

**Actions:**
- [ ] [Cancel]
- [ ] [Save Draft]
- [ ] [Create Character]

**Post-Creation:**
- [ ] Award points (+50 for character creation)
- [ ] Redirect to character detail page

---

#### **Step 8: Creature Creation Form (Bestiary)** *(6-8 hours)*

**Page:**
- [ ] `/app/(dashboard)/mythology/[id]/creature/create/page.tsx`

**Form Fields:**
- [ ] Name
- [ ] Creature type (select: beast, monster, magical being, etc.)
- [ ] Alignment (select: good, neutral, evil, etc.)
- [ ] Intelligence level (select: non-sentient, animal, sentient, etc.)
- [ ] Size category (select: tiny, small, medium, large, etc.)
- [ ] Danger level (select: harmless, minor threat, dangerous, etc.)
- [ ] Description (textarea)
- [ ] Habitat (text input)
- [ ] Abilities (textarea)
- [ ] Cultural significance (textarea)
- [ ] Origin story (textarea)
- [ ] Weaknesses (textarea)
- [ ] Related characters (multi-select: link to characters)
- [ ] Is unique? (checkbox: unique entity vs species)
- [ ] Upload image
- [ ] Visibility

**AI Assistance:**
- [ ] Similar to character creation
- [ ] "Generate Creature" (AI creates full creature from prompt)

**Validation & Actions:**
- [ ] Similar to character creation
- [ ] Award points (+50)

---

#### **Step 9: Image Upload System** *(4-6 hours)*

**Supabase Storage Setup:**
- [ ] Create bucket: `character-images`
- [ ] Create bucket: `creature-images`
- [ ] Create bucket: `location-images`
- [ ] Set policies (authenticated users can upload, public can read)

**Component:**
- [ ] `src/components/shared/ImageUpload.tsx`
  - Drag-and-drop zone
  - File picker
  - Preview before upload
  - Progress indicator
  - Image compression (use `browser-image-compression` library)

**Workflow:**
1. User selects file
2. Client-side compression (reduce size if > 2MB)
3. Upload to Supabase Storage
4. Get public URL
5. Save URL to database (character.primary_image_url or creature.primary_image_url)

---

#### **Step 10: Gallery View** *(6-8 hours)*

**Page:**
- [ ] `/app/(dashboard)/gallery/page.tsx`

**Features:**
- [ ] Display all public mythologies (grid or list view)
- [ ] Filter by:
  - Timeframe (ancient, modern, future, etc.)
  - Genre (fantasy, scifi, etc.)
  - Geography (desert, ocean, arctic, etc.)
  - Student (if teacher)
- [ ] Sort by:
  - Most recent
  - Most popular (view count)
  - Alphabetical
- [ ] Search (by name or description)
- [ ] Pagination (20 per page)

**Components:**
- [ ] `src/components/gallery/MythologyCard.tsx`
  - Thumbnail (primary character image or placeholder)
  - Name
  - Creator (student name)
  - Setting (timeframe, genre, geography)
  - View count
  - [View Details →] button

**View Details:**
- [ ] Click card → `/app/(dashboard)/mythology/[id]/page.tsx`
- [ ] Display:
  - Mythology name, description, setting
  - List of characters (cards with portraits)
  - List of creatures
  - Map (if created)
  - Stories (if created)
  - Relationship map (if relationships exist)

---

#### **Step 11: Teacher Dashboard** *(8-10 hours)*

**Page:**
- [ ] `/app/(dashboard)/teacher/page.tsx`

**Features:**
- [ ] Class overview:
  - Total students
  - Total mythologies
  - Total characters/creatures
  - Submissions pending review
  - Flagged content count
- [ ] Activity feed (recent student actions)
- [ ] Quick actions:
  - [Review Submissions]
  - [Check Flagged Content]
  - [Manage Students]
  - [View Analytics]

**Student Management:**
- [ ] `/app/(dashboard)/teacher/students/page.tsx`
- [ ] List all students
- [ ] Filter by status (active, inactive, pending review)
- [ ] Sort by name, last activity, grade
- [ ] Search students
- [ ] Bulk actions (hide all, approve all, message all)
- [ ] Click student → individual student profile
  - View all student's work
  - Impersonate student ("View as Student" button)
  - Send message
  - Adjust AI limits
  - Lock/unlock account

**Impersonation Mode:**
- [ ] "View as [Student Name]" button
- [ ] Loads student's dashboard view (read-only or editable?)
- [ ] Banner at top: "You are viewing as [Student]. [Exit] button"
- [ ] Teacher sees exactly what student sees

---

#### **Step 12: Content Visibility Controls** *(4-6 hours)*

**Student UI:**
- [ ] On mythology/character/creature cards:
  - Toggle: 👁️ Public | 🔒 Teacher Only | ✏️ Hidden
  - Confirmation modal: "Are you sure you want to make this public?"

**Teacher Override:**
- [ ] Teacher can force-hide any content
- [ ] Teacher can lock visibility (student can't change)
- [ ] Teacher dashboard shows hidden content with indicator

**Database:**
- [ ] `visibility` column on mythologies, characters, creatures
- [ ] `locked_by_teacher` column

---

#### **Step 13: OpenAI Moderation Integration** *(6-8 hours)*

**API Route:**
- [ ] `/app/api/moderation/check/route.ts`
- [ ] Accepts: `{ text: string }`
- [ ] Calls OpenAI Moderation API
- [ ] Returns: `{ safe: boolean, categories: {...}, flagged: boolean }`

**Client-Side Check:**
- [ ] Before saving mythology/character/creature description:
  - Call moderation API
  - If flagged: Show error message, don't save
  - If borderline: Flag for teacher review

**Moderation Logic:**
```typescript
// src/lib/moderation/checkContent.ts
import { Configuration, OpenAIApi } from 'openai';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function checkContent(text: string) {
  const response = await openai.createModeration({ input: text });
  const result = response.data.results[0];
  
  if (result.flagged) {
    return {
      safe: false,
      flagged: true,
      categories: result.categories,
      scores: result.category_scores,
    };
  }
  
  return { safe: true, flagged: false };
}
```

**Teacher Review Queue:**
- [ ] Flagged content goes to `/app/(dashboard)/teacher/moderation/page.tsx`
- [ ] Teacher can approve, reject, or request edit

---

#### **Step 14: Testing & Bug Fixes** *(8-10 hours)*

**Manual Testing:**
- [ ] Test authentication flow (signup, login, logout)
- [ ] Test role-based access (student can't access teacher dashboard)
- [ ] Test mythology creation (all fields, validation, AI assistance)
- [ ] Test character creation
- [ ] Test creature creation
- [ ] Test image upload (file size, types, compression)
- [ ] Test gallery (filtering, sorting, search)
- [ ] Test teacher dashboard (impersonation, bulk actions)
- [ ] Test visibility controls (public/teacher-only/hidden)
- [ ] Test moderation (flagged content, teacher review)

**Bug Fixes:**
- [ ] Fix any crashes or errors
- [ ] Improve UX (loading states, error messages, success toasts)
- [ ] Optimize performance (lazy loading, caching)

---

#### **Step 15: Deploy Phase 1 MVP** *(2-3 hours)*

**Pre-Deployment Checklist:**
- [ ] All environment variables set in Vercel
- [ ] Supabase database migrated (production environment)
- [ ] Test production build locally: `npm run build && npm run start`
- [ ] Run ESLint: `npm run lint` (fix any errors)
- [ ] Update README.md with setup instructions

**Deployment:**
- [ ] Push to GitHub main branch
- [ ] Vercel auto-deploys
- [ ] Visit production URL
- [ ] Test critical flows:
  - [ ] Signup as teacher
  - [ ] Create classroom
  - [ ] Signup as student (use invite code)
  - [ ] Create mythology
  - [ ] Create character
  - [ ] Upload image
  - [ ] View gallery
  - [ ] Teacher: view all student work

**PHASE 1 DELIVERABLE:**
✅ Authentication working (teacher/student roles)
✅ Students can create mythologies, characters, creatures
✅ Students can upload images
✅ Gallery view (browse all mythologies)
✅ Teacher dashboard (view all work, impersonate students)
✅ Content visibility controls (public/teacher-only/hidden)
✅ OpenAI moderation active (flagged content reviewed by teacher)
✅ Live on Vercel + Supabase

**TIME ESTIMATE:** 60-80 hours (3-4 weeks part-time, or 2 weeks full-time)

---

---

---

# 🚀 PHASE 2: ADVANCED CONTENT CREATION

## Duration: Weeks 5-7 (~60-80 hours)

---

## 🎯 PHASE 2 GOAL

**Build advanced content creation tools:** Stories, world maps, relationship mapping, cross-mythology interactions, research library.

**Features to Build:**
1. Story & narrative system (Question 9)
2. World maps & geography visualization (Question 10)
3. Relationship mapping (Question 3)
4. Cross-mythology interactions (Question 11)
5. Research & inspiration library (Question 13)

---

## 📋 PHASE 2 PREREQUISITES

**Must be completed from Phase 1:**
- ✅ Database schema for characters, creatures, mythologies
- ✅ Authentication & user roles
- ✅ Character/creature creation forms working
- ✅ Image upload system functional
- ✅ Gallery view operational

**New Database Tables Needed:**
- `stories` (narrative content)
- `locations` (world map places)
- `maps` (custom coordinate systems)
- `relationships` (character connections)
- `crossover_collaborations` (inter-mythology projects)
- `battle_simulations` (AI-generated battle outcomes)
- `research_resources` (curated library content)

---

## 🗄️ STEP 1: Database Schema Extension *(4-6 hours)*

Create migration: `supabase/migrations/002_advanced_content.sql`

```sql
-- STORIES TABLE
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Story Info
  title TEXT NOT NULL,
  story_type TEXT CHECK (story_type IN ('origin', 'conflict', 'quest', 'daily_life', 'prophecy', 'crossover', 'custom')),
  content TEXT NOT NULL, -- Rich text/markdown
  word_count INTEGER DEFAULT 0,
  
  -- Relationships
  featured_characters UUID[], -- Array of character IDs
  featured_creatures UUID[], -- Array of creature IDs
  related_locations UUID[], -- Array of location IDs
  
  -- Timeline
  timeline_date TEXT, -- "Year 1, Spring" or "1939-09-01" for historical settings
  timeline_order INTEGER, -- For sorting chronologically
  
  -- Metadata
  is_complete BOOLEAN DEFAULT FALSE,
  draft_version INTEGER DEFAULT 1,
  
  -- Visibility
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'teacher_only', 'hidden')),
  
  -- Collaboration
  is_crossover BOOLEAN DEFAULT FALSE,
  collaborating_mythologies UUID[], -- If crossover story
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- LOCATIONS TABLE
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Location Info
  name TEXT NOT NULL,
  location_type TEXT CHECK (location_type IN ('city', 'village', 'temple', 'mountain', 'forest', 'ocean', 'underworld', 'sacred_site', 'realm', 'landmark', 'battlefield', 'other')),
  description TEXT,
  
  -- Coordinates (custom system per mythology)
  coordinate_x FLOAT, -- Can be lat, grid x, or custom
  coordinate_y FLOAT, -- Can be long, grid y, or custom
  coordinate_label TEXT, -- Display format (e.g., "52°N, 13°E" or "Grid A5")
  
  -- Geography
  terrain TEXT, -- mountain, desert, forest, urban, etc.
  climate TEXT,
  cultural_significance TEXT,
  
  -- Relationships
  associated_characters UUID[], -- Characters who live/originate here
  associated_creatures UUID[], -- Creatures found here
  related_stories UUID[], -- Stories set here
  
  -- Visuals
  primary_image_id UUID,
  map_icon TEXT, -- Icon type for map display
  
  -- Visibility
  visibility TEXT DEFAULT 'public',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- MAPS TABLE (Custom coordinate systems)
CREATE TABLE IF NOT EXISTS public.maps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Map Info
  name TEXT NOT NULL,
  description TEXT,
  map_type TEXT CHECK (map_type IN ('world', 'regional', 'city', 'realm', 'custom')),
  
  -- Coordinate System
  coordinate_system TEXT CHECK (coordinate_system IN ('latlong', 'grid', 'custom')),
  coordinate_system_config JSONB, -- Store custom grid definitions, ranges, labels
  
  -- Visual Data
  background_image_url TEXT, -- Optional background image
  canvas_data JSONB, -- Konva/Fabric canvas state (drawings, shapes, etc.)
  
  -- Metadata
  zoom_level FLOAT DEFAULT 1.0,
  center_x FLOAT DEFAULT 0,
  center_y FLOAT DEFAULT 0,
  
  -- Visibility
  visibility TEXT DEFAULT 'public',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RELATIONSHIPS TABLE
CREATE TABLE IF NOT EXISTS public.relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  
  -- Connected Entities
  character_1_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
  character_2_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
  
  -- Relationship Info
  relationship_type TEXT CHECK (relationship_type IN ('parent', 'child', 'sibling', 'spouse', 'ally', 'enemy', 'rival', 'mentor', 'student', 'friend', 'servant', 'master', 'creator', 'creation', 'custom')),
  custom_type_label TEXT, -- If relationship_type = 'custom'
  description TEXT,
  
  -- Strength/Intensity
  relationship_strength INTEGER DEFAULT 5 CHECK (relationship_strength BETWEEN 1 AND 10), -- 1=weak, 10=strong
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE, -- For dynamic relationships that change over time
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Ensure no duplicate relationships (A→B same as B→A)
  CONSTRAINT unique_relationship UNIQUE(character_1_id, character_2_id)
);

-- CROSSOVER COLLABORATIONS TABLE
CREATE TABLE IF NOT EXISTS public.crossover_collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Collaborating Mythologies
  mythology_1_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  mythology_2_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  
  -- Collaboration Info
  title TEXT NOT NULL,
  description TEXT,
  collaboration_type TEXT CHECK (collaboration_type IN ('alliance', 'conflict', 'trade', 'cultural_exchange', 'crossover_story', 'battle', 'custom')),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'active', 'completed', 'rejected')),
  
  -- Permissions
  initiated_by UUID REFERENCES public.profiles(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_collaboration UNIQUE(mythology_1_id, mythology_2_id)
);

-- BATTLE SIMULATIONS TABLE (AI-generated)
CREATE TABLE IF NOT EXISTS public.battle_simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Battle Participants
  mythology_1_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  mythology_2_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  
  -- Battle Setup
  battle_type TEXT CHECK (battle_type IN ('god_vs_god', 'army_vs_army', 'creature_vs_creature', 'full_pantheon', 'custom')),
  participant_1_ids UUID[], -- Characters/creatures from mythology 1
  participant_2_ids UUID[], -- Characters/creatures from mythology 2
  
  -- AI-Generated Results
  battle_narrative TEXT, -- GPT-4 generated story
  victor_mythology_id UUID REFERENCES public.mythologies(id),
  outcome_type TEXT CHECK (outcome_type IN ('decisive_victory', 'narrow_victory', 'stalemate', 'mutual_destruction', 'unexpected_outcome')),
  
  -- Stats
  casualties_mythology_1 INTEGER DEFAULT 0,
  casualties_mythology_2 INTEGER DEFAULT 0,
  battle_duration TEXT, -- "3 days", "instant", etc.
  
  -- Metadata
  generated_by TEXT DEFAULT 'gpt-4',
  generation_prompt TEXT, -- Save prompt for reference
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- RESEARCH RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.research_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Resource Info
  title TEXT NOT NULL,
  resource_type TEXT CHECK (resource_type IN ('article', 'book', 'video', 'image', 'website', 'pdf', 'other')),
  url TEXT,
  description TEXT,
  
  -- Categorization
  mythology_culture TEXT, -- 'greek', 'norse', 'egyptian', 'aztec', etc.
  topic_tags TEXT[], -- ['war_gods', 'creation_myths', 'underworld', etc.]
  
  -- Curation
  added_by UUID REFERENCES public.profiles(id), -- Teacher who added it
  is_teacher_approved BOOLEAN DEFAULT TRUE,
  
  -- Metadata
  thumbnail_url TEXT,
  reading_level TEXT CHECK (reading_level IN ('elementary', 'middle_school', 'high_school', 'college', 'all_ages')),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- DEITY COMPARISONS TABLE (Pre-populated by teacher/system)
CREATE TABLE IF NOT EXISTS public.deity_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Deity Info
  deity_name TEXT NOT NULL,
  mythology_culture TEXT NOT NULL, -- 'greek', 'norse', 'egyptian', etc.
  domain TEXT NOT NULL, -- 'war', 'death', 'trickster', 'creation', 'sea', etc.
  
  -- Details
  description TEXT,
  symbols TEXT[], -- ['spear', 'helmet', 'raven', etc.]
  key_myths TEXT, -- Brief overview of major stories
  cultural_context TEXT,
  
  -- Cross-Cultural Links
  equivalent_deities JSONB, -- [{culture: 'roman', name: 'Mars'}, ...]
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ROW LEVEL SECURITY

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crossover_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deity_comparisons ENABLE ROW LEVEL SECURITY;

-- (RLS policies similar to Phase 1 - visibility-based access)
-- Students can read public content, create own content, update own content
-- Teachers can read all, update any

-- EXAMPLE RLS POLICY for stories:
CREATE POLICY "Stories visible based on visibility setting"
  ON public.stories FOR SELECT
  USING (
    visibility = 'public' 
    OR (visibility = 'teacher_only' AND (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'teacher')
    OR created_by = auth.uid()
  );

CREATE POLICY "Students can create stories"
  ON public.stories FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Students can update own stories"
  ON public.stories FOR UPDATE
  USING (created_by = auth.uid());

-- (Repeat similar policies for other tables)
```

**Actions:**
- [ ] Run migration in Supabase
- [ ] Verify tables created
- [ ] Regenerate TypeScript types: `npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts`
- [ ] Update types in project

---

## 📖 STEP 2: Story Creation System *(12-15 hours)*

### **A) Story Editor Page** *(6-8 hours)*

**Page:**
- [ ] `/app/(dashboard)/mythology/[id]/story/create/page.tsx`

**Form Fields:**
- [ ] Title (text input)
- [ ] Story type (select: origin, conflict, quest, daily life, prophecy, crossover, custom)
- [ ] Content (rich text editor - use **TipTap** or **Lexical**)
  - Rich text toolbar: bold, italic, headings, lists, quotes
  - Markdown support (optional)
  - Word count display (updates live)
- [ ] Timeline date (text input, e.g., "Year 1, Spring" or "1939-09-01")
- [ ] Timeline order (number input, for chronological sorting)
- [ ] Featured characters (multi-select dropdown from mythology's characters)
- [ ] Featured creatures (multi-select dropdown)
- [ ] Related locations (multi-select dropdown)
- [ ] Is complete? (checkbox - draft vs finished)
- [ ] Visibility (radio: public, teacher-only, hidden)

**AI Assistance Features:**
- [ ] **"AI Story Starter"** button
  - Modal: "What kind of story? (origin, conflict, quest)"
  - AI generates 3-5 sentence opening based on mythology setting + selected characters
  - Student can accept, regenerate, or ignore
- [ ] **"Continue Writing"** button
  - Takes last paragraph, sends to GPT-4 with prompt: "Continue this story in the same style"
  - Returns next 2-3 sentences
  - Student can accept, edit, or regenerate
- [ ] **"Conflict Generator"**
  - AI suggests conflicts based on characters/creatures in story
  - Example: "Volgar faces his rival, the Fire God, in a battle for control of the mountain pass"
- [ ] **"Feedback Assistant"**
  - After student writes, AI provides constructive feedback:
    - "Great character development! Consider adding more sensory details."
    - "This section moves quickly. Maybe slow down and describe the setting?"

**Rich Text Editor Setup (TipTap):**
```typescript
// src/components/story/StoryEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';

export function StoryEditor({ initialContent, onChange }: { 
  initialContent?: string, 
  onChange: (content: string) => void 
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Begin your mythology story...',
      }),
      CharacterCount,
    ],
    content: initialContent || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const wordCount = editor?.storage.characterCount.words() || 0;

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex gap-2">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive('bold') ? 'font-bold' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'italic' : ''}
        >
          Italic
        </button>
        {/* More toolbar buttons... */}
      </div>
      
      {/* Editor */}
      <EditorContent editor={editor} className="p-4 min-h-[400px]" />
      
      {/* Word Count */}
      <div className="border-t p-2 text-sm text-gray-500">
        {wordCount} words
      </div>
    </div>
  );
}
```

**Validation:**
- [ ] Title required (min 3 chars)
- [ ] Content required (min 100 words)
- [ ] Moderation check on content (OpenAI Moderation API)
- [ ] Check selected characters exist in mythology

**Actions:**
- [ ] [Cancel]
- [ ] [Save Draft] (is_complete = false, visibility = hidden)
- [ ] [Publish Story] (is_complete = true, save with chosen visibility)

**Post-Creation:**
- [ ] Award points (+100 for story creation, +50 bonus if >500 words)
- [ ] Check badges ("First Story", "Epic Storyteller" if 5+ stories)
- [ ] Redirect to story detail page

---

### **B) Story Detail Page** *(3-4 hours)*

**Page:**
- [ ] `/app/(dashboard)/story/[id]/page.tsx`

**Display:**
- [ ] Story title
- [ ] Author (student name + avatar)
- [ ] Mythology name (linked)
- [ ] Story type badge
- [ ] Timeline date (if set)
- [ ] Word count
- [ ] Created/updated dates
- [ ] Visibility status indicator

**Content:**
- [ ] Render rich text content
- [ ] Syntax highlighting if code blocks (unlikely, but good to have)
- [ ] Responsive text sizing

**Metadata Section:**
- [ ] **Featured Characters** (cards with portraits, clickable to character page)
- [ ] **Featured Creatures** (cards with images)
- [ ] **Related Locations** (list with links)

**Actions:**
- [ ] [Edit Story] (if owner or group member)
- [ ] [Delete Story] (if owner)
- [ ] [Report Story] (if inappropriate, flags for teacher)
- [ ] [Share] (copy link to clipboard)

**Comments Section (Phase 4):**
- [ ] Placeholder for future peer comments

---

### **C) Story List View** *(2-3 hours)*

**Page:**
- [ ] `/app/(dashboard)/mythology/[id]/stories/page.tsx`

**Features:**
- [ ] List all stories in mythology
- [ ] Filter by:
  - Story type (origin, conflict, etc.)
  - Completion status (draft, finished)
  - Timeline order
- [ ] Sort by:
  - Timeline order (chronological in-world)
  - Created date
  - Word count
  - Alphabetical
- [ ] Search stories by title/content

**Display:**
- [ ] Story cards:
  - Title
  - Story type icon
  - Excerpt (first 100 words)
  - Word count
  - Timeline date
  - Featured characters (avatars)
  - [Read More →] button

---

## 🗺️ STEP 3: World Maps & Geography Visualization *(16-20 hours)*

### **A) Map Creation System** *(10-12 hours)*

**Page:**
- [ ] `/app/(dashboard)/mythology/[id]/map/create/page.tsx`

**Coordinate System Setup:**
- [ ] Modal: "Choose Coordinate System"
  - Option 1: **Latitude/Longitude** (standard Earth-like)
  - Option 2: **Grid System** (A1, B2, etc. - like chess)
  - Option 3: **Custom** (define your own axes, labels, ranges)

**Custom Coordinate System Config:**
If student chooses "Custom":
```typescript
// Example config
{
  type: 'custom',
  x_axis: {
    label: 'Network Sector',
    range: [0, 100],
    unit: 'sector'
  },
  y_axis: {
    label: 'Data Layer',
    range: [0, 50],
    unit: 'layer'
  },
  display_format: 'Sector {x}, Layer {y}'
}

// Example for WW2 mythology:
{
  type: 'grid',
  x_axis: {
    label: 'Grid X',
    range: ['A', 'Z'],
    unit: ''
  },
  y_axis: {
    label: 'Grid Y',
    range: [1, 99],
    unit: ''
  },
  display_format: '{x}{y}' // e.g., "A5", "M23"
}
```

**Map Canvas (Konva.js):**
- [ ] Install: `npm install konva react-konva`
- [ ] Create: `src/components/map/MapCanvas.tsx`

**Drawing Tools:**
- [ ] **Select/Move Tool** (default cursor, drag elements)
- [ ] **Region Tool** (draw polygons for countries/territories)
- [ ] **Mountain Tool** (place mountain icon)
- [ ] **River Tool** (draw curved lines)
- [ ] **City Tool** (place city marker)
- [ ] **Label Tool** (add text labels)
- [ ] **Icon Library** (forest, desert, ocean, volcano, temple, etc.)

**Canvas Features:**
- [ ] Zoom in/out (mouse wheel or +/- buttons)
- [ ] Pan (click-drag empty space)
- [ ] Layers (background, terrain, markers, labels)
- [ ] Undo/Redo (track canvas state history)
- [ ] Export as PNG/SVG

**Location Markers:**
- [ ] Place marker on map → opens "Create Location" modal
- [ ] Form fields:
  - Name
  - Location type (city, temple, mountain, etc.)
  - Description
  - Coordinates (auto-filled from click position)
  - Associated characters/creatures
  - Upload location image (optional)
- [ ] Marker displays on map with custom icon
- [ ] Click marker → show location details tooltip
- [ ] Click marker → option to edit or view full location page

**Example Konva Canvas Component:**
```typescript
// src/components/map/MapCanvas.tsx
'use client';

import { Stage, Layer, Rect, Circle, Line, Text, Image } from 'react-konva';
import { useState, useRef } from 'react';

export function MapCanvas({ width, height, locations, onAddLocation }: {
  width: number,
  height: number,
  locations: any[],
  onAddLocation: (x: number, y: number) => void
}) {
  const [tool, setTool] = useState<'select' | 'marker' | 'region'>('select');
  const [zoom, setZoom] = useState(1);
  
  const handleStageClick = (e: any) => {
    if (tool === 'marker') {
      const pos = e.target.getStage().getPointerPosition();
      onAddLocation(pos.x / zoom, pos.y / zoom);
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => setTool('select')}>Select</button>
        <button onClick={() => setTool('marker')}>Add Location</button>
        <button onClick={() => setTool('region')}>Draw Region</button>
        <button onClick={() => setZoom(zoom * 1.2)}>Zoom In</button>
        <button onClick={() => setZoom(zoom / 1.2)}>Zoom Out</button>
      </div>
      
      {/* Canvas */}
      <Stage
        width={width}
        height={height}
        scaleX={zoom}
        scaleY={zoom}
        onClick={handleStageClick}
        className="border"
      >
        <Layer>
          {/* Background */}
          <Rect width={width} height={height} fill="#f0f0f0" />
          
          {/* Location Markers */}
          {locations.map(loc => (
            <Circle
              key={loc.id}
              x={loc.coordinate_x}
              y={loc.coordinate_y}
              radius={10}
              fill="red"
              onClick={() => console.log('Clicked location:', loc.name)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}
```

**Save Map:**
- [ ] Save canvas state as JSON (`maps.canvas_data`)
- [ ] Save coordinate system config
- [ ] Save all location markers
- [ ] Generate thumbnail (export canvas as base64 image, save to Supabase Storage)

**Actions:**
- [ ] [Cancel]
- [ ] [Save Draft]
- [ ] [Publish Map]

---

### **B) Location Management** *(4-6 hours)*

**Location Creation (from map or standalone):**
- [ ] `/app/(dashboard)/mythology/[id]/location/create/page.tsx`
- [ ] Form fields (as defined in database schema)
- [ ] If created from map: coordinates pre-filled
- [ ] If standalone: manual coordinate entry or leave blank

**Location Detail Page:**
- [ ] `/app/(dashboard)/location/[id]/page.tsx`
- [ ] Display location info
- [ ] Show on map (if coordinates exist)
- [ ] List associated characters/creatures
- [ ] List related stories (stories set here)
- [ ] Image gallery

**Location List View:**
- [ ] `/app/(dashboard)/mythology/[id]/locations/page.tsx`
- [ ] Grid/list of all locations
- [ ] Filter by type, terrain
- [ ] Sort alphabetically, by creation date

---

### **C) Map Viewing & Interaction** *(2-3 hours)*

**Map Display Page:**
- [ ] `/app/(dashboard)/map/[id]/page.tsx`
- [ ] Render Konva canvas (read-only or editable based on permissions)
- [ ] Zoom/pan controls
- [ ] Click locations → tooltip with name + image + [View Details] link
- [ ] Toggle layers (show/hide terrain, labels, markers)
- [ ] Export map as PNG

**Multiple Maps:**
- [ ] Mythology can have multiple maps (world map, regional maps, city maps)
- [ ] `/app/(dashboard)/mythology/[id]/maps/page.tsx` - list all maps
- [ ] Student can create new map, copy existing map, delete map

---

## 🕸️ STEP 4: Relationship Mapping *(10-12 hours)*

### **A) Relationship Creation** *(4-5 hours)*

**Two Ways to Create Relationships:**

**1. From Character Page:**
- [ ] On `/app/(dashboard)/character/[id]/page.tsx`
- [ ] Section: "Relationships"
- [ ] [Add Relationship] button
- [ ] Modal opens:
  - Select other character (from same mythology)
  - Select relationship type (parent, sibling, ally, enemy, etc.)
  - Description (optional, e.g., "Volgar is Thor's rival for leadership")
  - Relationship strength (1-10 slider)
  - [Save]

**2. From Relationship Map (visual):**
- [ ] Drag one character node onto another → relationship creation modal
- [ ] Quick relationship type buttons (parent, ally, enemy)

**Validation:**
- [ ] Both characters must exist
- [ ] No duplicate relationships
- [ ] Check: character_1_id < character_2_id (to prevent A→B and B→A duplicates)

---

### **B) Relationship Map Visualization (Cytoscape.js)** *(6-7 hours)*

**Install:**
```bash
npm install cytoscape
npm install @types/cytoscape --save-dev
```

**Page:**
- [ ] `/app/(dashboard)/mythology/[id]/relationships/page.tsx`

**Features:**
- [ ] Graph visualization of all characters + relationships
- [ ] Nodes = characters (with portrait images)
- [ ] Edges = relationships (lines connecting nodes)
- [ ] Edge labels = relationship type ("parent", "ally", "enemy")
- [ ] Color-coded edges:
  - Green = ally/friend
  - Red = enemy/rival
  - Blue = family (parent, sibling, child)
  - Yellow = mentor/student
  - Gray = other
- [ ] Node size = importance (based on # of relationships)
- [ ] Click node → highlight connected nodes
- [ ] Click edge → show relationship details tooltip
- [ ] Drag nodes to reposition (save layout)

**Layout Options:**
- [ ] **Hierarchical** (family tree style, parents at top)
- [ ] **Force-directed** (organic, physics-based)
- [ ] **Circle** (all nodes in circle)
- [ ] **Grid** (organized rows/columns)
- [ ] [Switch Layout] dropdown

**Filters:**
- [ ] Show only specific relationship types (e.g., "Show only family relationships")
- [ ] Show only characters in specific stories
- [ ] Show only characters with images

**Actions:**
- [ ] [Add Relationship] (opens modal)
- [ ] [Export as PNG] (save graph image)
- [ ] [Export as JSON] (save data)

**Example Cytoscape Component:**
```typescript
// src/components/relationships/RelationshipGraph.tsx
'use client';

import { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';

export function RelationshipGraph({ characters, relationships }: {
  characters: any[],
  relationships: any[]
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Build Cytoscape elements
    const elements = [
      // Nodes (characters)
      ...characters.map(char => ({
        data: {
          id: char.id,
          label: char.name,
          image: char.primary_image_url,
        },
      })),
      // Edges (relationships)
      ...relationships.map(rel => ({
        data: {
          id: rel.id,
          source: rel.character_1_id,
          target: rel.character_2_id,
          label: rel.relationship_type,
          type: rel.relationship_type,
        },
      })),
    ];

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'background-image': 'data(image)',
            'background-fit': 'cover',
            'width': 60,
            'height': 60,
          },
        },
        {
          selector: 'edge',
          style: {
            'label': 'data(label)',
            'width': 2,
            'line-color': (ele: any) => {
              const type = ele.data('type');
              if (type === 'ally' || type === 'friend') return '#00ff00';
              if (type === 'enemy' || type === 'rival') return '#ff0000';
              if (type === 'parent' || type === 'child' || type === 'sibling') return '#0000ff';
              return '#cccccc';
            },
            'target-arrow-shape': 'triangle',
          },
        },
      ],
      layout: {
        name: 'cose', // Force-directed layout
      },
    });

    // Click handlers
    cy.on('tap', 'node', (event) => {
      const node = event.target;
      console.log('Clicked character:', node.data('label'));
      // Open character detail modal or navigate
    });

    return () => cy.destroy();
  }, [characters, relationships]);

  return (
    <div ref={containerRef} className="w-full h-[600px] border rounded-lg" />
  );
}
```

---

## 🤝 STEP 5: Cross-Mythology Interactions *(12-15 hours)*

### **A) Crossover Request System** *(4-5 hours)*

**Initiate Crossover:**
- [ ] From mythology page: [Request Crossover Collaboration] button
- [ ] Modal:
  - Select target mythology (from gallery)
  - Select collaboration type:
    - Alliance (peaceful cooperation)
    - Conflict (war, rivalry)
    - Trade (cultural exchange)
    - Crossover Story (co-write a story together)
    - Battle (AI-simulated combat)
  - Message (explain why you want to collaborate)
  - [Send Request]

**Request Workflow:**
1. Student A sends request to Student B
2. Student B receives notification
3. Student B views request on `/app/(dashboard)/student/requests` page
4. Student B can: Accept | Reject | Counter-offer
5. If accepted: Collaboration status = 'active'

**Collaboration Page:**
- [ ] `/app/(dashboard)/collaboration/[id]/page.tsx`
- [ ] Display both mythologies side-by-side
- [ ] Collaboration type and description
- [ ] Status indicators
- [ ] [Create Crossover Story] button (if type = crossover_story)
- [ ] [Initiate Battle] button (if type = battle)
- [ ] Chat/messaging between students (Phase 4)

---

### **B) AI-Simulated Battles** *(8-10 hours)*

**Battle Setup:**
- [ ] Page: `/app/(dashboard)/collaboration/[id]/battle/create/page.tsx`
- [ ] Battle type:
  - God vs God (1v1 deity battle)
  - Army vs Army (full pantheon warfare)
  - Creature vs Creature (bestiary showdown)
  - Custom (choose specific participants)
- [ ] Select participants:
  - Mythology 1: Select characters/creatures
  - Mythology 2: Select characters/creatures
- [ ] Setting:
  - Where does battle take place? (location from either mythology or neutral ground)
  - Terrain/environment (affects battle outcome)
- [ ] [Generate Battle] button

**GPT-4 Battle Generation:**
```typescript
// src/lib/openai/generateBattle.ts
import { openai } from './client';

export async function generateBattle({
  participants1,
  participants2,
  battleType,
  setting,
}: {
  participants1: any[],
  participants2: any[],
  battleType: string,
  setting: string
}) {
  const prompt = `
You are a mythology storyteller. Generate an epic battle narrative between two mythologies.

MYTHOLOGY 1 PARTICIPANTS:
${participants1.map(p => `- ${p.name}: ${p.description}`).join('\n')}

MYTHOLOGY 2 PARTICIPANTS:
${participants2.map(p => `- ${p.name}: ${p.description}`).join('\n')}

BATTLE TYPE: ${battleType}
SETTING: ${setting}

Generate a 500-word battle narrative that:
1. Describes the combatants and their powers
2. Details the course of the battle with vivid imagery
3. Determines a victor (or stalemate) based on powers, tactics, and setting
4. Provides battle statistics (casualties, duration, outcome type)

Format the response as JSON:
{
  "narrative": "...",
  "victor": "mythology_1 | mythology_2 | stalemate",
  "outcome_type": "decisive_victory | narrow_victory | stalemate | mutual_destruction",
  "casualties_mythology_1": 0-100,
  "casualties_mythology_2": 0-100,
  "battle_duration": "3 days",
  "key_moments": ["moment 1", "moment 2", ...]
}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content);
}
```

**Battle Result Page:**
- [ ] `/app/(dashboard)/battle/[id]/page.tsx`
- [ ] Display:
  - Battle narrative (rich text rendering)
  - Victor announcement
  - Statistics (casualties, duration, outcome type)
  - Key moments timeline
  - Participating characters/creatures (with portraits)
- [ ] Reactions:
  - Both students can react (👍 👎 😮)
  - Comments/discussion (Phase 4)
- [ ] [Rematch] button (generate new battle with same setup)
- [ ] [Share Battle] (link to share with class)

**Teacher Moderation:**
- [ ] Teacher can view all battles
- [ ] Teacher can hide inappropriate battles
- [ ] Teacher can create class-wide battle events (tournament brackets?)

---

## 📚 STEP 6: Research & Inspiration Library *(10-12 hours)*

### **A) Research Library UI** *(4-5 hours)*

**Page:**
- [ ] `/app/(dashboard)/library/page.tsx`

**Features:**
- [ ] Grid/list of curated resources
- [ ] Filter by:
  - Resource type (article, book, video, image, website)
  - Mythology culture (Greek, Norse, Egyptian, Aztec, etc.)
  - Topic tags (war gods, creation myths, underworld, tricksters, etc.)
  - Reading level (elementary, middle school, high school, all ages)
- [ ] Search by title/description
- [ ] Sort by: recently added, alphabetical, reading level

**Resource Card:**
- [ ] Thumbnail image
- [ ] Title
- [ ] Resource type icon
- [ ] Description (first 100 chars)
- [ ] Mythology culture badge
- [ ] Topic tags
- [ ] Reading level indicator
- [ ] [View Resource →] button (opens in new tab or modal)

**Teacher Can Add Resources:**
- [ ] `/app/(dashboard)/teacher/library/add` page
- [ ] Form:
  - Title
  - Resource type (select)
  - URL (if online resource)
  - Upload file (if PDF/image)
  - Description
  - Mythology culture (select)
  - Topic tags (multi-select)
  - Reading level (select)
  - Thumbnail (upload or auto-fetch from URL)
  - [Save Resource]

---

### **B) Deity Comparison Tool** *(4-5 hours)*

**Page:**
- [ ] `/app/(dashboard)/library/deities/page.tsx`

**Features:**
- [ ] Pre-populated database of deities from 8+ cultures
- [ ] Table view:
  - Columns: Name, Culture, Domain, Symbols, Key Myths
  - Filter by domain (war, death, trickster, creation, sea, etc.)
  - Filter by culture (Greek, Norse, Egyptian, etc.)
- [ ] Click deity → deity detail modal/page
  - Full description
  - Cultural context
  - Equivalent deities in other cultures
  - Related myths
  - Images (if available)
  - External links (Wikipedia, etc.)

**Comparison Mode:**
- [ ] Select multiple deities (checkboxes)
- [ ] [Compare Selected] button
- [ ] Side-by-side comparison view:
  - Shows similarities and differences
  - Highlights equivalent roles across cultures
  - Example: Ares (Greek) vs Mars (Roman) vs Odin (Norse) vs Huitzilopochtli (Aztec)

**Pre-populate Deity Data:**
- [ ] Create seed data script
- [ ] Use GPT-4 to generate deity descriptions for:
  - War gods: Ares, Mars, Odin, Thor, Huitzilopochtli, Sekhmet, Morrigan, Kali, Bishamonten
  - Death gods: Hades, Osiris, Hel, Mictlantecuhtli, Anubis, Yama
  - Tricksters: Loki, Anansi, Coyote, Hermes, Eshu
  - Creation gods: Zeus, Odin, Ra, Brahma, Pangu
  - Sea gods: Poseidon, Neptune, Njord, Yam, Varuna
- [ ] Save to `deity_comparisons` table

**Seed Data Script:**
```typescript
// scripts/seedDeityData.ts
import { supabase } from '@/lib/supabase/client';
import { openai } from '@/lib/openai/client';

const deities = [
  { name: 'Ares', culture: 'greek', domain: 'war' },
  { name: 'Mars', culture: 'roman', domain: 'war' },
  { name: 'Odin', culture: 'norse', domain: 'war' },
  // ... more deities
];

async function generateDeityDescription(name: string, culture: string, domain: string) {
  const prompt = `Generate a 200-word description of ${name}, the ${culture} god/goddess of ${domain}. Include symbols, key myths, and cultural context. Format as JSON: { "description": "...", "symbols": ["..."], "key_myths": "...", "cultural_context": "..." }`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });
  
  return JSON.parse(response.choices[0].message.content);
}

async function seedDeities() {
  for (const deity of deities) {
    const data = await generateDeityDescription(deity.name, deity.culture, deity.domain);
    
    await supabase.from('deity_comparisons').insert({
      deity_name: deity.name,
      mythology_culture: deity.culture,
      domain: deity.domain,
      description: data.description,
      symbols: data.symbols,
      key_myths: data.key_myths,
      cultural_context: data.cultural_context,
    });
    
    console.log(`Seeded: ${deity.name}`);
  }
}

seedDeities();
```

---

### **C) AI Research Assistant** *(2-3 hours)*

**Contextual Suggestions:**
- [ ] While creating character, AI suggests similar deities from library
  - "You're creating an ice god. Check out Skadi (Norse goddess of winter) for inspiration!"
  - [View in Library] link

**Research Chat (Phase 5):**
- [ ] Placeholder: "Ask me about mythology!"
- [ ] Student types question: "What are common traits of trickster gods?"
- [ ] AI responds with answer + links to relevant library resources

---

## 🧪 STEP 7: Testing & Bug Fixes *(8-10 hours)*

**Manual Testing:**
- [ ] Test story creation (all modes, AI assistance, rich text editor)
- [ ] Test map creation (coordinate systems, drawing tools, location markers)
- [ ] Test location management (create, edit, view, link to characters)
- [ ] Test relationship creation (from character page, from graph)
- [ ] Test relationship graph (visualization, layouts, filters, export)
- [ ] Test crossover requests (send, receive, accept, reject)
- [ ] Test AI battles (generate, view results, statistics)
- [ ] Test research library (browse, filter, search, add resources as teacher)
- [ ] Test deity comparisons (filter, compare, view details)

**Bug Fixes:**
- [ ] Fix any crashes, errors, validation issues
- [ ] Improve loading states, error messages
- [ ] Optimize performance (lazy load heavy components, cache data)

---

## 🚀 STEP 8: Deploy Phase 2 *(2-3 hours)*

**Pre-Deployment:**
- [ ] Run database migrations on production Supabase
- [ ] Seed deity data (run seed script)
- [ ] Test production build: `npm run build && npm run start`
- [ ] Update environment variables (if any new API keys)
- [ ] Run linter: `npm run lint`

**Deploy:**
- [ ] Push to GitHub
- [ ] Vercel auto-deploys
- [ ] Test critical flows in production

**PHASE 2 DELIVERABLE:**
✅ Story & narrative system fully functional (rich text editor, AI assistance, multiple modes)
✅ World maps with custom coordinate systems (Konva canvas, location markers, drawing tools)
✅ Relationship mapping with visual graph (Cytoscape.js, multiple layouts)
✅ Cross-mythology interactions (crossover requests, AI-simulated battles)
✅ Research library (curated resources, deity comparisons, AI suggestions)
✅ All features live and tested

**TIME ESTIMATE:** 60-80 hours (3-4 weeks part-time, or 2-3 weeks full-time)

---

## 📝 PHASE 2 RESEARCH TASKS COMPLETED

- ✅ Reviewed TipTap rich text editor
- ✅ Researched Konva.js for canvas drawing
- ✅ Researched custom coordinate system implementation
- ✅ Reviewed Cytoscape.js for relationship graphs
- ✅ Designed GPT-4 battle generation prompts
- ✅ Planned deity database structure

---

*Phase 2 detailed. Ready for Phase 3 when you say go.* 🕶️

---

---

# 🎮 PHASE 3: GAMIFICATION & ENGAGEMENT

## Duration: Weeks 8-10 (~40-50 hours)

---

## 🎯 PHASE 3 GOAL

**Build motivation and engagement systems:** Points, badges, leaderboards, streaks, levels, themes, and avatar customization.

**Features to Build:**
1. Points system (award points for actions)
2. Badge/achievement system (50+ badges)
3. Leaderboards (multiple categories)
4. Streaks & daily challenges
5. Level progression (1-50+)
6. Theme system (12 themes)
7. Avatar customization (Avataaars integration + custom mythology items)
8. Progress tracking & stats

---

## 📋 PHASE 3 PREREQUISITES

**Must be completed from Phase 1-2:**
- ✅ Character, creature, story creation working
- ✅ Database schema with user profiles
- ✅ Basic student dashboard

**New Database Tables Needed:**
- `points_log` (track all point-earning activities)
- `badges` (badge definitions)
- `user_badges` (earned badges per user)
- `daily_challenges` (rotating challenges)
- `avatar_items` (unlockable avatar customization items)
- `user_avatar_config` (user's current avatar setup)

---

## 🗄️ STEP 1: Database Schema Extension *(3-4 hours)*

Create migration: `supabase/migrations/003_gamification.sql`

```sql
-- POINTS LOG TABLE
CREATE TABLE IF NOT EXISTS public.points_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Points Info
  points_earned INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- 'character_created', 'story_completed', 'daily_login', etc.
  reference_id UUID, -- ID of related entity (character_id, story_id, etc.)
  reference_type TEXT, -- 'character', 'story', 'creature', etc.
  
  -- Metadata
  multiplier FLOAT DEFAULT 1.0, -- Bonus multipliers (streak bonus, etc.)
  description TEXT, -- Human-readable description
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- BADGES TABLE (Definitions)
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Badge Info
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_url TEXT,
  
  -- Unlock Criteria
  criteria_type TEXT NOT NULL, -- 'count', 'streak', 'quality', 'achievement', 'special'
  criteria_config JSONB NOT NULL, -- { "action": "character_created", "count": 5 }
  
  -- Visual
  rarity TEXT CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')) DEFAULT 'common',
  color TEXT, -- Hex color for badge display
  
  -- Rewards
  points_reward INTEGER DEFAULT 0,
  unlocks_avatar_item UUID, -- Optional: unlocks specific avatar item
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- USER BADGES TABLE (Earned)
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  
  -- Earned Info
  earned_at TIMESTAMP DEFAULT NOW(),
  progress_data JSONB, -- Track progress toward badge (e.g., 3/5 characters created)
  
  -- Display
  is_featured BOOLEAN DEFAULT FALSE, -- Show on profile
  
  CONSTRAINT unique_user_badge UNIQUE(user_id, badge_id)
);

-- DAILY CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Challenge Info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL, -- 'create_character', 'write_story', 'explore_gallery', etc.
  
  -- Requirements
  requirement_config JSONB NOT NULL, -- { "action": "write_story", "min_words": 200 }
  
  -- Rewards
  points_reward INTEGER DEFAULT 50,
  badge_id UUID REFERENCES public.badges(id), -- Optional badge reward
  
  -- Scheduling
  active_date DATE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- USER CHALLENGE PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_challenge_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.daily_challenges(id) ON DELETE CASCADE,
  
  -- Progress
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  progress_data JSONB, -- Track progress (e.g., words written: 150/200)
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_user_challenge UNIQUE(user_id, challenge_id)
);

-- AVATAR ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.avatar_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Item Info
  name TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('accessory', 'clothing', 'background', 'special_effect')),
  item_slot TEXT, -- 'hat', 'glasses', 'shirt', 'background', etc.
  
  -- Visual
  image_url TEXT, -- Item image/icon
  avataaars_config JSONB, -- Configuration for Avataaars library
  
  -- Unlock Requirements
  unlock_type TEXT CHECK (unlock_type IN ('default', 'level', 'badge', 'points', 'special')) DEFAULT 'default',
  unlock_requirement JSONB, -- { "level": 10 } or { "badge": "epic_worldbuilder" } or { "points": 1000 }
  
  -- Metadata
  mythology_themed BOOLEAN DEFAULT FALSE, -- Is this a mythology-specific item?
  mythology_theme TEXT, -- 'norse', 'greek', 'cyberpunk', etc.
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- USER AVATAR CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.user_avatar_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  
  -- Avataaars Base Config
  avataaars_config JSONB NOT NULL, -- Full Avataaars configuration
  
  -- Custom Items (unlocked and equipped)
  equipped_items UUID[], -- Array of avatar_item IDs
  
  -- Generated Avatar URL
  avatar_url TEXT, -- URL to generated avatar image
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- LEADERBOARD VIEW (Materialized for performance)
CREATE MATERIALIZED VIEW leaderboard_points AS
SELECT 
  p.id,
  p.display_name,
  p.avatar_url,
  p.points,
  p.level,
  p.current_streak,
  ROW_NUMBER() OVER (ORDER BY p.points DESC) as rank
FROM public.profiles p
WHERE p.role = 'student'
ORDER BY p.points DESC;

-- Refresh leaderboard daily
CREATE OR REPLACE FUNCTION refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW leaderboard_points;
END;
$$ LANGUAGE plpgsql;

-- Add to profiles table (if not already exists)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_theme TEXT DEFAULT 'cyberpunk_neon';

-- ROW LEVEL SECURITY
ALTER TABLE public.points_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_avatar_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies (students can read all, insert/update own)
CREATE POLICY "Users can view own points log" ON public.points_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Badges are public" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Users can view all earned badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can view own badge progress" ON public.user_badges FOR UPDATE USING (auth.uid() = user_id);
-- (Similar policies for other tables)
```

**Actions:**
- [ ] Run migration in Supabase
- [ ] Verify tables created
- [ ] Regenerate TypeScript types

---

## 💰 STEP 2: Points System Implementation *(6-8 hours)*

### **A) Points Award Function** *(3-4 hours)*

Create server-side function to award points:

```typescript
// src/lib/gamification/awardPoints.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function awardPoints({
  userId,
  points,
  actionType,
  referenceId,
  referenceType,
  description,
  multiplier = 1.0,
}: {
  userId: string,
  points: number,
  actionType: string,
  referenceId?: string,
  referenceType?: string,
  description?: string,
  multiplier?: number
}) {
  const supabase = createServerSupabaseClient();
  
  const finalPoints = Math.round(points * multiplier);
  
  // Insert points log
  const { data: logEntry, error: logError } = await supabase
    .from('points_log')
    .insert({
      user_id: userId,
      points_earned: finalPoints,
      action_type: actionType,
      reference_id: referenceId,
      reference_type: referenceType,
      description: description || `Earned ${finalPoints} points for ${actionType}`,
      multiplier,
    })
    .select()
    .single();
  
  if (logError) throw logError;
  
  // Update user's total points
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('points, level')
    .eq('id', userId)
    .single();
  
  if (profileError) throw profileError;
  
  const newPoints = profile.points + finalPoints;
  const newLevel = calculateLevel(newPoints);
  
  await supabase
    .from('profiles')
    .update({ 
      points: newPoints,
      level: newLevel,
    })
    .eq('id', userId);
  
  // Check for level-up
  if (newLevel > profile.level) {
    await handleLevelUp(userId, newLevel);
  }
  
  // Check badge progress
  await checkBadgeProgress(userId, actionType);
  
  return { points: finalPoints, newTotal: newPoints, newLevel };
}

function calculateLevel(points: number): number {
  // Level formula: level = floor(sqrt(points / 100)) + 1
  // Level 1: 0-99 points
  // Level 2: 100-399 points
  // Level 3: 400-899 points
  // etc.
  return Math.floor(Math.sqrt(points / 100)) + 1;
}

async function handleLevelUp(userId: string, newLevel: number) {
  // Award level-up bonus
  await awardPoints({
    userId,
    points: 50,
    actionType: 'level_up',
    description: `Reached Level ${newLevel}!`,
  });
  
  // Check for level-based badge
  await checkBadgeProgress(userId, 'level_up');
  
  // Send notification (Phase 4)
  // await sendNotification(userId, `You've reached Level ${newLevel}!`);
}
```

### **B) Points Award Hooks** *(3-4 hours)*

Integrate points into existing actions:

**Character Creation:**
```typescript
// In character creation API route: /app/api/characters/create/route.ts
import { awardPoints } from '@/lib/gamification/awardPoints';

export async function POST(req: Request) {
  // ... existing character creation logic
  
  const character = await createCharacter(data);
  
  // Award points
  await awardPoints({
    userId: user.id,
    points: 50,
    actionType: 'character_created',
    referenceId: character.id,
    referenceType: 'character',
    description: `Created character: ${character.name}`,
  });
  
  return Response.json({ character });
}
```

**Story Completion:**
```typescript
// In story save API route
await awardPoints({
  userId: user.id,
  points: story.word_count >= 500 ? 150 : 100,
  actionType: 'story_completed',
  referenceId: story.id,
  referenceType: 'story',
  description: `Completed story: ${story.title} (${story.word_count} words)`,
});
```

**Daily Login:**
```typescript
// In middleware or dashboard load
const lastActivity = user.last_activity_date;
const today = new Date().toISOString().split('T')[0];

if (lastActivity !== today) {
  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  let newStreak = 1;
  if (lastActivity === yesterdayStr) {
    newStreak = user.current_streak + 1;
  }
  
  await supabase
    .from('profiles')
    .update({
      last_activity_date: today,
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, user.longest_streak),
    })
    .eq('id', user.id);
  
  // Award daily login points
  await awardPoints({
    userId: user.id,
    points: 10,
    actionType: 'daily_login',
    description: `Daily login (${newStreak} day streak)`,
    multiplier: newStreak >= 7 ? 1.5 : 1.0, // Bonus for week+ streaks
  });
}
```

**Point Values:**
- Character created: 50
- Creature created: 50
- Story completed (100-499 words): 100
- Story completed (500+ words): 150
- Location created: 30
- Relationship created: 20
- Map created: 100
- Daily login: 10 (1.5x if streak >= 7)
- Crossover collaboration: 200
- Battle participation: 100
- Gallery exploration (view 5 mythologies): 25
- Profile completion (add bio, avatar): 50

---

## 🏆 STEP 3: Badge System *(8-10 hours)*

### **A) Badge Definitions** *(2-3 hours)*

Seed initial badges:

```typescript
// scripts/seedBadges.ts
import { supabase } from '@/lib/supabase/client';

const badges = [
  // Creation Badges
  {
    name: 'First Creation',
    slug: 'first_creation',
    description: 'Created your first character',
    criteria_type: 'count',
    criteria_config: { action: 'character_created', count: 1 },
    rarity: 'common',
    points_reward: 10,
  },
  {
    name: 'Pantheon Builder',
    slug: 'pantheon_builder',
    description: 'Created 5 characters',
    criteria_type: 'count',
    criteria_config: { action: 'character_created', count: 5 },
    rarity: 'uncommon',
    points_reward: 50,
  },
  {
    name: 'Epic Worldbuilder',
    slug: 'epic_worldbuilder',
    description: 'Created 10 characters',
    criteria_type: 'count',
    criteria_config: { action: 'character_created', count: 10 },
    rarity: 'rare',
    points_reward: 100,
  },
  
  // Story Badges
  {
    name: 'Storyteller',
    slug: 'storyteller',
    description: 'Completed your first story',
    criteria_type: 'count',
    criteria_config: { action: 'story_completed', count: 1 },
    rarity: 'common',
    points_reward: 10,
  },
  {
    name: 'Epic Narrator',
    slug: 'epic_narrator',
    description: 'Completed 5 stories',
    criteria_type: 'count',
    criteria_config: { action: 'story_completed', count: 5 },
    rarity: 'uncommon',
    points_reward: 50,
  },
  {
    name: 'Legendary Scribe',
    slug: 'legendary_scribe',
    description: 'Wrote over 5,000 words',
    criteria_type: 'cumulative',
    criteria_config: { action: 'words_written', total: 5000 },
    rarity: 'rare',
    points_reward: 150,
  },
  
  // Streak Badges
  {
    name: 'Dedicated Creator',
    slug: 'dedicated_creator',
    description: '7-day login streak',
    criteria_type: 'streak',
    criteria_config: { days: 7 },
    rarity: 'uncommon',
    points_reward: 75,
  },
  {
    name: 'Unstoppable',
    slug: 'unstoppable',
    description: '30-day login streak',
    criteria_type: 'streak',
    criteria_config: { days: 30 },
    rarity: 'epic',
    points_reward: 300,
  },
  
  // Collaboration Badges
  {
    name: 'Ally',
    slug: 'ally',
    description: 'Participated in a crossover collaboration',
    criteria_type: 'achievement',
    criteria_config: { action: 'crossover_participated' },
    rarity: 'uncommon',
    points_reward: 50,
  },
  {
    name: 'Battle Champion',
    slug: 'battle_champion',
    description: 'Won 5 AI-simulated battles',
    criteria_type: 'count',
    criteria_config: { action: 'battle_won', count: 5 },
    rarity: 'rare',
    points_reward: 150,
  },
  
  // Quality Badges
  {
    name: 'Detail Master',
    slug: 'detail_master',
    description: 'Created a character with 500+ words of description',
    criteria_type: 'quality',
    criteria_config: { action: 'character_detailed', min_words: 500 },
    rarity: 'rare',
    points_reward: 100,
  },
  
  // Exploration Badges
  {
    name: 'Explorer',
    slug: 'explorer',
    description: 'Viewed 10 other mythologies',
    criteria_type: 'count',
    criteria_config: { action: 'mythology_viewed', count: 10 },
    rarity: 'common',
    points_reward: 25,
  },
  
  // Special Badges
  {
    name: 'Completionist',
    slug: 'completionist',
    description: 'Completed all sections of your mythology',
    criteria_type: 'achievement',
    criteria_config: { action: 'mythology_complete' },
    rarity: 'legendary',
    points_reward: 500,
  },
  
  // ... (add 40+ more badges)
];

async function seedBadges() {
  for (const badge of badges) {
    await supabase.from('badges').insert(badge);
    console.log(`Seeded badge: ${badge.name}`);
  }
}

seedBadges();
```

### **B) Badge Progress Checker** *(4-5 hours)*

```typescript
// src/lib/gamification/checkBadgeProgress.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function checkBadgeProgress(userId: string, actionType: string) {
  const supabase = createServerSupabaseClient();
  
  // Get all badges matching this action type
  const { data: badges, error } = await supabase
    .from('badges')
    .select('*')
    .eq('criteria_type', 'count')
    .filter('criteria_config->>action', 'eq', actionType);
  
  if (error || !badges) return;
  
  for (const badge of badges) {
    // Check if user already has this badge
    const { data: existing } = await supabase
      .from('user_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('badge_id', badge.id)
      .single();
    
    if (existing) continue; // Already earned
    
    // Check progress
    const requiredCount = badge.criteria_config.count;
    const { count: currentCount } = await supabase
      .from('points_log')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('action_type', actionType);
    
    if (currentCount >= requiredCount) {
      // Award badge!
      await awardBadge(userId, badge.id);
    } else {
      // Update progress
      await supabase
        .from('user_badges')
        .upsert({
          user_id: userId,
          badge_id: badge.id,
          progress_data: { current: currentCount, required: requiredCount },
        });
    }
  }
}

async function awardBadge(userId: string, badgeId: string) {
  const supabase = createServerSupabaseClient();
  
  // Get badge details
  const { data: badge } = await supabase
    .from('badges')
    .select('*')
    .eq('id', badgeId)
    .single();
  
  if (!badge) return;
  
  // Award badge
  await supabase
    .from('user_badges')
    .insert({
      user_id: userId,
      badge_id: badgeId,
      earned_at: new Date().toISOString(),
    });
  
  // Award points reward
  if (badge.points_reward > 0) {
    await awardPoints({
      userId,
      points: badge.points_reward,
      actionType: 'badge_earned',
      referenceId: badgeId,
      referenceType: 'badge',
      description: `Earned badge: ${badge.name}`,
    });
  }
  
  // Send notification (Phase 4)
  // await sendNotification(userId, `You earned the "${badge.name}" badge!`);
}
```

### **C) Badge Display UI** *(2-3 hours)*

**Badges Page:**
```typescript
// src/app/(dashboard)/student/badges/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function BadgesPage() {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  
  useEffect(() => {
    async function loadBadges() {
      const { data: earned } = await supabase
        .from('user_badges')
        .select('*, badge:badges(*)')
        .eq('user_id', user.id);
      
      const { data: all } = await supabase
        .from('badges')
        .select('*')
        .order('rarity');
      
      setEarnedBadges(earned || []);
      setAllBadges(all || []);
    }
    
    loadBadges();
  }, []);
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Badges</h1>
      
      {/* Earned Badges */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Earned ({earnedBadges.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {earnedBadges.map(({ badge }) => (
            <BadgeCard key={badge.id} badge={badge} earned />
          ))}
        </div>
      </section>
      
      {/* Locked Badges */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">
          Locked ({allBadges.length - earnedBadges.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {allBadges
            .filter(b => !earnedBadges.find(e => e.badge_id === b.id))
            .map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
        </div>
      </section>
    </div>
  );
}

function BadgeCard({ badge, earned = false }: { badge: any, earned?: boolean }) {
  const rarityColors = {
    common: 'bg-gray-200',
    uncommon: 'bg-green-200',
    rare: 'bg-blue-200',
    epic: 'bg-purple-200',
    legendary: 'bg-yellow-200',
  };
  
  return (
    <div className={`p-4 rounded-lg border-2 ${earned ? rarityColors[badge.rarity] : 'bg-gray-100 opacity-50'}`}>
      <div className="text-4xl mb-2">{earned ? '🏆' : '🔒'}</div>
      <h3 className="font-semibold">{badge.name}</h3>
      <p className="text-sm text-gray-600">{badge.description}</p>
      {earned && <span className="text-xs text-green-600">✓ Earned</span>}
    </div>
  );
}
```

---

## 📊 STEP 4: Leaderboards *(6-8 hours)*

### **A) Leaderboard Data** *(3-4 hours)*

**Multiple Leaderboard Categories:**

```typescript
// src/lib/gamification/leaderboards.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function getLeaderboard(category: 'points' | 'level' | 'streak' | 'stories' | 'characters', limit = 20) {
  const supabase = createServerSupabaseClient();
  
  switch (category) {
    case 'points':
      const { data: pointsLeaderboard } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, points, level')
        .eq('role', 'student')
        .order('points', { ascending: false })
        .limit(limit);
      return pointsLeaderboard;
    
    case 'streak':
      const { data: streakLeaderboard } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, current_streak, longest_streak')
        .eq('role', 'student')
        .order('longest_streak', { ascending: false })
        .limit(limit);
      return streakLeaderboard;
    
    case 'stories':
      // Count stories per user
      const { data: storyLeaderboard } = await supabase
        .rpc('get_story_leaderboard', { limit_count: limit });
      return storyLeaderboard;
    
    case 'characters':
      const { data: characterLeaderboard } = await supabase
        .rpc('get_character_leaderboard', { limit_count: limit });
      return characterLeaderboard;
    
    default:
      return [];
  }
}

// Create SQL functions for complex leaderboards
/*
CREATE OR REPLACE FUNCTION get_story_leaderboard(limit_count INTEGER)
RETURNS TABLE (
  user_id UUID,
  display_name TEXT,
  avatar_url TEXT,
  story_count BIGINT,
  total_words BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id as user_id,
    p.display_name,
    p.avatar_url,
    COUNT(s.id) as story_count,
    COALESCE(SUM(s.word_count), 0) as total_words
  FROM public.profiles p
  LEFT JOIN public.stories s ON s.created_by = p.id
  WHERE p.role = 'student'
  GROUP BY p.id, p.display_name, p.avatar_url
  ORDER BY story_count DESC, total_words DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
*/
```

### **B) Leaderboard UI** *(3-4 hours)*

```typescript
// src/app/(dashboard)/leaderboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getLeaderboard } from '@/lib/gamification/leaderboards';

export default function LeaderboardPage() {
  const [category, setCategory] = useState<'points' | 'streak' | 'stories' | 'characters'>('points');
  const [data, setData] = useState([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  
  useEffect(() => {
    async function load() {
      const leaderboard = await getLeaderboard(category);
      setData(leaderboard);
      
      // Find current user's rank
      const userIndex = leaderboard.findIndex(u => u.id === user.id);
      setUserRank(userIndex >= 0 ? userIndex + 1 : null);
    }
    
    load();
  }, [category]);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      
      {/* Category Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setCategory('points')}
          className={`px-4 py-2 rounded ${category === 'points' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Points
        </button>
        <button
          onClick={() => setCategory('streak')}
          className={`px-4 py-2 rounded ${category === 'streak' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Streaks
        </button>
        <button
          onClick={() => setCategory('stories')}
          className={`px-4 py-2 rounded ${category === 'stories' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Stories
        </button>
        <button
          onClick={() => setCategory('characters')}
          className={`px-4 py-2 rounded ${category === 'characters' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Characters
        </button>
      </div>
      
      {/* User's Rank */}
      {userRank && (
        <div className="bg-yellow-100 p-4 rounded mb-4">
          Your Rank: #{userRank}
        </div>
      )}
      
      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Student</th>
              <th className="px-4 py-2 text-right">
                {category === 'points' && 'Points'}
                {category === 'streak' && 'Longest Streak'}
                {category === 'stories' && 'Stories'}
                {category === 'characters' && 'Characters'}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <tr key={entry.id} className={entry.id === user.id ? 'bg-yellow-50' : ''}>
                <td className="px-4 py-3">
                  {index + 1 === 1 && '🥇'}
                  {index + 1 === 2 && '🥈'}
                  {index + 1 === 3 && '🥉'}
                  {index + 1 > 3 && `#${index + 1}`}
                </td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <img src={entry.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                  <span>{entry.display_name}</span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">
                  {category === 'points' && entry.points}
                  {category === 'streak' && `${entry.longest_streak} days`}
                  {category === 'stories' && entry.story_count}
                  {category === 'characters' && entry.character_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 🎨 STEP 5: Theme System *(6-8 hours)*

### **A) Theme Definitions** *(2-3 hours)*

```typescript
// src/lib/themes/themes.ts
export const themes = {
  cyberpunk_neon: {
    name: 'Cyberpunk Neon',
    colors: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      background: '#0a0a0a',
      surface: '#1a1a1a',
      text: '#ffffff',
    },
    fonts: {
      heading: 'Orbitron',
      body: 'Roboto',
    },
  },
  ancient_scrolls: {
    name: 'Ancient Scrolls',
    colors: {
      primary: '#8b4513',
      secondary: '#daa520',
      background: '#f5e6d3',
      surface: '#fff8dc',
      text: '#2f1b0c',
    },
    fonts: {
      heading: 'Cinzel',
      body: 'Merriweather',
    },
  },
  dark_realm: {
    name: 'Dark Realm',
    colors: {
      primary: '#8b0000',
      secondary: '#4b0082',
      background: '#1c1c1c',
      surface: '#2a2a2a',
      text: '#e0e0e0',
    },
    fonts: {
      heading: 'Creepster',
      body: 'Lora',
    },
  },
  // ... 9 more themes (ocean depths, forest spirit, desert sun, etc.)
};

export type ThemeKey = keyof typeof themes;
```

### **B) Theme Switcher** *(2-3 hours)*

```typescript
// src/components/theme/ThemeSwitcher.tsx
'use client';

import { useState, useEffect } from 'react';
import { themes, ThemeKey } from '@/lib/themes/themes';
import { supabase } from '@/lib/supabase/client';

export function ThemeSwitcher({ userId }: { userId: string }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('cyberpunk_neon');
  
  useEffect(() => {
    async function loadTheme() {
      const { data } = await supabase
        .from('profiles')
        .select('preferred_theme')
        .eq('id', userId)
        .single();
      
      if (data?.preferred_theme) {
        setCurrentTheme(data.preferred_theme as ThemeKey);
        applyTheme(data.preferred_theme as ThemeKey);
      }
    }
    
    loadTheme();
  }, [userId]);
  
  async function changeTheme(themeKey: ThemeKey) {
    setCurrentTheme(themeKey);
    applyTheme(themeKey);
    
    await supabase
      .from('profiles')
      .update({ preferred_theme: themeKey })
      .eq('id', userId);
  }
  
  function applyTheme(themeKey: ThemeKey) {
    const theme = themes[themeKey];
    const root = document.documentElement;
    
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    
    // Update font families
    document.body.style.fontFamily = theme.fonts.body;
  }
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-3">Choose Your Theme</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(themes).map(([key, theme]) => (
          <button
            key={key}
            onClick={() => changeTheme(key as ThemeKey)}
            className={`p-4 rounded border-2 ${currentTheme === key ? 'border-blue-500' : 'border-gray-300'}`}
            style={{ backgroundColor: theme.colors.surface }}
          >
            <div className="font-semibold" style={{ color: theme.colors.text }}>
              {theme.name}
            </div>
            <div className="flex gap-1 mt-2">
              {Object.values(theme.colors).map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### **C) Apply Theme Globally** *(2 hours)*

```typescript
// src/app/layout.tsx
import { ThemeProvider } from '@/components/theme/ThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

// src/components/theme/ThemeProvider.tsx
'use client';

import { useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { themes, ThemeKey } from '@/lib/themes/themes';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  
  useEffect(() => {
    if (user?.preferred_theme) {
      const theme = themes[user.preferred_theme as ThemeKey];
      const root = document.documentElement;
      
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
  }, [user]);
  
  return <>{children}</>;
}
```

---

## 👤 STEP 6: Avatar Customization System *(8-10 hours)*

### **A) Avataaars Integration** *(4-5 hours)*

```bash
npm install @avarat/react-avataaars
```

```typescript
// src/components/avatar/AvatarBuilder.tsx
'use client';

import { useState } from 'react';
import Avatar from '@avataaars/react-avataaars';

export function AvatarBuilder({ onSave }: { onSave: (config: any) => void }) {
  const [config, setConfig] = useState({
    topType: 'ShortHairShortFlat',
    accessoriesType: 'Blank',
    hairColor: 'Black',
    facialHairType: 'Blank',
    clotheType: 'Hoodie',
    clotheColor: 'Blue03',
    eyeType: 'Default',
    eyebrowType: 'Default',
    mouthType: 'Smile',
    skinColor: 'Light',
  });
  
  return (
    <div className="flex gap-8">
      {/* Preview */}
      <div>
        <Avatar
          style={{ width: '200px', height: '200px' }}
          avatarStyle='Circle'
          {...config}
        />
      </div>
      
      {/* Customization Options */}
      <div className="space-y-4">
        <div>
          <label>Hair Style</label>
          <select
            value={config.topType}
            onChange={(e) => setConfig({ ...config, topType: e.target.value })}
          >
            <option value="ShortHairShortFlat">Short Flat</option>
            <option value="LongHairStraight">Long Straight</option>
            <option value="ShortHairDreads">Dreads</option>
            {/* More options */}
          </select>
        </div>
        
        <div>
          <label>Hair Color</label>
          <select
            value={config.hairColor}
            onChange={(e) => setConfig({ ...config, hairColor: e.target.value })}
          >
            <option value="Black">Black</option>
            <option value="Brown">Brown</option>
            <option value="Blonde">Blonde</option>
            {/* More options */}
          </select>
        </div>
        
        {/* More customization options */}
        
        <button
          onClick={() => onSave(config)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save Avatar
        </button>
      </div>
    </div>
  );
}
```

### **B) Custom Mythology Items** *(4-5 hours)*

Seed avatar items:

```typescript
// scripts/seedAvatarItems.ts
const avatarItems = [
  {
    name: 'Norse Helmet',
    item_type: 'accessory',
    item_slot: 'hat',
    unlock_type: 'level',
    unlock_requirement: { level: 5 },
    mythology_themed: true,
    mythology_theme: 'norse',
  },
  {
    name: 'Cyberpunk Visor',
    item_type: 'accessory',
    item_slot: 'glasses',
    unlock_type: 'badge',
    unlock_requirement: { badge: 'epic_worldbuilder' },
    mythology_themed: true,
    mythology_theme: 'cyberpunk',
  },
  {
    name: 'Phoenix Wings Background',
    item_type: 'background',
    item_slot: 'background',
    unlock_type: 'points',
    unlock_requirement: { points: 1000 },
    mythology_themed: true,
    mythology_theme: 'fantasy',
  },
  // ... more items
];

async function seedAvatarItems() {
  for (const item of avatarItems) {
    await supabase.from('avatar_items').insert(item);
  }
}
```

**Avatar Item Unlock Check:**

```typescript
// src/lib/gamification/checkAvatarUnlocks.ts
export async function checkAvatarItemUnlocks(userId: string) {
  const supabase = createServerSupabaseClient();
  
  // Get user stats
  const { data: user } = await supabase
    .from('profiles')
    .select('points, level')
    .eq('id', userId)
    .single();
  
  // Get earned badges
  const { data: badges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId);
  
  const badgeIds = badges?.map(b => b.badge_id) || [];
  
  // Check unlockable items
  const { data: items } = await supabase
    .from('avatar_items')
    .select('*');
  
  const unlocked = items?.filter(item => {
    if (item.unlock_type === 'level') {
      return user.level >= item.unlock_requirement.level;
    }
    if (item.unlock_type === 'points') {
      return user.points >= item.unlock_requirement.points;
    }
    if (item.unlock_type === 'badge') {
      return badgeIds.includes(item.unlock_requirement.badge);
    }
    return item.unlock_type === 'default';
  });
  
  return unlocked;
}
```

---

## 📈 STEP 7: Progress Tracking Dashboard *(4-6 hours)*

```typescript
// src/app/(dashboard)/student/progress/page.tsx
export default async function ProgressPage() {
  const user = await getCurrentUser();
  const stats = await getUserStats(user.id);
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Progress</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Level" value={user.level} icon="⬆️" />
        <StatCard label="Points" value={user.points} icon="⭐" />
        <StatCard label="Current Streak" value={`${user.current_streak} days`} icon="🔥" />
        <StatCard label="Badges" value={stats.badgeCount} icon="🏆" />
      </div>
      
      {/* Level Progress */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Level {user.level}</h2>
        <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-blue-500 transition-all"
            style={{ width: `${getLevelProgress(user.points)}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {getPointsToNextLevel(user.points)} points to Level {user.level + 1}
        </p>
      </div>
      
      {/* Activity Chart */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Activity This Month</h2>
        {/* Simple chart showing daily activity */}
        <ActivityChart userId={user.id} />
      </div>
      
      {/* Recent Achievements */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
        <RecentBadges userId={user.id} limit={5} />
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string, value: any, icon: string }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
```

---

## 🧪 STEP 8: Testing & Deployment *(4-6 hours)*

**Testing:**
- [ ] Test points awarded correctly for all actions
- [ ] Test badge unlocking (count, streak, quality badges)
- [ ] Test leaderboards (all categories, ranking accuracy)
- [ ] Test theme switching (applies globally, persists)
- [ ] Test avatar customization (Avataaars + custom items)
- [ ] Test level progression (correct calculations, level-up triggers)
- [ ] Test streak tracking (daily login, streak bonuses)

**Bug Fixes:**
- [ ] Fix any calculation errors
- [ ] Optimize performance (cache leaderboards, lazy load)

**Deploy:**
- [ ] Run migration on production
- [ ] Seed badges and avatar items
- [ ] Push to GitHub → Vercel deploy
- [ ] Test in production

**PHASE 3 DELIVERABLE:**
✅ Points system fully functional (award points for all actions)
✅ Badge system with 50+ badges (earned, progress tracking, notifications)
✅ Leaderboards (points, streaks, stories, characters)
✅ Streak tracking (daily login bonuses, streak multipliers)
✅ Level progression (1-50+, level-up rewards)
✅ Theme system (12 themes, global application, persistence)
✅ Avatar customization (Avataaars + mythology-themed unlockable items)
✅ Progress dashboard (stats, charts, recent achievements)

**TIME ESTIMATE:** 40-50 hours (2-3 weeks part-time)

---

*Phase 3 detailed. Proceeding to Phase 4...* 🕶️

---

---

# 🤝 PHASE 4: COLLABORATION & REAL-TIME

## Duration: Weeks 11-14 (~50-60 hours)

---

## 🎯 PHASE 4 GOAL

**Build real-time collaboration features:** Co-editing, version history, group chat, mythology merging, and crossover co-authoring.

**Features to Build:**
1. Real-time co-editing with Yjs CRDT
2. Version history & auto-save (every 2 minutes)
3. Group chat system
4. Mythology merging/forking
5. Crossover story co-authoring
6. Edit conflict resolution
7. Presence indicators (who's online)
8. Notification system

---

## 📋 PHASE 4 PREREQUISITES

**Must be completed from Phase 1-3:**
- ✅ Character, creature, story creation working
- ✅ Database schema with user profiles
- ✅ Points & gamification system active

**New Database Tables Needed:**
- `version_history` (track all changes to mythologies/characters/stories)
- `chat_rooms` (group chat rooms)
- `chat_messages` (messages in rooms)
- `notifications` (in-app notifications)
- `user_presence` (who's online, what they're editing)
- `mythology_collaborators` (users with access to a mythology)

---

## 🗄️ STEP 1: Database Schema Extension *(3-4 hours)*

Create migration: `supabase/migrations/004_collaboration.sql`

```sql
-- VERSION HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.version_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Reference (what was changed)
  entity_type TEXT NOT NULL CHECK (entity_type IN ('mythology', 'character', 'creature', 'story', 'location', 'map')),
  entity_id UUID NOT NULL,
  
  -- Version Info
  version_number INTEGER NOT NULL,
  snapshot_data JSONB NOT NULL, -- Full snapshot of entity at this version
  
  -- Change Metadata
  changed_by UUID REFERENCES public.profiles(id),
  change_summary TEXT, -- "Added backstory section" or "Updated appearance"
  change_type TEXT CHECK (change_type IN ('create', 'update', 'delete')) DEFAULT 'update',
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_version UNIQUE(entity_type, entity_id, version_number)
);

-- CHAT ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Room Info
  name TEXT NOT NULL,
  room_type TEXT CHECK (room_type IN ('mythology', 'crossover', 'general', 'direct')) DEFAULT 'general',
  related_entity_id UUID, -- mythology_id or crossover_id
  
  -- Participants
  created_by UUID REFERENCES public.profiles(id),
  
  -- Metadata
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- CHAT ROOM PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS public.chat_room_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Status
  joined_at TIMESTAMP DEFAULT NOW(),
  last_read_at TIMESTAMP DEFAULT NOW(),
  is_muted BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT unique_participant UNIQUE(room_id, user_id)
);

-- CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  
  -- Message Content
  sender_id UUID REFERENCES public.profiles(id),
  message_text TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('text', 'system', 'image', 'file')) DEFAULT 'text',
  
  -- Attachments
  attachment_url TEXT,
  
  -- Metadata
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Notification Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- 'badge_earned', 'level_up', 'collaboration_invite', 'chat_message', etc.
  
  -- Action
  action_url TEXT, -- Link to relevant page
  action_data JSONB, -- Additional data for notification
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- USER PRESENCE TABLE
CREATE TABLE IF NOT EXISTS public.user_presence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  
  -- Presence Info
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP DEFAULT NOW(),
  current_page TEXT, -- Current route/page
  editing_entity_type TEXT, -- 'character', 'story', etc.
  editing_entity_id UUID, -- ID of entity being edited
  
  updated_at TIMESTAMP DEFAULT NOW()
);

-- MYTHOLOGY COLLABORATORS TABLE
CREATE TABLE IF NOT EXISTS public.mythology_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Permissions
  role TEXT CHECK (role IN ('owner', 'editor', 'viewer')) DEFAULT 'viewer',
  can_edit_characters BOOLEAN DEFAULT FALSE,
  can_edit_stories BOOLEAN DEFAULT FALSE,
  can_invite_others BOOLEAN DEFAULT FALSE,
  
  -- Status
  invited_by UUID REFERENCES public.profiles(id),
  invited_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP,
  status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  
  CONSTRAINT unique_collaborator UNIQUE(mythology_id, user_id)
);

-- CROSSOVER COLLABORATIONS TABLE (extend from Phase 2)
ALTER TABLE public.crossover_collaborations 
  ADD COLUMN IF NOT EXISTS chat_room_id UUID REFERENCES public.chat_rooms(id),
  ADD COLUMN IF NOT EXISTS shared_document_id UUID; -- Yjs document ID

-- ROW LEVEL SECURITY
ALTER TABLE public.version_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mythology_collaborators ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view version history for their entities" ON public.version_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.mythologies m
      WHERE m.id = entity_id AND m.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can view rooms they're in" ON public.chat_rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_room_participants p
      WHERE p.room_id = id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view messages in their rooms" ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_room_participants p
      WHERE p.room_id = room_id AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their rooms" ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_room_participants p
      WHERE p.room_id = room_id AND p.user_id = auth.uid()
    ) AND sender_id = auth.uid()
  );

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_version_history_entity ON public.version_history(entity_type, entity_id);
CREATE INDEX idx_chat_messages_room ON public.chat_messages(room_id, created_at DESC);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_user_presence_online ON public.user_presence(is_online, last_seen);

-- SUPABASE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
```

**Actions:**
- [ ] Run migration in Supabase
- [ ] Enable Realtime for chat_messages, user_presence, notifications tables
- [ ] Regenerate TypeScript types

---

## ⚡ STEP 2: Yjs + Supabase Real-Time Setup *(8-10 hours)*

### **A) Install Dependencies** *(1 hour)*

```bash
npm install yjs y-websocket y-protocols lib0
npm install @supabase/realtime-js
```

### **B) Yjs Document Provider** *(4-5 hours)*

Create custom Yjs provider using Supabase real-time:

```typescript
// src/lib/collaboration/YjsSupabaseProvider.ts
import * as Y from 'yjs';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export class YjsSupabaseProvider {
  doc: Y.Doc;
  channel: RealtimeChannel;
  documentId: string;
  userId: string;
  awareness: Map<string, any>;

  constructor(documentId: string, doc: Y.Doc, userId: string) {
    this.doc = doc;
    this.documentId = documentId;
    this.userId = userId;
    this.awareness = new Map();

    // Subscribe to Supabase channel for this document
    this.channel = supabase.channel(`yjs:${documentId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: userId },
      },
    });

    // Handle incoming updates
    this.channel
      .on('broadcast', { event: 'yjs-update' }, ({ payload }) => {
        if (payload.userId !== this.userId) {
          Y.applyUpdate(this.doc, new Uint8Array(payload.update));
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = this.channel.presenceState();
        this.awareness.clear();
        Object.entries(state).forEach(([key, value]) => {
          this.awareness.set(key, value[0]);
        });
      })
      .subscribe();

    // Send local updates to other clients
    this.doc.on('update', (update: Uint8Array, origin: any) => {
      if (origin !== this) {
        this.channel.send({
          type: 'broadcast',
          event: 'yjs-update',
          payload: {
            update: Array.from(update),
            userId: this.userId,
          },
        });
      }
    });

    // Load initial document state from database
    this.loadInitialState();
  }

  async loadInitialState() {
    const { data, error } = await supabase
      .from('yjs_documents')
      .select('state')
      .eq('id', this.documentId)
      .single();

    if (data?.state) {
      Y.applyUpdate(this.doc, new Uint8Array(data.state));
    }
  }

  async saveState() {
    const state = Y.encodeStateAsUpdate(this.doc);
    await supabase
      .from('yjs_documents')
      .upsert({
        id: this.documentId,
        state: Array.from(state),
        updated_at: new Date().toISOString(),
      });
  }

  updatePresence(data: any) {
    this.channel.track({
      userId: this.userId,
      ...data,
    });
  }

  destroy() {
    this.channel.unsubscribe();
    this.doc.destroy();
  }
}
```

**Database Table for Yjs State:**

```sql
-- Add to migration
CREATE TABLE IF NOT EXISTS public.yjs_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  state BYTEA, -- Yjs document state as binary
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_yjs_doc UNIQUE(entity_type, entity_id)
);
```

### **C) Collaborative Story Editor** *(4-5 hours)*

Integrate Yjs with TipTap:

```typescript
// src/components/collaboration/CollaborativeStoryEditor.tsx
'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { YjsSupabaseProvider } from '@/lib/collaboration/YjsSupabaseProvider';

export function CollaborativeStoryEditor({ storyId, userId, userName }: {
  storyId: string,
  userId: string,
  userName: string
}) {
  const [provider, setProvider] = useState<YjsSupabaseProvider | null>(null);
  const [collaborators, setCollaborators] = useState<any[]>([]);

  useEffect(() => {
    // Initialize Yjs document
    const ydoc = new Y.Doc();
    const yjsProvider = new YjsSupabaseProvider(`story-${storyId}`, ydoc, userId);

    setProvider(yjsProvider);

    // Auto-save every 2 minutes
    const saveInterval = setInterval(() => {
      yjsProvider.saveState();
      createVersionSnapshot(storyId, ydoc);
    }, 2 * 60 * 1000); // 2 minutes

    // Track presence
    yjsProvider.awareness.forEach((user: any) => {
      setCollaborators(prev => [...prev, user]);
    });

    return () => {
      clearInterval(saveInterval);
      yjsProvider.destroy();
    };
  }, [storyId, userId]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Disable default history (Yjs handles this)
      }),
      Collaboration.configure({
        document: provider?.doc,
      }),
      CollaborationCursor.configure({
        provider: provider as any,
        user: {
          name: userName,
          color: getRandomColor(),
        },
      }),
    ],
    content: '',
  });

  useEffect(() => {
    if (editor && provider) {
      // Update presence when cursor moves
      editor.on('selectionUpdate', ({ editor }) => {
        const { from, to } = editor.state.selection;
        provider.updatePresence({
          name: userName,
          cursor: { from, to },
        });
      });
    }
  }, [editor, provider]);

  if (!editor) return <div>Loading editor...</div>;

  return (
    <div>
      {/* Collaborator List */}
      {collaborators.length > 1 && (
        <div className="flex gap-2 mb-4 p-2 bg-blue-50 rounded">
          <span className="font-semibold">Currently editing:</span>
          {collaborators.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              {c.name}
            </span>
          ))}
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} className="prose max-w-none" />

      {/* Auto-save indicator */}
      <div className="text-xs text-gray-500 mt-2">
        Auto-saves every 2 minutes
      </div>
    </div>
  );
}

function getRandomColor() {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
  return colors[Math.floor(Math.random() * colors.length)];
}

async function createVersionSnapshot(storyId: string, ydoc: Y.Doc) {
  const state = Y.encodeStateAsUpdate(ydoc);
  const content = ydoc.toJSON();

  // Get current version count
  const { count } = await supabase
    .from('version_history')
    .select('version_number', { count: 'exact' })
    .eq('entity_type', 'story')
    .eq('entity_id', storyId);

  const versionNumber = (count || 0) + 1;

  // Save version snapshot
  await supabase
    .from('version_history')
    .insert({
      entity_type: 'story',
      entity_id: storyId,
      version_number: versionNumber,
      snapshot_data: content,
      changed_by: userId,
      change_summary: 'Auto-save',
    });

  // Keep only last 5 versions
  if (versionNumber > 5) {
    await supabase
      .from('version_history')
      .delete()
      .eq('entity_type', 'story')
      .eq('entity_id', storyId)
      .lt('version_number', versionNumber - 5);
  }
}
```

---

## 💬 STEP 3: Group Chat System *(10-12 hours)*

### **A) Chat Room Creation** *(3-4 hours)*

```typescript
// src/lib/chat/createChatRoom.ts
import { supabase } from '@/lib/supabase/client';

export async function createChatRoom({
  name,
  roomType,
  relatedEntityId,
  participantIds,
  createdBy,
}: {
  name: string,
  roomType: 'mythology' | 'crossover' | 'general' | 'direct',
  relatedEntityId?: string,
  participantIds: string[],
  createdBy: string,
}) {
  // Create room
  const { data: room, error } = await supabase
    .from('chat_rooms')
    .insert({
      name,
      room_type: roomType,
      related_entity_id: relatedEntityId,
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) throw error;

  // Add participants
  const participants = participantIds.map(userId => ({
    room_id: room.id,
    user_id: userId,
  }));

  await supabase
    .from('chat_room_participants')
    .insert(participants);

  return room;
}

// Auto-create chat room for crossover collaborations
export async function createCrossoverChatRoom(crossoverId: string, userIds: string[]) {
  const { data: crossover } = await supabase
    .from('crossover_collaborations')
    .select('*, mythology1:mythologies!mythology1_id(name), mythology2:mythologies!mythology2_id(name)')
    .eq('id', crossoverId)
    .single();

  const roomName = `${crossover.mythology1.name} × ${crossover.mythology2.name}`;

  const room = await createChatRoom({
    name: roomName,
    roomType: 'crossover',
    relatedEntityId: crossoverId,
    participantIds: userIds,
    createdBy: userIds[0],
  });

  // Link chat room to crossover
  await supabase
    .from('crossover_collaborations')
    .update({ chat_room_id: room.id })
    .eq('id', crossoverId);

  return room;
}
```

### **B) Real-Time Chat Component** *(5-6 hours)*

```typescript
// src/components/chat/ChatRoom.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export function ChatRoom({ roomId, userId }: { roomId: string, userId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    loadMessages();
    subscribeToMessages();
    updateLastRead();

    return () => {
      channelRef.current?.unsubscribe();
    };
  }, [roomId]);

  async function loadMessages() {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*, sender:profiles(display_name, avatar_url)')
      .eq('room_id', roomId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
      .limit(50);

    if (data) setMessages(data);
  }

  function subscribeToMessages() {
    const channel = supabase
      .channel(`chat:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          // Fetch sender info
          const { data: sender } = await supabase
            .from('profiles')
            .select('display_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          setMessages(prev => [...prev, { ...payload.new, sender }]);
          scrollToBottom();
        }
      )
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.userId !== userId) {
          setIsTyping(prev => {
            if (payload.isTyping && !prev.includes(payload.userName)) {
              return [...prev, payload.userName];
            } else if (!payload.isTyping) {
              return prev.filter(name => name !== payload.userName);
            }
            return prev;
          });
        }
      })
      .subscribe();

    channelRef.current = channel;
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        sender_id: userId,
        message_text: newMessage,
        message_type: 'text',
      });

    if (!error) {
      setNewMessage('');
      broadcastTyping(false);
    }
  }

  function broadcastTyping(isTyping: boolean) {
    channelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId, userName: 'You', isTyping },
    });
  }

  async function updateLastRead() {
    await supabase
      .from('chat_room_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('room_id', roomId)
      .eq('user_id', userId);
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.sender_id === userId ? 'flex-row-reverse' : ''}`}
          >
            <img
              src={msg.sender.avatar_url}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div className={`max-w-xs ${msg.sender_id === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg p-3`}>
              <div className="text-xs font-semibold mb-1">{msg.sender.display_name}</div>
              <div>{msg.message_text}</div>
              <div className="text-xs opacity-70 mt-1">
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {isTyping.length > 0 && (
        <div className="px-4 py-2 text-sm text-gray-600">
          {isTyping.join(', ')} {isTyping.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              broadcastTyping(true);
            }}
            onBlur={() => broadcastTyping(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
```

### **C) Chat Sidebar** *(2-3 hours)*

```typescript
// src/components/chat/ChatSidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function ChatSidebar({ userId, onSelectRoom }: {
  userId: string,
  onSelectRoom: (roomId: string) => void
}) {
  const [rooms, setRooms] = useState<any[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    loadRooms();
    subscribeToRoomUpdates();
  }, []);

  async function loadRooms() {
    const { data } = await supabase
      .from('chat_room_participants')
      .select(`
        *,
        room:chat_rooms(*),
        unread:chat_messages(count)
      `)
      .eq('user_id', userId)
      .order('room.updated_at', { ascending: false });

    if (data) {
      setRooms(data);
      
      // Calculate unread counts
      const counts: Record<string, number> = {};
      for (const participant of data) {
        const { count } = await supabase
          .from('chat_messages')
          .select('id', { count: 'exact' })
          .eq('room_id', participant.room_id)
          .gt('created_at', participant.last_read_at);
        
        counts[participant.room_id] = count || 0;
      }
      setUnreadCounts(counts);
    }
  }

  function subscribeToRoomUpdates() {
    supabase
      .channel('chat-rooms-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        () => {
          loadRooms(); // Reload to update unread counts
        }
      )
      .subscribe();
  }

  return (
    <div className="w-64 border-r h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Chats</h2>
      </div>

      <div className="divide-y">
        {rooms.map(({ room, room_id }) => (
          <button
            key={room_id}
            onClick={() => onSelectRoom(room_id)}
            className="w-full p-4 text-left hover:bg-gray-50 relative"
          >
            <div className="font-semibold">{room.name}</div>
            <div className="text-sm text-gray-600">{room.room_type}</div>
            
            {unreadCounts[room_id] > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCounts[room_id]}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 📜 STEP 4: Version History Viewer *(6-8 hours)*

```typescript
// src/components/collaboration/VersionHistory.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function VersionHistory({ entityType, entityId }: {
  entityType: string,
  entityId: string
}) {
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<any | null>(null);
  const [currentVersion, setCurrentVersion] = useState<any | null>(null);

  useEffect(() => {
    loadVersions();
    loadCurrentVersion();
  }, [entityId]);

  async function loadVersions() {
    const { data } = await supabase
      .from('version_history')
      .select('*, changer:profiles(display_name)')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('version_number', { ascending: false });

    if (data) setVersions(data);
  }

  async function loadCurrentVersion() {
    // Load current entity state
    const { data } = await supabase
      .from(entityType + 's') // e.g., 'characters', 'stories'
      .select('*')
      .eq('id', entityId)
      .single();

    if (data) setCurrentVersion(data);
  }

  async function restoreVersion(versionId: string) {
    const version = versions.find(v => v.id === versionId);
    if (!version) return;

    // Restore snapshot data to current entity
    const { error } = await supabase
      .from(entityType + 's')
      .update(version.snapshot_data)
      .eq('id', entityId);

    if (!error) {
      alert('Version restored successfully!');
      loadCurrentVersion();
    }
  }

  return (
    <div className="flex gap-4 h-full">
      {/* Version List */}
      <div className="w-64 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Version History</h3>
          <p className="text-sm text-gray-600">{versions.length} versions</p>
        </div>

        <div className="divide-y">
          {versions.map((version) => (
            <button
              key={version.id}
              onClick={() => setSelectedVersion(version)}
              className={`w-full p-3 text-left hover:bg-gray-50 ${
                selectedVersion?.id === version.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="font-semibold text-sm">
                Version {version.version_number}
              </div>
              <div className="text-xs text-gray-600">
                {new Date(version.created_at).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                by {version.changer.display_name}
              </div>
              {version.change_summary && (
                <div className="text-xs text-gray-700 mt-1">
                  {version.change_summary}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Version Comparison */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedVersion ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                Version {selectedVersion.version_number}
              </h2>
              <button
                onClick={() => restoreVersion(selectedVersion.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Restore This Version
              </button>
            </div>

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 text-gray-600">
                  Version {selectedVersion.version_number}
                </h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(selectedVersion.snapshot_data, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-gray-600">Current Version</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(currentVersion, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a version to view details
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🔔 STEP 5: Notification System *(8-10 hours)*

### **A) Create Notifications** *(3-4 hours)*

```typescript
// src/lib/notifications/createNotification.ts
import { supabase } from '@/lib/supabase/client';

export async function createNotification({
  userId,
  title,
  message,
  notificationType,
  actionUrl,
  actionData,
}: {
  userId: string,
  title: string,
  message: string,
  notificationType: string,
  actionUrl?: string,
  actionData?: any,
}) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      notification_type: notificationType,
      action_url: actionUrl,
      action_data: actionData,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Notification triggers
export async function notifyBadgeEarned(userId: string, badgeName: string) {
  await createNotification({
    userId,
    title: 'Badge Earned! 🏆',
    message: `You earned the "${badgeName}" badge!`,
    notificationType: 'badge_earned',
    actionUrl: '/student/badges',
  });
}

export async function notifyLevelUp(userId: string, newLevel: number) {
  await createNotification({
    userId,
    title: 'Level Up! ⬆️',
    message: `Congratulations! You reached Level ${newLevel}!`,
    notificationType: 'level_up',
    actionUrl: '/student/progress',
  });
}

export async function notifyCollaborationInvite(userId: string, inviterName: string, mythologyName: string, mythologyId: string) {
  await createNotification({
    userId,
    title: 'Collaboration Invite 🤝',
    message: `${inviterName} invited you to collaborate on "${mythologyName}"`,
    notificationType: 'collaboration_invite',
    actionUrl: `/mythology/${mythologyId}/collab-invite`,
  });
}

export async function notifyChatMessage(userId: string, senderName: string, roomName: string, roomId: string) {
  await createNotification({
    userId,
    title: `New message from ${senderName}`,
    message: `In ${roomName}`,
    notificationType: 'chat_message',
    actionUrl: `/chat/${roomId}`,
  });
}
```

### **B) Notification Center UI** *(5-6 hours)*

```typescript
// src/components/notifications/NotificationCenter.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export function NotificationCenter({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
    subscribeToNotifications();
  }, []);

  async function loadNotifications() {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  }

  function subscribeToNotifications() {
    supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();
  }

  async function markAsRead(notificationId: string) {
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', notificationId);

    loadNotifications();
  }

  async function markAllAsRead() {
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false);

    loadNotifications();
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-500 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={notification.action_url || '#'}
                  onClick={() => {
                    markAsRead(notification.id);
                    setIsOpen(false);
                  }}
                  className={`block p-4 hover:bg-gray-50 ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="font-semibold text-sm">{notification.title}</div>
                  <div className="text-sm text-gray-600 mt-1">{notification.message}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(notification.created_at).toLocaleString()}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 👥 STEP 6: Mythology Collaboration Invites *(6-8 hours)*

```typescript
// src/components/collaboration/CollaborationManager.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { notifyCollaborationInvite } from '@/lib/notifications/createNotification';

export function CollaborationManager({ mythologyId, ownerId }: {
  mythologyId: string,
  ownerId: string
}) {
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    loadCollaborators();
  }, []);

  async function loadCollaborators() {
    const { data } = await supabase
      .from('mythology_collaborators')
      .select('*, user:profiles(display_name, avatar_url)')
      .eq('mythology_id', mythologyId);

    if (data) setCollaborators(data);
  }

  async function inviteCollaborator() {
    // Find user by email
    const { data: user } = await supabase
      .from('profiles')
      .select('id, display_name')
      .eq('email', inviteEmail)
      .single();

    if (!user) {
      alert('User not found');
      return;
    }

    // Create invitation
    const { error } = await supabase
      .from('mythology_collaborators')
      .insert({
        mythology_id: mythologyId,
        user_id: user.id,
        invited_by: ownerId,
        role: 'editor',
        can_edit_characters: true,
        can_edit_stories: true,
        status: 'pending',
      });

    if (!error) {
      // Send notification
      const { data: mythology } = await supabase
        .from('mythologies')
        .select('name')
        .eq('id', mythologyId)
        .single();

      await notifyCollaborationInvite(
        user.id,
        'You', // Replace with current user's name
        mythology.name,
        mythologyId
      );

      setInviteEmail('');
      loadCollaborators();
      alert('Invitation sent!');
    }
  }

  async function removeCollaborator(collaboratorId: string) {
    await supabase
      .from('mythology_collaborators')
      .delete()
      .eq('id', collaboratorId);

    loadCollaborators();
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Collaborators</h2>

      {/* Invite Form */}
      <div className="mb-8">
        <label className="block font-semibold mb-2">Invite by Email</label>
        <div className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="student@example.com"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={inviteCollaborator}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send Invite
          </button>
        </div>
      </div>

      {/* Collaborator List */}
      <div>
        <h3 className="font-semibold mb-4">Current Collaborators ({collaborators.length})</h3>
        <div className="space-y-3">
          {collaborators.map((collab) => (
            <div key={collab.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <img src={collab.user.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-semibold">{collab.user.display_name}</div>
                  <div className="text-sm text-gray-600">
                    {collab.role} • {collab.status}
                  </div>
                </div>
              </div>

              {collab.user_id !== ownerId && (
                <button
                  onClick={() => removeCollaborator(collab.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 STEP 7: Testing & Deployment *(6-8 hours)*

**Testing:**
- [ ] Test Yjs collaborative editing (2 users edit same story)
- [ ] Test version history (create versions, restore old version)
- [ ] Test chat system (send messages, typing indicators, unread counts)
- [ ] Test notifications (badge earned, level up, chat message, collaboration invite)
- [ ] Test presence indicators (show who's online, what they're editing)
- [ ] Test collaboration invites (send invite, accept/decline, permissions)
- [ ] Test auto-save (verify saves every 2 minutes)

**Performance:**
- [ ] Optimize Supabase real-time subscriptions (don't create too many channels)
- [ ] Add pagination to chat messages (load 50 at a time, infinite scroll)
- [ ] Cache version history locally
- [ ] Debounce typing indicators

**Deploy:**
- [ ] Run migration on production
- [ ] Enable Supabase real-time for new tables
- [ ] Test in production with 2-3 users
- [ ] Monitor performance

**PHASE 4 DELIVERABLE:**
✅ Real-time co-editing with Yjs + Supabase (multiple users edit same story)
✅ Version history (auto-save every 2 min, keep 5 backups, restore old versions)
✅ Group chat system (real-time messaging, typing indicators, unread counts)
✅ Notifications (badge earned, level up, chat message, collaboration invite)
✅ Presence indicators (who's online, what they're editing)
✅ Collaboration invites (invite by email, manage permissions, accept/decline)
✅ Mythology merging/forking (Phase 5 expansion)

**TIME ESTIMATE:** 50-60 hours (3-4 weeks part-time)

---

*Phase 4 detailed. Proceeding to Phase 5...* 🕶️

---

---

# 🤖 PHASE 5: AI ENHANCEMENTS

## Duration: Weeks 15-17 (~40-50 hours)

---

## 🎯 PHASE 5 GOAL

**Build advanced AI image generation system:** DALL-E 3 + Midjourney integration, prompting intelligence, character data examination, and style modifiers.

**Features to Build:**
1. Image generation system (DALL-E 3 + Midjourney)
2. AI prompting intelligence (simple input → detailed prompt)
3. Character data examination (auto-generate prompts from character descriptions)
4. Prompt templates & editing
5. Style modifiers (photorealistic, anime, oil painting, etc.)
6. Mythology-specific aesthetics (Greek marble, Norse woodcut, etc.)
7. Geography integration (arctic → cold lighting, desert → warm tones)
8. Age-appropriate guardrails (content filtering, nudity detection)
9. Image editing & versioning
10. AI story assistance enhancements

---

## 📋 PHASE 5 PREREQUISITES

**Must be completed from Phase 1-4:**
- ✅ Character/creature creation working
- ✅ Story system with TipTap editor
- ✅ Image upload to Supabase Storage
- ✅ OpenAI moderation system

**New Database Tables Needed:**
- `image_generations` (track all AI image generations)
- `image_prompts` (save prompts for re-use/editing)
- `style_presets` (predefined style combinations)

---

## 🗄️ STEP 1: Database Schema Extension *(2-3 hours)*

Create migration: `supabase/migrations/005_ai_enhancements.sql`

```sql
-- IMAGE GENERATIONS TABLE
CREATE TABLE IF NOT EXISTS public.image_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Associated Entity
  entity_type TEXT CHECK (entity_type IN ('character', 'creature', 'location', 'story', 'standalone')),
  entity_id UUID, -- ID of character/creature/etc.
  
  -- Generation Details
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  service TEXT CHECK (service IN ('dalle3', 'midjourney')) NOT NULL,
  
  -- Prompt
  user_input TEXT NOT NULL, -- Original simple input
  enhanced_prompt TEXT NOT NULL, -- AI-enhanced detailed prompt
  style_modifiers JSONB, -- {style: 'anime', aesthetic: 'norse', mood: 'dramatic'}
  
  -- Result
  generated_url TEXT, -- URL of generated image
  is_primary BOOLEAN DEFAULT FALSE, -- Is this the primary image for this entity?
  
  -- Metadata
  generation_cost FLOAT, -- Cost in credits/dollars
  generation_time INTEGER, -- Time in seconds
  service_metadata JSONB, -- Service-specific data (Midjourney job ID, DALL-E revised prompt, etc.)
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- IMAGE PROMPTS TABLE (Saved/Reusable Prompts)
CREATE TABLE IF NOT EXISTS public.image_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Prompt Info
  name TEXT NOT NULL,
  description TEXT,
  template_text TEXT NOT NULL, -- Prompt template with {character_name}, {powers}, etc. placeholders
  
  -- Categorization
  category TEXT CHECK (category IN ('character', 'creature', 'location', 'scene', 'general')),
  tags TEXT[], -- ['fantasy', 'portrait', 'action', etc.]
  
  -- Usage
  is_public BOOLEAN DEFAULT FALSE, -- Share with other students
  use_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- STYLE PRESETS TABLE (Predefined Style Combinations)
CREATE TABLE IF NOT EXISTS public.style_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Preset Info
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  preview_url TEXT, -- Example image showing this style
  
  -- Style Configuration
  style_config JSONB NOT NULL, -- {style: 'anime', aesthetic: 'cyberpunk', mood: 'vibrant', medium: 'digital art'}
  
  -- Prompt Modifiers
  prompt_prefix TEXT, -- Added before main prompt
  prompt_suffix TEXT, -- Added after main prompt
  
  -- Categorization
  category TEXT, -- 'fantasy', 'realistic', 'stylized', 'historic', etc.
  mythology_themes TEXT[], -- ['greek', 'norse', 'cyberpunk', etc.]
  
  -- Metadata
  is_default BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ROW LEVEL SECURITY
ALTER TABLE public.image_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.style_presets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own image generations" ON public.image_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own image generations" ON public.image_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own prompts" ON public.image_prompts FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can manage own prompts" ON public.image_prompts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view style presets" ON public.style_presets FOR SELECT
  USING (true);

-- INDEXES
CREATE INDEX idx_image_generations_entity ON public.image_generations(entity_type, entity_id);
CREATE INDEX idx_image_generations_user ON public.image_generations(user_id, created_at DESC);
CREATE INDEX idx_image_prompts_public ON public.image_prompts(is_public, category);
```

**Actions:**
- [ ] Run migration in Supabase
- [ ] Regenerate TypeScript types

---

## 🎨 STEP 2: AI Prompting Intelligence Engine *(10-12 hours)*

### **A) Prompt Enhancement Function** *(5-6 hours)*

```typescript
// src/lib/ai/promptEnhancer.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function enhancePrompt({
  userInput,
  characterData,
  styleModifiers,
  mythologyTheme,
  geography,
}: {
  userInput: string,
  characterData?: any, // Character object with name, appearance, powers, etc.
  styleModifiers?: {
    style?: string, // 'photorealistic', 'anime', 'oil painting', etc.
    aesthetic?: string, // 'greek', 'norse', 'cyberpunk', etc.
    mood?: string, // 'dramatic', 'peaceful', 'action-packed', etc.
    medium?: string, // 'digital art', 'watercolor', 'charcoal', etc.
  },
  mythologyTheme?: string,
  geography?: string,
}): Promise<string> {
  
  // Build context for GPT-4
  let context = `You are a professional prompt engineer for AI image generation. Convert the user's simple input into a detailed, vivid image generation prompt.`;
  
  if (characterData) {
    context += `\n\nCHARACTER DETAILS:`;
    context += `\n- Name: ${characterData.name}`;
    context += `\n- Type: ${characterData.character_type}`;
    context += `\n- Appearance: ${characterData.appearance || 'Not specified'}`;
    context += `\n- Powers: ${characterData.powers || 'Not specified'}`;
    context += `\n- Personality: ${characterData.personality || 'Not specified'}`;
    context += `\n- Domain: ${characterData.domain || 'Not specified'}`;
  }
  
  if (styleModifiers) {
    context += `\n\nSTYLE REQUIREMENTS:`;
    if (styleModifiers.style) context += `\n- Art Style: ${styleModifiers.style}`;
    if (styleModifiers.aesthetic) context += `\n- Aesthetic: ${styleModifiers.aesthetic}`;
    if (styleModifiers.mood) context += `\n- Mood: ${styleModifiers.mood}`;
    if (styleModifiers.medium) context += `\n- Medium: ${styleModifiers.medium}`;
  }
  
  if (mythologyTheme) {
    context += `\n\nMYTHOLOGY THEME: ${mythologyTheme}`;
    context += `\nIncorporate visual elements characteristic of ${mythologyTheme} mythology (e.g., Greek: marble columns, laurel wreaths; Norse: runes, knotwork; Cyberpunk: neon, tech, circuits).`;
  }
  
  if (geography) {
    context += `\n\nGEOGRAPHY: ${geography}`;
    context += `\nAdjust lighting, colors, and environment to match this geography.`;
  }
  
  context += `\n\nAGE-APPROPRIATE GUIDELINES:`;
  context += `\n- NO nudity, suggestive content, or mature themes`;
  context += `\n- NO violence, gore, or disturbing imagery`;
  context += `\n- Ensure content is appropriate for middle school students (ages 11-14)`;
  
  context += `\n\nUSER INPUT: "${userInput}"`;
  
  context += `\n\nGenerate a detailed image prompt (150-200 words) that includes:`;
  context += `\n1. Main subject description (appearance, pose, expression)`;
  context += `\n2. Background/environment details`;
  context += `\n3. Lighting and atmosphere`;
  context += `\n4. Artistic style and composition`;
  context += `\n5. Any relevant mythology-specific visual elements`;
  context += `\n\nProvide ONLY the final image prompt, no explanations.`;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: context },
      { role: 'user', content: userInput },
    ],
    temperature: 0.8,
    max_tokens: 400,
  });
  
  return response.choices[0].message.content || userInput;
}
```

### **B) Character Data Examiner** *(3-4 hours)*

Auto-generate image prompts from character descriptions:

```typescript
// src/lib/ai/characterPromptGenerator.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateCharacterImagePrompt(character: any): Promise<string> {
  const prompt = `Based on this character's details, generate a vivid image generation prompt:

NAME: ${character.name}
TYPE: ${character.character_type}
APPEARANCE: ${character.appearance || 'Not specified'}
POWERS: ${character.powers || 'Not specified'}
PERSONALITY: ${character.personality || 'Not specified'}
DOMAIN: ${character.domain || 'Not specified'}
BACKSTORY: ${character.backstory?.slice(0, 300) || 'Not specified'}

Generate a detailed image prompt (150-200 words) for an AI image generator that captures this character's essence. Include:
1. Physical appearance (face, body, clothing, accessories)
2. Pose and expression that reflect personality
3. Background/environment that matches their domain
4. Visual effects for their powers
5. Mood and lighting
6. Art style suggestion

Keep content age-appropriate (middle school, no mature themes).
Provide ONLY the final prompt, no explanations.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.8,
    max_tokens: 400,
  });
  
  return response.choices[0].message.content || '';
}
```

### **C) Prompt Templates** *(2-3 hours)*

```typescript
// src/lib/ai/promptTemplates.ts

export const promptTemplates = {
  character_portrait: `A {style} portrait of {character_name}, a {character_type} with {powers}. 
Appearance: {appearance}. 
Personality: {personality}. 
Background: {domain}-themed environment. 
Mood: {mood}. 
Lighting: {lighting}. 
Art style: {aesthetic}.`,

  character_action: `{character_name}, a {character_type}, in the middle of using their {powers}. 
Dynamic action pose, {mood} atmosphere. 
{appearance}. 
Environment: {domain}. 
Style: {style} {aesthetic}.`,

  creature_portrait: `A {style} depiction of {creature_name}, a {creature_type} creature. 
Features: {appearance}. 
Abilities: {powers}. 
Habitat: {habitat}. 
Mood: {mood}. 
Art style: {aesthetic}.`,

  location_landscape: `A {style} landscape of {location_name}, a {location_type} location. 
Features: {features}. 
Climate: {climate}. 
Mood: {mood}. 
Time of day: {time_of_day}. 
Art style: {aesthetic}.`,

  battle_scene: `An epic battle scene between {character1_name} and {character2_name}. 
{character1_name}: {character1_appearance}, using {character1_powers}. 
{character2_name}: {character2_appearance}, using {character2_powers}. 
Environment: {location}. 
Mood: {mood}. 
Style: {style} {aesthetic}.`,
};

export function fillTemplate(template: string, data: Record<string, string>): string {
  let filled = template;
  
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{${key}}`;
    filled = filled.replace(new RegExp(placeholder, 'g'), value || 'unspecified');
  });
  
  return filled;
}
```

---

## 🖼️ STEP 3: DALL-E 3 Integration *(8-10 hours)*

### **A) DALL-E 3 Generation Function** *(4-5 hours)*

```typescript
// src/lib/ai/dalle3.ts
import OpenAI from 'openai';
import { supabase } from '@/lib/supabase/client';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateWithDALLE3({
  prompt,
  size = '1024x1024',
  quality = 'standard',
  userId,
  entityType,
  entityId,
}: {
  prompt: string,
  size?: '1024x1024' | '1792x1024' | '1024x1792',
  quality?: 'standard' | 'hd',
  userId: string,
  entityType?: string,
  entityId?: string,
}): Promise<{ imageUrl: string, revisedPrompt: string, generationId: string }> {
  
  // Content moderation check
  const moderationResult = await openai.moderations.create({ input: prompt });
  const flagged = moderationResult.results[0].flagged;
  
  if (flagged) {
    throw new Error('Prompt contains inappropriate content and cannot be processed.');
  }
  
  // Generate image with DALL-E 3
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: size,
    quality: quality,
    response_format: 'url',
  });
  
  const imageUrl = response.data[0].url;
  const revisedPrompt = response.data[0].revised_prompt || prompt;
  
  // Download image and upload to Supabase Storage
  const imageData = await fetch(imageUrl!).then(res => res.arrayBuffer());
  const fileName = `dalle3/${userId}/${Date.now()}.png`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, imageData, {
      contentType: 'image/png',
      cacheControl: '3600',
    });
  
  if (uploadError) throw uploadError;
  
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);
  
  // Save generation record
  const { data: generation, error: genError } = await supabase
    .from('image_generations')
    .insert({
      user_id: userId,
      entity_type: entityType || 'standalone',
      entity_id: entityId,
      service: 'dalle3',
      user_input: prompt,
      enhanced_prompt: revisedPrompt,
      generated_url: publicUrl,
      generation_cost: quality === 'hd' ? 0.08 : 0.04, // DALL-E 3 pricing
      service_metadata: {
        size,
        quality,
        original_dalle_url: imageUrl,
      },
    })
    .select()
    .single();
  
  if (genError) throw genError;
  
  return {
    imageUrl: publicUrl,
    revisedPrompt,
    generationId: generation.id,
  };
}
```

### **B) DALL-E 3 UI Component** *(4-5 hours)*

```typescript
// src/components/ai/DALLE3Generator.tsx
'use client';

import { useState } from 'react';
import { generateWithDALLE3 } from '@/lib/ai/dalle3';
import { enhancePrompt } from '@/lib/ai/promptEnhancer';

export function DALLE3Generator({ character, onImageGenerated }: {
  character?: any,
  onImageGenerated: (imageUrl: string) => void
}) {
  const [userInput, setUserInput] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [size, setSize] = useState<'1024x1024' | '1792x1024' | '1024x1792'>('1024x1024');
  const [quality, setQuality] = useState<'standard' | 'hd'>('standard');

  async function handleEnhance() {
    setIsGenerating(true);
    try {
      const enhanced = await enhancePrompt({
        userInput,
        characterData: character,
        styleModifiers: { style: 'digital art', aesthetic: 'fantasy' },
      });
      setEnhancedPrompt(enhanced);
    } catch (error) {
      alert('Error enhancing prompt: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const result = await generateWithDALLE3({
        prompt: enhancedPrompt || userInput,
        size,
        quality,
        userId: user.id,
        entityType: character ? 'character' : 'standalone',
        entityId: character?.id,
      });
      
      setGeneratedImage(result.imageUrl);
      onImageGenerated(result.imageUrl);
    } catch (error) {
      alert('Error generating image: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Generate Image with DALL-E 3</h2>

      {/* User Input */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Describe what you want to see:</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="e.g., A powerful goddess of storms standing on a cliff..."
          className="w-full px-3 py-2 border rounded h-24"
        />
      </div>

      {/* Enhance Button */}
      <button
        onClick={handleEnhance}
        disabled={!userInput || isGenerating}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 mb-4"
      >
        ✨ Enhance with AI
      </button>

      {/* Enhanced Prompt (editable) */}
      {enhancedPrompt && (
        <div className="mb-4">
          <label className="block font-semibold mb-2">Enhanced Prompt (you can edit this):</label>
          <textarea
            value={enhancedPrompt}
            onChange={(e) => setEnhancedPrompt(e.target.value)}
            className="w-full px-3 py-2 border rounded h-32 bg-blue-50"
          />
        </div>
      )}

      {/* Settings */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold mb-2">Size:</label>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as any)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="1024x1024">Square (1024x1024)</option>
            <option value="1792x1024">Landscape (1792x1024)</option>
            <option value="1024x1792">Portrait (1024x1792)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">Quality:</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value as any)}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="standard">Standard</option>
            <option value="hd">HD (Higher cost)</option>
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={(!userInput && !enhancedPrompt) || isGenerating}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-semibold"
      >
        {isGenerating ? 'Generating...' : '🎨 Generate Image'}
      </button>

      {/* Generated Image */}
      {generatedImage && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Generated Image:</h3>
          <img src={generatedImage} alt="Generated" className="rounded-lg shadow-lg max-w-full" />
          <button
            onClick={() => onImageGenerated(generatedImage)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Use This Image
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 🎭 STEP 4: Style Presets System *(6-8 hours)*

### **A) Seed Style Presets** *(2-3 hours)*

```typescript
// scripts/seedStylePresets.ts
import { supabase } from '@/lib/supabase/client';

const stylePresets = [
  {
    name: 'Greek Marble',
    description: 'Classic Greek mythology aesthetic with marble statues, columns, and golden accents',
    style_config: {
      style: 'classical art',
      aesthetic: 'ancient greek',
      mood: 'majestic',
      medium: 'marble sculpture',
    },
    prompt_prefix: 'In the style of classical Greek art, ',
    prompt_suffix: ', marble texture, golden accents, Parthenon columns in background, epic and majestic',
    category: 'historic',
    mythology_themes: ['greek', 'roman'],
  },
  {
    name: 'Norse Woodcut',
    description: 'Viking-inspired with runes, knotwork, and dramatic shadows',
    style_config: {
      style: 'woodcut engraving',
      aesthetic: 'norse viking',
      mood: 'dramatic',
      medium: 'woodcut print',
    },
    prompt_prefix: 'In the style of Norse woodcut engravings, ',
    prompt_suffix: ', intricate knotwork patterns, runes, Viking aesthetic, dramatic shadows, ancient Norse art',
    category: 'historic',
    mythology_themes: ['norse', 'viking'],
  },
  {
    name: 'Cyberpunk Neon',
    description: 'Futuristic with neon lights, circuits, and digital effects',
    style_config: {
      style: 'cyberpunk',
      aesthetic: 'futuristic tech',
      mood: 'vibrant',
      medium: 'digital art',
    },
    prompt_prefix: 'Cyberpunk style, ',
    prompt_suffix: ', neon lights (cyan and magenta), circuit patterns, holographic effects, futuristic cityscape, digital art',
    category: 'stylized',
    mythology_themes: ['cyberpunk', 'futuristic'],
  },
  {
    name: 'Anime Fantasy',
    description: 'Japanese anime style with vibrant colors and dynamic poses',
    style_config: {
      style: 'anime',
      aesthetic: 'japanese animation',
      mood: 'dynamic',
      medium: 'digital illustration',
    },
    prompt_prefix: 'Anime style, ',
    prompt_suffix: ', vibrant colors, dynamic pose, cel-shaded, Studio Ghibli inspired, fantasy anime aesthetic',
    category: 'stylized',
    mythology_themes: ['japanese', 'fantasy'],
  },
  {
    name: 'Egyptian Hieroglyphic',
    description: 'Ancient Egyptian art style with profile view and symbolic elements',
    style_config: {
      style: 'ancient egyptian',
      aesthetic: 'hieroglyphic art',
      mood: 'mystical',
      medium: 'papyrus painting',
    },
    prompt_prefix: 'Ancient Egyptian hieroglyphic style, ',
    prompt_suffix: ', profile view, symbolic elements, papyrus texture, gold and lapis lazuli colors, hieroglyphs',
    category: 'historic',
    mythology_themes: ['egyptian'],
  },
  {
    name: 'Photorealistic',
    description: 'Ultra-realistic with detailed textures and natural lighting',
    style_config: {
      style: 'photorealistic',
      aesthetic: 'cinematic',
      mood: 'dramatic',
      medium: 'photography',
    },
    prompt_prefix: 'Photorealistic, highly detailed, ',
    prompt_suffix: ', 8k resolution, cinematic lighting, realistic textures, professional photography',
    category: 'realistic',
    mythology_themes: [],
  },
  {
    name: 'Watercolor Fantasy',
    description: 'Soft watercolor painting with dreamy, flowing colors',
    style_config: {
      style: 'watercolor',
      aesthetic: 'fantasy illustration',
      mood: 'ethereal',
      medium: 'watercolor painting',
    },
    prompt_prefix: 'Watercolor painting, ',
    prompt_suffix: ', soft edges, flowing colors, dreamy atmosphere, fantasy illustration, delicate brush strokes',
    category: 'stylized',
    mythology_themes: ['fantasy'],
  },
  {
    name: 'Dark Gothic',
    description: 'Dark, moody aesthetic with gothic architecture and dramatic shadows',
    style_config: {
      style: 'gothic art',
      aesthetic: 'dark fantasy',
      mood: 'ominous',
      medium: 'digital painting',
    },
    prompt_prefix: 'Dark gothic style, ',
    prompt_suffix: ', gothic architecture, dramatic shadows, moody lighting, dark fantasy, ornate details',
    category: 'stylized',
    mythology_themes: ['dark', 'gothic'],
  },
  // ... (add 5-10 more presets)
];

async function seedStylePresets() {
  for (const preset of stylePresets) {
    await supabase.from('style_presets').insert(preset);
    console.log(`Seeded style preset: ${preset.name}`);
  }
}

seedStylePresets();
```

### **B) Style Preset Selector** *(4-5 hours)*

```typescript
// src/components/ai/StylePresetSelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export function StylePresetSelector({ onSelectPreset }: {
  onSelectPreset: (preset: any) => void
}) {
  const [presets, setPresets] = useState<any[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<any | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadPresets();
  }, [filter]);

  async function loadPresets() {
    let query = supabase
      .from('style_presets')
      .select('*')
      .order('sort_order');
    
    if (filter !== 'all') {
      query = query.eq('category', filter);
    }
    
    const { data } = await query;
    if (data) setPresets(data);
  }

  function handleSelect(preset: any) {
    setSelectedPreset(preset);
    onSelectPreset(preset);
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">Choose a Style Preset:</h3>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {['all', 'historic', 'stylized', 'realistic'].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-1 rounded ${
              filter === category ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Preset Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelect(preset)}
            className={`p-4 border-2 rounded-lg text-left hover:shadow-lg transition ${
              selectedPreset?.id === preset.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            {preset.preview_url && (
              <img
                src={preset.preview_url}
                alt={preset.name}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            <div className="font-semibold">{preset.name}</div>
            <div className="text-xs text-gray-600 mt-1">{preset.description}</div>
            {preset.mythology_themes?.length > 0 && (
              <div className="flex gap-1 mt-2">
                {preset.mythology_themes.map((theme: string) => (
                  <span key={theme} className="text-xs bg-purple-100 px-2 py-1 rounded">
                    {theme}
                  </span>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selected Preset Info */}
      {selectedPreset && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold mb-2">Selected: {selectedPreset.name}</h4>
          <p className="text-sm text-gray-700">{selectedPreset.description}</p>
          <div className="mt-2 text-xs text-gray-600">
            <div>Style: {selectedPreset.style_config.style}</div>
            <div>Aesthetic: {selectedPreset.style_config.aesthetic}</div>
            <div>Mood: {selectedPreset.style_config.mood}</div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 🚀 STEP 5: Midjourney Integration (Webhooks) *(8-10 hours)*

### **A) Midjourney Proxy Setup** *(4-5 hours)*

Since Midjourney doesn't have an official API, we'll use a proxy service or custom Discord bot:

```typescript
// src/lib/ai/midjourney.ts
import { supabase } from '@/lib/supabase/client';

// Using a Midjourney API proxy service (e.g., goapi.ai or similar)
const MIDJOURNEY_API_URL = process.env.MIDJOURNEY_API_URL;
const MIDJOURNEY_API_KEY = process.env.MIDJOURNEY_API_KEY;

export async function generateWithMidjourney({
  prompt,
  userId,
  entityType,
  entityId,
}: {
  prompt: string,
  userId: string,
  entityType?: string,
  entityId?: string,
}): Promise<{ jobId: string, generationId: string }> {
  
  // Submit generation job to Midjourney proxy
  const response = await fetch(`${MIDJOURNEY_API_URL}/imagine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${MIDJOURNEY_API_KEY}`,
    },
    body: JSON.stringify({ prompt }),
  });
  
  const result = await response.json();
  const jobId = result.task_id;
  
  // Save generation record (pending)
  const { data: generation } = await supabase
    .from('image_generations')
    .insert({
      user_id: userId,
      entity_type: entityType || 'standalone',
      entity_id: entityId,
      service: 'midjourney',
      user_input: prompt,
      enhanced_prompt: prompt,
      generation_cost: 0.10, // Estimated cost
      service_metadata: {
        job_id: jobId,
        status: 'pending',
      },
    })
    .select()
    .single();
  
  return {
    jobId,
    generationId: generation.id,
  };
}

export async function checkMidjourneyStatus(jobId: string): Promise<{
  status: 'pending' | 'completed' | 'failed',
  imageUrl?: string,
  progress?: number
}> {
  const response = await fetch(`${MIDJOURNEY_API_URL}/task/${jobId}`, {
    headers: {
      'Authorization': `Bearer ${MIDJOURNEY_API_KEY}`,
    },
  });
  
  const result = await response.json();
  
  return {
    status: result.status,
    imageUrl: result.image_url,
    progress: result.progress,
  };
}

// Webhook handler for Midjourney completion
export async function handleMidjourneyWebhook(jobId: string, imageUrl: string) {
  // Find generation record
  const { data: generation } = await supabase
    .from('image_generations')
    .select('*')
    .eq('service', 'midjourney')
    .filter('service_metadata->>job_id', 'eq', jobId)
    .single();
  
  if (!generation) return;
  
  // Download image and upload to Supabase Storage
  const imageData = await fetch(imageUrl).then(res => res.arrayBuffer());
  const fileName = `midjourney/${generation.user_id}/${Date.now()}.png`;
  
  const { data: uploadData } = await supabase.storage
    .from('images')
    .upload(fileName, imageData, {
      contentType: 'image/png',
      cacheControl: '3600',
    });
  
  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);
  
  // Update generation record
  await supabase
    .from('image_generations')
    .update({
      generated_url: publicUrl,
      service_metadata: {
        ...generation.service_metadata,
        status: 'completed',
        original_midjourney_url: imageUrl,
      },
    })
    .eq('id', generation.id);
  
  // Send notification to user
  await createNotification({
    userId: generation.user_id,
    title: 'Image Ready! 🎨',
    message: 'Your Midjourney image generation is complete',
    notificationType: 'image_generation_complete',
    actionUrl: `/image-generations/${generation.id}`,
  });
}
```

### **B) Midjourney UI Component** *(4-5 hours)*

```typescript
// src/components/ai/MidjourneyGenerator.tsx
'use client';

import { useState } from 'react';
import { generateWithMidjourney, checkMidjourneyStatus } from '@/lib/ai/midjourney';

export function MidjourneyGenerator({ character, onImageGenerated }: {
  character?: any,
  onImageGenerated: (imageUrl: string) => void
}) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  async function handleGenerate() {
    setIsGenerating(true);
    try {
      const result = await generateWithMidjourney({
        prompt,
        userId: user.id,
        entityType: character ? 'character' : 'standalone',
        entityId: character?.id,
      });
      
      setJobId(result.jobId);
      
      // Poll for completion
      pollStatus(result.jobId);
    } catch (error) {
      alert('Error generating image: ' + error.message);
      setIsGenerating(false);
    }
  }

  async function pollStatus(jobId: string) {
    const interval = setInterval(async () => {
      const status = await checkMidjourneyStatus(jobId);
      
      if (status.status === 'completed') {
        clearInterval(interval);
        setGeneratedImage(status.imageUrl!);
        setIsGenerating(false);
        onImageGenerated(status.imageUrl!);
      } else if (status.status === 'failed') {
        clearInterval(interval);
        alert('Image generation failed');
        setIsGenerating(false);
      } else {
        setProgress(status.progress || 0);
      }
    }, 3000); // Poll every 3 seconds
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Generate Image with Midjourney</h2>

      {/* Prompt Input */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Image Prompt:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image in detail..."
          className="w-full px-3 py-2 border rounded h-32"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!prompt || isGenerating}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 font-semibold"
      >
        {isGenerating ? `Generating... ${progress}%` : '🎨 Generate with Midjourney'}
      </button>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This usually takes 30-60 seconds...
          </p>
        </div>
      )}

      {/* Generated Image */}
      {generatedImage && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Generated Image:</h3>
          <img src={generatedImage} alt="Generated" className="rounded-lg shadow-lg max-w-full" />
          <button
            onClick={() => onImageGenerated(generatedImage)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Use This Image
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 🧪 STEP 6: Testing & Deployment *(4-6 hours)*

**Testing:**
- [ ] Test prompt enhancement (simple input → detailed prompt)
- [ ] Test character data examination (auto-generate from character description)
- [ ] Test DALL-E 3 generation (all sizes, standard & HD quality)
- [ ] Test Midjourney generation (if using proxy)
- [ ] Test style presets (apply different aesthetics)
- [ ] Test content moderation (ensure inappropriate prompts are blocked)
- [ ] Test image upload to Supabase Storage
- [ ] Test image versioning (multiple attempts for same character)

**Performance:**
- [ ] Optimize image storage (compress large images)
- [ ] Cache style presets
- [ ] Add loading states for all generation steps

**Deploy:**
- [ ] Run migration on production
- [ ] Seed style presets
- [ ] Set up Midjourney webhook endpoint (if using)
- [ ] Test in production

**PHASE 5 DELIVERABLE:**
✅ AI prompt enhancement (simple input → detailed prompt via GPT-4)
✅ Character data examination (auto-generate prompts from character descriptions)
✅ DALL-E 3 integration (multiple sizes, HD quality, content moderation)
✅ Midjourney integration (proxy/webhook-based generation)
✅ Style preset system (12+ predefined styles with mythology themes)
✅ Prompt templates (character portrait, action, creature, location, battle scene)
✅ Image versioning (multiple attempts, set primary)
✅ Age-appropriate guardrails (OpenAI Moderation API, content filtering)

**TIME ESTIMATE:** 40-50 hours (3-4 weeks part-time)

---

*Phase 5 detailed. Proceeding to Phase 6...* 🕶️

---

---

# 🎭 PHASE 6: PRESENTATION & SHOWCASE

## Duration: Weeks 18-20 (~30-40 hours)

---

## 🎯 PHASE 6 GOAL

**Build presentation and export features:** TTS narration, multi-student presenter mode, exports (PowerPoint, PDF, Google Slides), and shareable links.

**Features to Build:**
1. Presentation mode (distraction-free, full-screen, projector-ready)
2. Theme integration (use student's chosen theme)
3. Badge showcase on title slide
4. TTS narration (Web Speech API, auto-advance slides)
5. Student audio recording (record own narration per slide)
6. Multi-student presenter mode (group presentations, seamless handoffs)
7. Export formats (PowerPoint via pptxgenjs, PDF via pdfkit, Google Slides, HTML)
8. Shareable links (password-protected, view tracking)
9. Presenter view (notes/timer on laptop, clean slides on TV)
10. Content selection (student chooses, AI recommends, teacher requirements)

---

## 📋 PHASE 6 PREREQUISITES

**Must be completed from Phase 1-5:**
- ✅ Mythology, character, creature, story creation working
- ✅ Theme system active
- ✅ Badge system active
- ✅ AI-generated images available

**New Database Tables Needed:**
- `presentations` (saved presentations)
- `presentation_slides` (individual slides)
- `presentation_shares` (shareable links)
- `presentation_views` (track who viewed)

---

## 🗄️ STEP 1: Database Schema Extension *(2-3 hours)*

Create migration: `supabase/migrations/006_presentations.sql`

```sql
-- PRESENTATIONS TABLE
CREATE TABLE IF NOT EXISTS public.presentations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Ownership
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Presentation Info
  title TEXT NOT NULL,
  description TEXT,
  
  -- Settings
  theme TEXT, -- Theme to use for presentation
  include_badges BOOLEAN DEFAULT TRUE,
  auto_advance_duration INTEGER, -- Seconds per slide (0 = manual)
  
  -- Content Selection
  selected_content JSONB, -- {characters: [...ids], creatures: [...ids], stories: [...ids]}
  
  -- Metadata
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PRESENTATION SLIDES TABLE
CREATE TABLE IF NOT EXISTS public.presentation_slides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  presentation_id UUID REFERENCES public.presentations(id) ON DELETE CASCADE,
  
  -- Slide Info
  slide_number INTEGER NOT NULL,
  slide_type TEXT CHECK (slide_type IN ('title', 'character', 'creature', 'story', 'location', 'custom')) NOT NULL,
  
  -- Content
  entity_id UUID, -- ID of character/creature/story/etc.
  custom_content JSONB, -- For custom slides: {title, body, image_url}
  
  -- Narration
  tts_text TEXT, -- Text for TTS narration
  audio_recording_url TEXT, -- URL to student-recorded audio
  
  -- Presenter Notes
  notes TEXT, -- Notes visible only in presenter view
  
  -- Timing
  duration INTEGER, -- Override auto-advance duration for this slide
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- PRESENTATION SHARES TABLE
CREATE TABLE IF NOT EXISTS public.presentation_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  presentation_id UUID REFERENCES public.presentations(id) ON DELETE CASCADE,
  
  -- Share Info
  share_token TEXT UNIQUE NOT NULL,
  password_hash TEXT, -- Optional password protection
  
  -- Permissions
  can_view BOOLEAN DEFAULT TRUE,
  can_download BOOLEAN DEFAULT FALSE,
  
  -- Expiration
  expires_at TIMESTAMP,
  
  -- Tracking
  view_count INTEGER DEFAULT 0,
  
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- PRESENTATION VIEWS TABLE
CREATE TABLE IF NOT EXISTS public.presentation_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  share_id UUID REFERENCES public.presentation_shares(id) ON DELETE CASCADE,
  
  -- Viewer Info
  viewer_ip TEXT,
  viewer_user_agent TEXT,
  
  -- View Details
  viewed_at TIMESTAMP DEFAULT NOW(),
  duration_seconds INTEGER -- How long they viewed
);

-- ROW LEVEL SECURITY
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentation_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentation_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.presentation_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own presentations" ON public.presentations FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can manage own presentations" ON public.presentations FOR ALL
  USING (auth.uid() = created_by);

CREATE POLICY "Users can view slides for own presentations" ON public.presentation_slides FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.presentations p
      WHERE p.id = presentation_id AND p.created_by = auth.uid()
    )
  );

-- INDEXES
CREATE INDEX idx_presentations_mythology ON public.presentations(mythology_id);
CREATE INDEX idx_presentation_slides_presentation ON public.presentation_slides(presentation_id, slide_number);
CREATE INDEX idx_presentation_shares_token ON public.presentation_shares(share_token);
```

**Actions:**
- [ ] Run migration in Supabase
- [ ] Regenerate TypeScript types

---

## 📊 STEP 2: Presentation Builder *(10-12 hours)*

### **A) Presentation Creation** *(4-5 hours)*

```typescript
// src/lib/presentations/createPresentation.ts
import { supabase } from '@/lib/supabase/client';

export async function createPresentation({
  mythologyId,
  userId,
  title,
  selectedContent,
  theme,
}: {
  mythologyId: string,
  userId: string,
  title: string,
  selectedContent: {
    characters: string[],
    creatures: string[],
    stories: string[],
    locations: string[],
  },
  theme: string,
}) {
  // Create presentation
  const { data: presentation, error } = await supabase
    .from('presentations')
    .insert({
      mythology_id: mythologyId,
      created_by: userId,
      title,
      theme,
      selected_content: selectedContent,
    })
    .select()
    .single();
  
  if (error) throw error;
  
  // Generate slides
  let slideNumber = 1;
  
  // Title slide
  await createSlide(presentation.id, {
    slide_number: slideNumber++,
    slide_type: 'title',
    custom_content: {
      title: title,
      subtitle: 'A mythology by [Student Name]',
    },
  });
  
  // Character slides
  for (const characterId of selectedContent.characters) {
    const { data: character } = await supabase
      .from('characters')
      .select('*')
      .eq('id', characterId)
      .single();
    
    if (character) {
      await createSlide(presentation.id, {
        slide_number: slideNumber++,
        slide_type: 'character',
        entity_id: characterId,
        tts_text: generateCharacterNarration(character),
        notes: `Presenter notes: Talk about ${character.name}'s powers and significance.`,
      });
    }
  }
  
  // Creature slides
  for (const creatureId of selectedContent.creatures) {
    const { data: creature } = await supabase
      .from('creatures')
      .select('*')
      .eq('id', creatureId)
      .single();
    
    if (creature) {
      await createSlide(presentation.id, {
        slide_number: slideNumber++,
        slide_type: 'creature',
        entity_id: creatureId,
        tts_text: generateCreatureNarration(creature),
      });
    }
  }
  
  // Story slides
  for (const storyId of selectedContent.stories) {
    const { data: story } = await supabase
      .from('stories')
      .select('*')
      .eq('id', storyId)
      .single();
    
    if (story) {
      await createSlide(presentation.id, {
        slide_number: slideNumber++,
        slide_type: 'story',
        entity_id: storyId,
        tts_text: generateStoryNarration(story),
      });
    }
  }
  
  return presentation;
}

async function createSlide(presentationId: string, slideData: any) {
  await supabase
    .from('presentation_slides')
    .insert({
      presentation_id: presentationId,
      ...slideData,
    });
}

function generateCharacterNarration(character: any): string {
  return `This is ${character.name}, a ${character.character_type}. ${character.appearance}. ${character.powers ? `Their powers include ${character.powers}.` : ''} ${character.backstory?.slice(0, 200) || ''}`;
}

function generateCreatureNarration(creature: any): string {
  return `Meet ${creature.name}, a ${creature.creature_type}. ${creature.appearance}. ${creature.abilities ? `They have ${creature.abilities}.` : ''}`;
}

function generateStoryNarration(story: any): string {
  return `${story.title}. ${story.content?.slice(0, 300) || ''}`;
}
```

### **B) Presentation Builder UI** *(6-7 hours)*

```typescript
// src/components/presentations/PresentationBuilder.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { createPresentation } from '@/lib/presentations/createPresentation';

export function PresentationBuilder({ mythologyId, userId }: {
  mythologyId: string,
  userId: string
}) {
  const [title, setTitle] = useState('');
  const [characters, setCharacters] = useState<any[]>([]);
  const [creatures, setCreatures] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [selectedCreatures, setSelectedCreatures] = useState<string[]>([]);
  const [selectedStories, setSelectedStories] = useState<string[]>([]);
  const [theme, setTheme] = useState('cyberpunk_neon');

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    const { data: chars } = await supabase
      .from('characters')
      .select('*')
      .eq('mythology_id', mythologyId);
    
    const { data: creat } = await supabase
      .from('creatures')
      .select('*')
      .eq('mythology_id', mythologyId);
    
    const { data: stor } = await supabase
      .from('stories')
      .select('*')
      .eq('mythology_id', mythologyId);
    
    setCharacters(chars || []);
    setCreatures(creat || []);
    setStories(stor || []);
  }

  async function handleCreate() {
    if (!title) {
      alert('Please enter a title');
      return;
    }

    const presentation = await createPresentation({
      mythologyId,
      userId,
      title,
      selectedContent: {
        characters: selectedCharacters,
        creatures: selectedCreatures,
        stories: selectedStories,
        locations: [],
      },
      theme,
    });

    alert('Presentation created!');
    window.location.href = `/presentations/${presentation.id}`;
  }

  function toggleSelection(id: string, type: 'character' | 'creature' | 'story') {
    if (type === 'character') {
      setSelectedCharacters(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else if (type === 'creature') {
      setSelectedCreatures(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else if (type === 'story') {
      setSelectedStories(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create Presentation</h1>

      {/* Title */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Presentation Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., My Mythology Showcase"
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {/* Theme Selector */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Presentation Theme:</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="cyberpunk_neon">Cyberpunk Neon</option>
          <option value="ancient_scrolls">Ancient Scrolls</option>
          <option value="dark_realm">Dark Realm</option>
          {/* More themes */}
        </select>
      </div>

      {/* Content Selection */}
      <div className="space-y-6">
        {/* Characters */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Select Characters:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => toggleSelection(char.id, 'character')}
                className={`p-3 border-2 rounded text-left ${
                  selectedCharacters.includes(char.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <img src={char.image_url} alt="" className="w-full h-32 object-cover rounded mb-2" />
                <div className="font-semibold">{char.name}</div>
                <div className="text-sm text-gray-600">{char.character_type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Creatures */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Select Creatures:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {creatures.map((creature) => (
              <button
                key={creature.id}
                onClick={() => toggleSelection(creature.id, 'creature')}
                className={`p-3 border-2 rounded text-left ${
                  selectedCreatures.includes(creature.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <img src={creature.image_url} alt="" className="w-full h-32 object-cover rounded mb-2" />
                <div className="font-semibold">{creature.name}</div>
                <div className="text-sm text-gray-600">{creature.creature_type}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Stories */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Select Stories:</h2>
          <div className="space-y-2">
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => toggleSelection(story.id, 'story')}
                className={`w-full p-3 border-2 rounded text-left ${
                  selectedStories.includes(story.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <div className="font-semibold">{story.title}</div>
                <div className="text-sm text-gray-600">{story.content?.slice(0, 100)}...</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Create Button */}
      <button
        onClick={handleCreate}
        className="mt-8 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
      >
        Create Presentation ({selectedCharacters.length + selectedCreatures.length + selectedStories.length + 1} slides)
      </button>
    </div>
  );
}
```

---

## 🎤 STEP 3: TTS Narration System *(6-8 hours)*

### **A) Web Speech API TTS** *(3-4 hours)*

```typescript
// src/lib/presentations/tts.ts

export class TTSNarrator {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  speak(text: string, options?: {
    rate?: number,
    pitch?: number,
    volume?: number,
    voice?: SpeechSynthesisVoice,
    onEnd?: () => void
  }) {
    // Cancel any ongoing speech
    this.stop();

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = options?.rate || 1.0;
    this.utterance.pitch = options?.pitch || 1.0;
    this.utterance.volume = options?.volume || 1.0;

    if (options?.voice) {
      this.utterance.voice = options.voice;
    }

    this.onEndCallback = options?.onEnd || null;

    this.utterance.onend = () => {
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };

    this.synthesis.speak(this.utterance);
  }

  pause() {
    this.synthesis.pause();
  }

  resume() {
    this.synthesis.resume();
  }

  stop() {
    this.synthesis.cancel();
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }
}
```

### **B) Student Audio Recording** *(3-4 hours)*

```typescript
// src/components/presentations/AudioRecorder.tsx
'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';

export function AudioRecorder({ slideId, onRecordingComplete }: {
  slideId: string,
  onRecordingComplete: (audioUrl: string) => void
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Upload to Supabase Storage
        const fileName = `presentations/audio/${slideId}/${Date.now()}.webm`;
        const { data, error } = await supabase.storage
          .from('audio')
          .upload(fileName, audioBlob, {
            contentType: 'audio/webm',
          });

        if (!error) {
          const { data: { publicUrl } } = supabase.storage
            .from('audio')
            .getPublicUrl(fileName);

          onRecordingComplete(publicUrl);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      alert('Error accessing microphone: ' + error.message);
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }

  return (
    <div className="p-4 border rounded">
      <h3 className="font-semibold mb-3">Record Your Narration</h3>

      {!isRecording && !audioUrl && (
        <button
          onClick={startRecording}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          🎤 Start Recording
        </button>
      )}

      {isRecording && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span>Recording...</span>
          </div>
          <button
            onClick={stopRecording}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ⏹️ Stop Recording
          </button>
        </div>
      )}

      {audioUrl && (
        <div>
          <audio src={audioUrl} controls className="w-full mb-3" />
          <button
            onClick={() => {
              setAudioUrl(null);
              startRecording();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            🔄 Re-record
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 📺 STEP 4: Presentation Viewer *(8-10 hours)*

### **A) Presentation Player** *(5-6 hours)*

```typescript
// src/components/presentations/PresentationPlayer.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { TTSNarrator } from '@/lib/presentations/tts';

export function PresentationPlayer({ presentationId }: { presentationId: string }) {
  const [presentation, setPresentation] = useState<any>(null);
  const [slides, setSlides] = useState<any[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsNarrator] = useState(() => new TTSNarrator());

  useEffect(() => {
    loadPresentation();
  }, []);

  async function loadPresentation() {
    const { data: pres } = await supabase
      .from('presentations')
      .select('*')
      .eq('id', presentationId)
      .single();

    const { data: slideData } = await supabase
      .from('presentation_slides')
      .select('*')
      .eq('presentation_id', presentationId)
      .order('slide_number');

    setPresentation(pres);
    setSlides(slideData || []);
  }

  function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  }

  function previousSlide() {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  }

  function playNarration() {
    const slide = slides[currentSlideIndex];
    
    if (slide.audio_recording_url) {
      // Play recorded audio
      const audio = new Audio(slide.audio_recording_url);
      audio.play();
      audio.onended = () => {
        if (presentation.auto_advance_duration > 0) {
          setTimeout(nextSlide, 1000);
        }
      };
    } else if (slide.tts_text) {
      // Use TTS
      ttsNarrator.speak(slide.tts_text, {
        onEnd: () => {
          if (presentation.auto_advance_duration > 0) {
            setTimeout(nextSlide, 1000);
          }
        },
      });
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Slide Display */}
      <div className="flex-1 flex items-center justify-center">
        {currentSlide && (
          <div className="max-w-6xl w-full p-8">
            <SlideRenderer slide={currentSlide} theme={presentation?.theme} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4 flex justify-between items-center">
        <button
          onClick={previousSlide}
          disabled={currentSlideIndex === 0}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-30"
        >
          ← Previous
        </button>

        <div className="flex gap-4">
          <button
            onClick={playNarration}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            🔊 Play Narration
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            ⛶ Fullscreen
          </button>
        </div>

        <button
          onClick={nextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-30"
        >
          Next →
        </button>
      </div>

      {/* Progress */}
      <div className="bg-gray-800 px-4 py-2 text-white text-sm text-center">
        Slide {currentSlideIndex + 1} of {slides.length}
      </div>
    </div>
  );
}

function SlideRenderer({ slide, theme }: { slide: any, theme: string }) {
  if (slide.slide_type === 'title') {
    return (
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">{slide.custom_content.title}</h1>
        <p className="text-2xl">{slide.custom_content.subtitle}</p>
      </div>
    );
  }

  if (slide.slide_type === 'character') {
    return <CharacterSlide entityId={slide.entity_id} />;
  }

  // ... other slide types
  
  return null;
}

function CharacterSlide({ entityId }: { entityId: string }) {
  const [character, setCharacter] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('characters')
        .select('*')
        .eq('id', entityId)
        .single();
      setCharacter(data);
    }
    load();
  }, [entityId]);

  if (!character) return null;

  return (
    <div className="grid grid-cols-2 gap-8 text-white">
      <div>
        <img src={character.image_url} alt={character.name} className="rounded-lg shadow-2xl" />
      </div>
      <div>
        <h2 className="text-4xl font-bold mb-4">{character.name}</h2>
        <p className="text-xl mb-2"><strong>Type:</strong> {character.character_type}</p>
        <p className="text-lg mb-4">{character.appearance}</p>
        {character.powers && (
          <p className="text-lg"><strong>Powers:</strong> {character.powers}</p>
        )}
      </div>
    </div>
  );
}
```

### **B) Presenter View** *(3-4 hours)*

Split-screen: notes/timer on laptop, clean slides on external display

```typescript
// src/components/presentations/PresenterView.tsx
'use client';

import { useState, useEffect } from 'react';

export function PresenterView({ presentationId }: { presentationId: string }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    // Open clean slides on external display
    const externalWindow = window.open(
      `/presentations/${presentationId}/viewer`,
      'presentation',
      'fullscreen=yes'
    );

    // Sync slide changes
    window.addEventListener('message', (event) => {
      if (event.data.type === 'SLIDE_CHANGE') {
        setCurrentSlide(event.data.slideIndex);
        externalWindow?.postMessage({ type: 'GOTO_SLIDE', slideIndex: event.data.slideIndex }, '*');
      }
    });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 h-screen">
      {/* Current Slide Preview */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Current Slide</h2>
        <div className="border bg-gray-100 aspect-video flex items-center justify-center">
          <SlidePreview slideIndex={currentSlide} />
        </div>
      </div>

      {/* Next Slide Preview */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Next Slide</h2>
        <div className="border bg-gray-100 aspect-video flex items-center justify-center">
          <SlidePreview slideIndex={currentSlide + 1} />
        </div>
      </div>

      {/* Presenter Notes */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Notes</h2>
        <div className="text-sm">
          {/* Slide notes here */}
          <p>Talk about the character's significance...</p>
        </div>
      </div>

      {/* Timer & Controls */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Timer</h2>
        <div className="text-4xl font-mono mb-4">{formatTime(elapsedTime)}</div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isTimerRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={() => setElapsedTime(0)}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📤 STEP 5: Export Formats *(8-10 hours)*

### **A) PowerPoint Export (pptxgenjs)** *(4-5 hours)*

```bash
npm install pptxgenjs
```

```typescript
// src/lib/presentations/exportPowerPoint.ts
import pptxgen from 'pptxgenjs';
import { supabase } from '@/lib/supabase/client';

export async function exportToPowerPoint(presentationId: string): Promise<Blob> {
  const pptx = new pptxgen();

  // Load presentation and slides
  const { data: presentation } = await supabase
    .from('presentations')
    .select('*')
    .eq('id', presentationId)
    .single();

  const { data: slides } = await supabase
    .from('presentation_slides')
    .select('*')
    .eq('presentation_id', presentationId)
    .order('slide_number');

  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.addText(presentation.title, {
    x: 1,
    y: 2,
    fontSize: 44,
    bold: true,
    color: '363636',
  });

  // Content slides
  for (const slide of slides || []) {
    const pptxSlide = pptx.addSlide();

    if (slide.slide_type === 'character') {
      const { data: character } = await supabase
        .from('characters')
        .select('*')
        .eq('id', slide.entity_id)
        .single();

      if (character) {
        pptxSlide.addText(character.name, {
          x: 0.5,
          y: 0.5,
          fontSize: 32,
          bold: true,
        });

        if (character.image_url) {
          pptxSlide.addImage({
            path: character.image_url,
            x: 0.5,
            y: 1.5,
            w: 4,
            h: 4,
          });
        }

        pptxSlide.addText(character.appearance || '', {
          x: 5,
          y: 1.5,
          w: 4,
          h: 4,
          fontSize: 14,
        });
      }
    }

    // ... handle other slide types
  }

  // Generate file
  const blob = await pptx.write('blob') as Blob;
  return blob;
}
```

### **B) PDF Export (puppeteer)** *(4-5 hours)*

```bash
npm install puppeteer
```

```typescript
// src/lib/presentations/exportPDF.ts
import puppeteer from 'puppeteer';

export async function exportToPDF(presentationId: string): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to presentation viewer
  await page.goto(`${process.env.NEXT_PUBLIC_URL}/presentations/${presentationId}/print`, {
    waitUntil: 'networkidle0',
  });

  // Generate PDF
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    landscape: true,
  });

  await browser.close();
  return pdf;
}

// Create print-friendly version
// src/app/presentations/[id]/print/page.tsx
export default async function PresentationPrintView({ params }: { params: { id: string } }) {
  const { data: slides } = await supabase
    .from('presentation_slides')
    .select('*')
    .eq('presentation_id', params.id)
    .order('slide_number');

  return (
    <div>
      {slides?.map((slide, index) => (
        <div key={slide.id} className="page-break">
          <SlideRenderer slide={slide} />
        </div>
      ))}

      <style jsx>{`
        .page-break {
          page-break-after: always;
          height: 100vh;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
}
```

---

## 🔗 STEP 6: Shareable Links *(4-6 hours)*

```typescript
// src/lib/presentations/createShareLink.ts
import { supabase } from '@/lib/supabase/client';
import { randomBytes } from 'crypto';

export async function createShareLink({
  presentationId,
  userId,
  password,
  expiresInDays,
}: {
  presentationId: string,
  userId: string,
  password?: string,
  expiresInDays?: number,
}): Promise<{ shareToken: string, shareUrl: string }> {
  const shareToken = randomBytes(16).toString('hex');
  
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const passwordHash = password
    ? await hashPassword(password)
    : null;

  await supabase
    .from('presentation_shares')
    .insert({
      presentation_id: presentationId,
      share_token: shareToken,
      password_hash: passwordHash,
      expires_at: expiresAt,
      created_by: userId,
    });

  const shareUrl = `${process.env.NEXT_PUBLIC_URL}/shared/${shareToken}`;
  
  return { shareToken, shareUrl };
}

async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcryptjs');
  return bcrypt.hash(password, 10);
}

// Shared presentation viewer
// src/app/shared/[token]/page.tsx
export default async function SharedPresentationPage({ params }: { params: { token: string } }) {
  const { data: share } = await supabase
    .from('presentation_shares')
    .select('*, presentation:presentations(*)')
    .eq('share_token', params.token)
    .single();

  if (!share) {
    return <div>Presentation not found</div>;
  }

  if (share.expires_at && new Date(share.expires_at) < new Date()) {
    return <div>This link has expired</div>;
  }

  // Track view
  await supabase
    .from('presentation_views')
    .insert({
      share_id: share.id,
      viewer_ip: req.ip,
      viewer_user_agent: req.headers['user-agent'],
    });

  return <PresentationPlayer presentationId={share.presentation_id} />;
}
```

---

## 🧪 STEP 7: Testing & Deployment *(4-6 hours)*

**Testing:**
- [ ] Test presentation builder (select content, create slides)
- [ ] Test TTS narration (auto-advance, voice selection)
- [ ] Test audio recording (record, playback, upload)
- [ ] Test presentation player (navigation, fullscreen, controls)
- [ ] Test presenter view (split-screen, timer, notes)
- [ ] Test PowerPoint export (all slide types)
- [ ] Test PDF export (print layout, formatting)
- [ ] Test shareable links (password protection, expiration, view tracking)

**Deploy:**
- [ ] Run migration on production
- [ ] Test TTS in different browsers
- [ ] Test exports on server (Puppeteer may need Chrome installed)

**PHASE 6 DELIVERABLE:**
✅ Presentation builder (select characters/creatures/stories, auto-generate slides)
✅ TTS narration system (Web Speech API, auto-advance slides)
✅ Student audio recording (record own narration, upload to Supabase)
✅ Presentation player (fullscreen, navigation, controls)
✅ Presenter view (split-screen with notes/timer on laptop, clean slides on TV)
✅ Export formats (PowerPoint via pptxgenjs, PDF via puppeteer)
✅ Shareable links (password-protected, expiration, view tracking)
✅ Theme integration (use student's chosen theme in presentation)
✅ Badge showcase (display earned badges on title slide)

**TIME ESTIMATE:** 30-40 hours (2-3 weeks part-time)

---

*Phase 6 detailed. Proceeding to Phase 7 (final phase)...* 🕶️

---

---

# ✨ PHASE 7: POLISH & LAUNCH

## Duration: Weeks 21-23 (~30-40 hours)

---

## 🎯 PHASE 7 GOAL

**Final polish and launch preparation:** Accessibility, mobile optimization, onboarding, performance optimization, security audit, bug fixes, and production launch.

**Features to Build:**
1. Accessibility audit & fixes (WCAG 2.1 AA compliance)
2. Screen reader support
3. Keyboard navigation
4. Mobile responsive design
5. Touch controls optimization
6. Onboarding & tutorials (optional guides, demo classroom, progressive disclosure)
7. Performance optimization (code splitting, lazy loading, caching, image optimization)
8. Security audit (Snyk, OWASP, XSS prevention, CSRF tokens)
9. Error tracking (Sentry integration)
10. Analytics (Posthog or similar)
11. Final bug fixes
12. Production deployment checklist
13. Launch preparation (teacher training, student guides, parent communication)

---

## ♿ STEP 1: Accessibility Implementation *(8-10 hours)*

### **A) WCAG 2.1 AA Compliance Audit** *(3-4 hours)*

Use automated tools + manual testing:

```bash
npm install --save-dev @axe-core/react eslint-plugin-jsx-a11y
```

**Accessibility Checklist:**
- [ ] All images have alt text
- [ ] Proper heading hierarchy (h1 → h2 → h3, no skipping)
- [ ] Form inputs have labels
- [ ] Sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
- [ ] Focus indicators visible on all interactive elements
- [ ] ARIA labels on icon buttons
- [ ] Skip to main content link
- [ ] No flashing/blinking content
- [ ] Keyboard navigation works for all features
- [ ] Screen reader announces state changes

### **B) Screen Reader Support** *(3-4 hours)*

```typescript
// src/components/a11y/ScreenReaderAnnouncements.tsx
'use client';

import { useEffect, useRef } from 'react';

export function ScreenReaderAnnouncer() {
  const ariaLiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for global announcements
    window.addEventListener('announce', ((e: CustomEvent) => {
      if (ariaLiveRef.current) {
        ariaLiveRef.current.textContent = e.detail.message;
        
        // Clear after announcement
        setTimeout(() => {
          if (ariaLiveRef.current) {
            ariaLiveRef.current.textContent = '';
          }
        }, 1000);
      }
    }) as EventListener);
  }, []);

  return (
    <>
      {/* Polite announcements (non-urgent) */}
      <div
        ref={ariaLiveRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      
      {/* Assertive announcements (urgent) */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="screen-reader-alert"
      />
    </>
  );
}

// Utility function to announce messages
export function announce(message: string, urgent = false) {
  if (urgent) {
    const alertDiv = document.getElementById('screen-reader-alert');
    if (alertDiv) {
      alertDiv.textContent = message;
      setTimeout(() => {
        alertDiv.textContent = '';
      }, 1000);
    }
  } else {
    window.dispatchEvent(new CustomEvent('announce', { detail: { message } }));
  }
}

// Add to global.css
/* .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
} */
```

**Usage Example:**
```typescript
import { announce } from '@/components/a11y/ScreenReaderAnnouncements';

// When badge is earned:
announce('Congratulations! You earned the Epic Worldbuilder badge!');

// When character is saved:
announce('Character saved successfully');

// Urgent announcement:
announce('Error: Failed to save character', true);
```

### **C) Keyboard Navigation** *(2-3 hours)*

Ensure all interactive elements are keyboard accessible:

```typescript
// src/hooks/useKeyboardNavigation.ts
import { useEffect } from 'react';

export function useKeyboardNavigation(config: {
  onEscape?: () => void,
  onEnter?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void,
}) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'Escape':
          config.onEscape?.();
          break;
        case 'Enter':
          config.onEnter?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          config.onArrowUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          config.onArrowDown?.();
          break;
        case 'ArrowLeft':
          config.onArrowLeft?.();
          break;
        case 'ArrowRight':
          config.onArrowRight?.();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config]);
}

// Usage in Presentation Player:
useKeyboardNavigation({
  onArrowRight: nextSlide,
  onArrowLeft: previousSlide,
  onEscape: exitFullscreen,
});
```

---

## 📱 STEP 2: Mobile Optimization *(8-10 hours)*

### **A) Responsive Design Audit** *(4-5 hours)*

Test on multiple breakpoints:
- Mobile: 375px (iPhone SE), 390px (iPhone 12/13), 414px (iPhone Pro Max)
- Tablet: 768px (iPad), 820px (iPad Air), 1024px (iPad Pro)
- Desktop: 1280px, 1920px

**Mobile-specific improvements:**

```typescript
// src/components/mobile/MobileNav.tsx
'use client';

import { useState } from 'react';

export function MobileNav({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4">
            <nav className="space-y-2">
              <a href="/student/dashboard" className="block py-2 px-3 rounded hover:bg-gray-100">
                Dashboard
              </a>
              <a href="/gallery" className="block py-2 px-3 rounded hover:bg-gray-100">
                Gallery
              </a>
              <a href="/leaderboard" className="block py-2 px-3 rounded hover:bg-gray-100">
                Leaderboard
              </a>
              <a href="/student/badges" className="block py-2 px-3 rounded hover:bg-gray-100">
                Badges
              </a>
              {/* More links */}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
```

### **B) Touch Controls** *(2-3 hours)*

Add swipe gestures for mobile:

```typescript
// src/hooks/useSwipeGesture.ts
import { useEffect, useState } from 'react';

export function useSwipeGesture(config: {
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold?: number,
}) {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const threshold = config.threshold || 50;

  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }

    function handleTouchMove(e: TouchEvent) {
      setTouchEnd({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }

    function handleTouchEnd() {
      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = touchEnd.y - touchStart.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            config.onSwipeRight?.();
          } else {
            config.onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            config.onSwipeDown?.();
          } else {
            config.onSwipeUp?.();
          }
        }
      }
    }

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd, config, threshold]);
}

// Usage in Presentation Player:
useSwipeGesture({
  onSwipeLeft: nextSlide,
  onSwipeRight: previousSlide,
});
```

### **C) Mobile-Specific Layouts** *(2-3 hours)*

```typescript
// Adjust form layouts for mobile
// Example: Character creation form
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Stacks on mobile, side-by-side on desktop */}
</div>

// Mobile-friendly image upload
<div className="flex flex-col md:flex-row gap-4">
  <button className="w-full md:w-auto">Upload Image</button>
</div>
```

---

## 🎓 STEP 3: Onboarding & Tutorials *(6-8 hours)*

### **A) Optional Tutorial System** *(4-5 hours)*

```typescript
// src/components/onboarding/TutorialOverlay.tsx
'use client';

import { useState, useEffect } from 'react';

export function TutorialOverlay({ userId }: { userId: string }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen tutorial
    const hasSeenTutorial = localStorage.getItem(`tutorial_completed_${userId}`);
    if (!hasSeenTutorial) {
      setIsVisible(true);
    }
  }, [userId]);

  const steps = [
    {
      target: '#create-character-btn',
      title: 'Create Your First Character',
      description: 'Click here to start building your mythology by creating a god, goddess, or hero.',
      position: 'bottom',
    },
    {
      target: '#gallery-link',
      title: 'Explore the Gallery',
      description: 'See what other students have created and get inspired!',
      position: 'right',
    },
    {
      target: '#badges-link',
      title: 'Earn Badges',
      description: 'Complete challenges and unlock awesome badges as you build your mythology.',
      position: 'right',
    },
    // ... more steps
  ];

  function nextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  }

  function skipTutorial() {
    completeTutorial();
  }

  function completeTutorial() {
    localStorage.setItem(`tutorial_completed_${userId}`, 'true');
    setIsVisible(false);
  }

  if (!isVisible) return null;

  const step = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-70 z-40" />

      {/* Tutorial Card */}
      <div
        className="fixed z-50 bg-white rounded-lg shadow-2xl p-6 max-w-md"
        style={{
          // Position relative to target element
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
        <p className="text-gray-700 mb-4">{step.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {steps.length}
          </span>

          <div className="flex gap-2">
            <button
              onClick={skipTutorial}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Skip
            </button>
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Got it!'}
            </button>
          </div>
        </div>
      </div>

      {/* Arrow pointing to target */}
      <div
        className="fixed z-50"
        style={{
          // Calculate arrow position based on target element
        }}
      >
        {/* SVG arrow */}
      </div>
    </>
  );
}
```

### **B) Demo Classroom** *(2-3 hours)*

Pre-populate demo data for teachers to explore:

```typescript
// scripts/seedDemoClassroom.ts
import { supabase } from '@/lib/supabase/client';

async function seedDemoClassroom() {
  // Create demo teacher
  const { data: teacher } = await supabase.auth.signUp({
    email: 'demo@teacher.com',
    password: 'DemoPassword123!',
  });

  // Create 5 demo students
  const students = [];
  for (let i = 1; i <= 5; i++) {
    const { data: student } = await supabase.auth.signUp({
      email: `demo.student${i}@example.com`,
      password: 'DemoPassword123!',
    });
    students.push(student.user);
  }

  // Create demo mythologies with characters, creatures, stories
  for (const student of students) {
    const { data: mythology } = await supabase
      .from('mythologies')
      .insert({
        name: `Demo Mythology ${student.id.slice(0, 4)}`,
        description: 'This is a demo mythology for exploration',
        created_by: student.id,
        mythology_type: 'fantasy',
        geography: 'islands',
      })
      .select()
      .single();

    // Add characters, creatures, etc.
    // ...
  }

  console.log('Demo classroom seeded!');
}

seedDemoClassroom();
```

---

## ⚡ STEP 4: Performance Optimization *(6-8 hours)*

### **A) Code Splitting & Lazy Loading** *(2-3 hours)*

```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic';

const KonvaMapCanvas = dynamic(() => import('@/components/maps/MapCanvas'), {
  loading: () => <div>Loading map editor...</div>,
  ssr: false, // Don't server-render (Konva needs browser APIs)
});

const CytoscapeGraph = dynamic(() => import('@/components/relationships/RelationshipGraph'), {
  loading: () => <div>Loading relationship graph...</div>,
  ssr: false,
});

const TipTapEditor = dynamic(() => import('@/components/stories/StoryEditor'), {
  loading: () => <div>Loading editor...</div>,
});
```

### **B) Image Optimization** *(2-3 hours)*

```typescript
// Use Next.js Image component with optimization
import Image from 'next/image';

<Image
  src={character.image_url}
  alt={character.name}
  width={400}
  height={400}
  placeholder="blur"
  blurDataURL="/placeholder.jpg"
  quality={80}
  loading="lazy"
/>

// Compress images on upload
import sharp from 'sharp';

async function compressImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85, progressive: true })
    .toBuffer();
}
```

### **C) Caching Strategy** *(2-3 hours)*

```typescript
// API route caching
export const revalidate = 60; // Revalidate every 60 seconds

// Supabase query caching
import { unstable_cache } from 'next/cache';

const getCachedLeaderboard = unstable_cache(
  async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('points', { ascending: false })
      .limit(20);
    return data;
  },
  ['leaderboard'],
  { revalidate: 300 } // Cache for 5 minutes
);
```

---

## 🔒 STEP 5: Security Audit *(4-6 hours)*

### **A) Security Scanning** *(2-3 hours)*

```bash
# Install security tools
npm install --save-dev @snyk/cli

# Run Snyk scan
npx snyk test

# Run OWASP dependency check
npm audit

# Fix vulnerabilities
npm audit fix
```

### **B) Security Best Practices** *(2-3 hours)*

**Checklist:**
- [ ] All API routes require authentication
- [ ] Row Level Security (RLS) enabled on all Supabase tables
- [ ] OpenAI Moderation API active for all user-generated content
- [ ] CSRF tokens on forms
- [ ] XSS prevention (sanitize HTML inputs)
- [ ] SQL injection prevention (use parameterized queries)
- [ ] Rate limiting on API routes
- [ ] Secure environment variables (never commit .env to git)
- [ ] HTTPS enforced in production
- [ ] Content Security Policy (CSP) headers

```typescript
// Middleware for authentication
// src/middleware.ts
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function middleware(req: Request) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && req.url.includes('/student/')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Rate limiting (using Upstash Redis)
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export async function POST(req: Request) {
  const identifier = req.headers.get('x-forwarded-for') || 'anonymous';
  const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  // ... handle request
}
```

---

## 📊 STEP 6: Error Tracking & Analytics *(4-6 hours)*

### **A) Sentry Integration** *(2-3 hours)*

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});

// Use in error boundaries
import { ErrorBoundary } from '@sentry/nextjs';

<ErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</ErrorBoundary>
```

### **B) Analytics (PostHog)** *(2-3 hours)*

```bash
npm install posthog-js
```

```typescript
// src/lib/analytics.ts
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: 'https://app.posthog.com',
  });
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  posthog.capture(eventName, properties);
}

// Usage:
trackEvent('character_created', {
  character_type: 'god',
  mythology_id: mythologyId,
});

trackEvent('badge_earned', {
  badge_name: 'Epic Worldbuilder',
});
```

---

## 🐛 STEP 7: Final Bug Fixes & Testing *(6-8 hours)*

**Testing Checklist:**
- [ ] Test all CRUD operations (Create, Read, Update, Delete)
- [ ] Test all user flows (student signup → create mythology → earn badges → present)
- [ ] Test teacher dashboard (impersonation, grading, content visibility)
- [ ] Test real-time features (chat, co-editing, presence)
- [ ] Test gamification (points, badges, leaderboards, streaks)
- [ ] Test AI features (image generation, story assistance)
- [ ] Test presentations (TTS, audio recording, exports)
- [ ] Test mobile responsiveness (all features work on phone)
- [ ] Test accessibility (keyboard navigation, screen reader)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

**Bug Fix Process:**
1. Reproduce bug
2. Fix issue
3. Add test to prevent regression
4. Deploy fix

---

## 🚀 STEP 8: Production Deployment Checklist *(4-6 hours)*

**Pre-Launch:**
- [ ] Run all database migrations on production Supabase
- [ ] Seed style presets, badges, avatar items, deity data
- [ ] Set all environment variables on Vercel
- [ ] Enable Supabase RLS policies on all tables
- [ ] Enable Supabase Realtime for chat/notifications/presence
- [ ] Test Vercel deployment (auto-deploy from main branch)
- [ ] Set up custom domain (e.g., mythologybuilder.com)
- [ ] Configure SSL/HTTPS
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics (PostHog)

**Launch Day:**
- [ ] Send teacher training guide
- [ ] Send student welcome email
- [ ] Send parent communication (optional)
- [ ] Monitor error logs (Sentry)
- [ ] Monitor performance (Vercel analytics)
- [ ] Monitor user feedback (in-app feedback form)

**Post-Launch:**
- [ ] Weekly bug fix releases
- [ ] Monthly feature releases
- [ ] Gather teacher feedback
- [ ] Gather student feedback
- [ ] Iterate based on usage patterns

---

## 📚 STEP 9: Documentation *(2-4 hours)*

**Teacher Guide:**
- Getting started (signup, classroom setup)
- Dashboard walkthrough
- Grading system
- Content moderation
- Impersonation tool
- Reports & analytics

**Student Guide:**
- How to create mythology
- Character/creature creation tips
- Story writing guidance
- Earning badges
- Presentations

**Parent Communication:**
- What is this project?
- Educational benefits
- Safety & moderation
- How to view child's work

---

## 🧪 STEP 10: Final Testing & Launch *(4-6 hours)*

**Soft Launch (Week 1):**
- 1 teacher, 10 students
- Monitor closely for bugs
- Gather feedback
- Fix critical issues

**Full Launch (Week 2+):**
- Open to all teachers
- Monitor performance/errors
- Weekly updates

**PHASE 7 DELIVERABLE:**
✅ WCAG 2.1 AA accessibility compliance (screen reader, keyboard navigation, ARIA labels)
✅ Mobile responsive design (works on phones/tablets, touch controls, swipe gestures)
✅ Optional onboarding tutorial (progressive disclosure, skip option, demo classroom)
✅ Performance optimization (code splitting, lazy loading, image compression, caching)
✅ Security audit complete (Snyk scan, OWASP compliance, rate limiting, CSRF protection)
✅ Error tracking (Sentry integration)
✅ Analytics (PostHog integration)
✅ Cross-browser testing (Chrome, Firefox, Safari, Edge)
✅ Production deployment checklist complete
✅ Teacher/student/parent documentation complete
✅ Soft launch successful (1 classroom)
✅ Ready for full launch

**TIME ESTIMATE:** 30-40 hours (2-3 weeks part-time)

---

# 🎉 PROJECT COMPLETE!

**TOTAL DEVELOPMENT TIME:** ~300-400 hours (~3-4 months part-time or 8-10 weeks full-time)

**ALL 7 PHASES DETAILED:**
✅ Phase 0: Project Setup (10-15 hours)
✅ Phase 1: Foundation/MVP (60-80 hours)
✅ Phase 2: Advanced Content Creation (60-80 hours)
✅ Phase 3: Gamification & Engagement (40-50 hours)
✅ Phase 4: Collaboration & Real-Time (50-60 hours)
✅ Phase 5: AI Enhancements (40-50 hours)
✅ Phase 6: Presentation & Showcase (30-40 hours)
✅ Phase 7: Polish & Launch (30-40 hours)

**NEXT STEPS:**
1. Begin Phase 0: Project Setup
2. Follow roadmap step-by-step
3. Test frequently after each phase
4. Deploy early, iterate often
5. Gather user feedback continuously

---

*All phases detailed. Roadmap complete. Ready to build.* 🚀 🕶️

---

## 📝 RESEARCH TASKS ROADMAP

### **Immediate (Phase 0-1):**
- ✅ Finalize hosting (Vercel + Supabase)
- 📝 Review Supabase Row-Level Security best practices
- 📝 Research OpenAI Moderation API edge cases
- 📝 Test Supabase Storage image transformation (thumbnails, compression)

### **Phase 2:**
- 📝 Research Cytoscape.js for relationship mapping
- 📝 Research Konva/Fabric.js for map drawing
- 📝 Research custom coordinate system implementation
- 📝 Research rich text editor options (TipTap, Lexical, ProseMirror)

### **Phase 3:**
- 📝 Research Avataaars API/library
- 📝 Research gamification best practices for middle school
- 📝 Research badge system design (achievement triggers, notifications)

### **Phase 4:**
- 📝 Deep dive into Yjs (CRDT) + Supabase real-time integration
- 📝 Research WebSocket vs Supabase real-time trade-offs
- 📝 Research version history implementation (diffs, rollback)

### **Phase 5:**
- 📝 Apply for Midjourney API access (if available)
- 📝 Research prompt engineering best practices
- 📝 Research image content moderation (PhotoDNA, AWS Rekognition)
- 📝 Research batch image generation optimization

### **Phase 6:**
- 📝 Research Web Speech API (TTS)
- 📝 Research PDF generation libraries (pdfkit, puppeteer)
- 📝 Research PowerPoint generation (pptxgenjs)

### **Phase 7:**
- 📝 Full WCAG 2.1 AA accessibility audit
- 📝 Performance audit (Lighthouse, Web Vitals)
- 📝 Security audit (Snyk, OWASP)

---

## ⏱️ TIME ESTIMATES

**Total Development Time:** ~300-400 hours

**Phase Breakdown:**
- Phase 0 (Setup): 10-15 hours
- Phase 1 (MVP): 60-80 hours
- Phase 2 (Advanced Content): 60-80 hours
- Phase 3 (Gamification): 40-50 hours
- Phase 4 (Collaboration): 50-60 hours
- Phase 5 (AI Enhancements): 40-50 hours
- Phase 6 (Presentation): 30-40 hours
- Phase 7 (Polish): 30-40 hours

**Timeline:**
- **Part-time (10 hrs/week):** ~30-40 weeks (7-9 months)
- **Full-time (40 hrs/week):** ~8-10 weeks (2-2.5 months)
- **Intensive (60 hrs/week):** ~5-7 weeks (1.5-2 months)

---

## 🎯 NEXT STEPS

**RIGHT NOW:**
1. ✅ Review this document with user
2. ✅ Get approval on hosting decision (Vercel + Supabase)
3. ✅ Get approval on Phase 1 feature scope
4. ⏭️ Begin Phase 0: Project Setup

**AWAITING USER INPUT:**
- Confirm hosting decision
- Approve Phase 1 feature scope
- Timeline preference (how fast to build?)
- Budget considerations (if any)

---

*Document Status: IN PROGRESS - Phase 0-1 detailed, Phases 2-7 need expansion*

---