# 🏛️ THE MYTHOLOGY CODEX - AI DEPLOYMENT CONTEXT
## Essential Context for Production Deployment & Future Development

**Document Purpose:** This document provides comprehensive context for AI assistants helping with deployment, debugging, and future development. Read this FIRST before consulting other documentation.

**Last Updated:** December 31, 2025  
**Production Status:** Ready for deployment to Vercel  
**Current Environment:** Development (localhost:3000)  
**Recent Updates:** Assignment System, Parent View, Standards Tracking, Analytics, UX Enhancements

---

## 🎯 THE BIG PICTURE: WHAT IS THIS?

### The Vision

**The Mythology Codex** is a web-based creative writing platform where **middle school students (grades 6-8, ages 11-14)** build their own original mythology universes. Think of it as "Minecraft meets Percy Jackson meets Google Docs."

Students create:
- **Gods and goddesses** with powers, domains, and personalities
- **Mythical creatures** from dragons to sea monsters
- **Epic stories** with heroes, battles, and quests
- **Interactive world maps** with sacred locations
- **Relationship networks** showing how characters connect
- **AI-generated artwork** for their creations

Teachers assign:
- **Curiosity-driven assignments** with multi-age differentiation
- **Narrative feedback** focused on growth, not just grades
- **Standards-aligned learning** with mastery tracking

Parents collaborate:
- **View children's work** with transparency into AI use
- **Provide feedback** as co-educators in homeschool model
- **Track progress** through standards mastery dashboard

### Why This Exists

This isn't just a creative writing tool. It's an **educational experience** that:

1. **Teaches narrative structure** - Students learn plot, character development, world-building
2. **Integrates academic standards** - Alaska ELA standards, Five Themes of Geography, Alaska Native cultural awareness
3. **Builds digital literacy** - Students use modern web tools, collaborate online, present work
4. **Encourages research** - Comparing mythologies, understanding cultural context
5. **Makes learning fun** - Gamification (points, badges, levels), AI battles, trading cards

### The Spirit & Feel

**This app has PERSONALITY.** It's:

- ✨ **Whimsical** - Emoji everywhere, playful UI, "Epic Worldbuilder" badges, confetti on achievements
- 🎮 **Gamified** - XP points, level-up systems, streaks, leaderboards (but friendly competition, not cutthroat)
- 🤖 **AI-Enhanced** - But AI assists, never replaces student creativity
- 🎨 **Visually Rich** - Dark mode by default, gradient backgrounds, animated battles, holographic trading cards
- 📚 **Educational but not boring** - Standards-aligned but feels like a game
- 🌊 **Alaska-Focused** - Built for Copper River region (65% Alaska Native students), but works anywhere

---

## 🏫 WHO ARE WE BUILDING FOR?

### Primary Users: Students (11-14 years old)

**Their Reality:**
- Born into TikTok, YouTube Shorts, Discord
- Attention spans shaped by rapid content
- Comfortable with AI (ChatGPT is their homework buddy)
- Love mythology (Percy Jackson, Marvel, anime)
- Struggle with writer's block
- Need scaffolding and encouragement

**What They Need:**
- **Low barrier to entry** - Wizard guides them through setup
- **Instant gratification** - See progress immediately (points, badges, images)
- **Creativity support** - AI suggests ideas when stuck
- **Voice input** - Speak instead of type (accessibility + preference)
- **Cool factor** - Trading cards, battle animations, AI art generation

### Secondary Users: Teachers

**Their Reality:**
- Managing 35-40 students per class
- Limited time for grading
- Need to justify AI use to parents/admin
- Want visibility into student work
- Must align to standards

**What They Need:**
- **Classroom management** - Easy roster, invite codes, bulk actions
- **Content moderation** - Flag inappropriate content
- **AI visibility** - See when students use AI help
- **Standards reporting** - Show how activities meet benchmarks
- **Time savers** - Auto-grading, organized submissions

### Tertiary Users: Parents

**Their Reality:**
- Concerned about AI use ("Is the computer doing my kid's homework?")
- Want to see child's work
- Need reassurance about age-appropriate content

**What They Need:**
- **Transparency** - Letters explaining AI's role
- **Portfolio access** - View child's mythology
- **Safety assurance** - Content filters, moderation

---

## 🏗️ TECHNICAL ARCHITECTURE (FOR DEPLOYMENT)

### The Stack

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│  Next.js 14 (App Router) + TypeScript + Tailwind   │
│  Deployed on: VERCEL (not Netlify!)                │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                    BACKEND                           │
│  Supabase (PostgreSQL + Auth + Storage + Realtime) │
│  21 database tables, full RLS policies             │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                  EXTERNAL APIs                       │
│  • OpenAI GPT-4 (battle narration, AI assist)      │
│  • Nano Banana / Gemini 2.5 Flash (image gen)      │
│  • DALL-E 3 (fallback image generation)            │
└─────────────────────────────────────────────────────┘
```

### Key Files & Directories

```
mythology-project/
├── app/                          # Next.js app directory
│   ├── src/
│   │   ├── app/                 # Routes (App Router)
│   │   │   ├── api/            # API endpoints
│   │   │   │   ├── ai/         # AI assistance endpoints
│   │   │   │   ├── images/     # Image generation
│   │   │   │   ├── quiz/       # Math quiz system
│   │   │   ├── student/        # Student pages
│   │   │   ├── teacher/        # Teacher pages
│   │   ├── components/         # React components
│   │   │   ├── ai/            # AI-related components
│   │   ├── lib/               # Utility libraries
│   │   │   ├── ai/            # AI client, prompts
│   │   │   ├── imageGen/      # Image generation logic
│   │   │   ├── mathQuiz/      # Quiz engine
│   │   │   ├── supabase/      # Supabase client
│   ├── .env.local             # Environment variables (CRITICAL!)
│   ├── supabase/              # Database migrations
│   │   ├── migrations/        # SQL schema files
├── docs/                       # Documentation
├── README.md                   # Main documentation
├── AI_DEPLOYMENT_CONTEXT.md   # This file (read first!)
├── PROJECT_STATUS.md          # Implementation status
└── CHANGELOG.md               # Version history
```

### Environment Variables (REQUIRED for deployment)

These MUST be set in Vercel's environment variables:

```bash
# Supabase (Database + Auth + Storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # NEVER expose to client!

# OpenAI (AI Assistance & Battle Narration)
OPENAI_API_KEY=sk-proj-...

# Gemini / Nano Banana (Primary Image Generation)
GEMINI_API_KEY=AIza...

# Optional: DALL-E (Fallback Image Generation)
DALL_E_API_KEY=sk-proj-...  # Can be same as OPENAI_API_KEY

# Optional: Dev Mode
DEV_CHEAT_SECRET=your-secret-phrase  # For bypassing token gates in dev
```

---

## 🚀 DEPLOYMENT STRATEGY

### Platform: Vercel (NOT Netlify)

**Why Vercel:**
- Built for Next.js (created by same company)
- Automatic deployments from GitHub
- Edge functions for API routes
- Environment variable management
- Preview deployments for branches
- Zero-config setup

**Why NOT Netlify:**
- Netlify is better for static sites
- Next.js App Router has issues on Netlify
- Vercel has better Next.js optimization

### Pre-Deployment Checklist

Before deploying, verify:

```bash
# 1. Build succeeds locally
cd app
npm run build

# 2. No TypeScript errors
npx tsc --noEmit

# 3. Environment variables are set
# Check .env.local has all required keys

# 4. Supabase migrations are applied
# Verify in Supabase dashboard

# 5. RLS policies are active
# Test auth flows work
```

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add -A
   git commit -m "feat: production ready"
   git push origin main
   ```

2. **Connect Vercel**
   - Go to vercel.com
   - Import from GitHub: `TheAccidentalTeacher/mythology`
   - Framework: Next.js
   - Root directory: `app`

3. **Configure Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add ALL variables from .env.local
   - Apply to Production, Preview, and Development

4. **Deploy**
   - Vercel auto-deploys on push to main
   - First build takes 5-10 minutes
   - Watch build logs for errors

### Common Deployment Errors & Fixes

#### Error: "Module not found: Can't resolve '@/lib/...'"

**Cause:** Path aliases not configured  
**Fix:** Check `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Error: "Supabase auth redirect not working"

**Cause:** Missing redirect URLs in Supabase  
**Fix:** In Supabase dashboard:
- Settings → URL Configuration
- Add: `https://your-app.vercel.app/**` to redirect URLs

#### Error: "API route returns 500: Failed to fetch"

**Cause:** Environment variables not set  
**Fix:** Verify all env vars in Vercel dashboard

#### Error: "Images not loading from Supabase Storage"

**Cause:** CORS not configured  
**Fix:** In Supabase:
- Storage → Settings → CORS
- Allow origin: `https://your-app.vercel.app`

#### Error: "Build fails with 'Cannot find module'"

**Cause:** Dependency not in package.json  
**Fix:** Run `npm install` locally, commit package-lock.json

---

## 🎨 KEY FEATURES & THEIR PURPOSE

### 1. Mythology Creation Wizard (Phase 2F)

**What It Does:** 5-step guided setup for creating a mythology universe

**Why It Matters:**
- **Reduces blank page syndrome** - Students know what to fill in
- **Teaches world-building** - Step-by-step scaffolding
- **Integrates Five Themes of Geography** - Academic standard alignment
- **Alaska Native support** - 10 Alaska cultural styles with authentic guidance

**Technical Notes:**
- Component: `MythologyWizard.tsx` (1,500+ lines)
- Uses multi-select geography builder
- AI suggests names based on cultural style
- Saves progress to localStorage
- Final step creates mythology record in DB

**Deployment Considerations:**
- Large component, watch bundle size
- AI calls require OpenAI API key
- Uses React state management (no external state library)

### 2. Voice Input System (NEW - Dec 30, 2025)

**What It Does:** Real-time speech-to-text in all text fields

**Why It Matters:**
- **Accessibility** - Students with dyslexia, typing challenges
- **Preference** - Many students prefer speaking to typing
- **Speed** - Faster content creation
- **Engagement** - Feels futuristic and cool

**Technical Notes:**
- Uses Web Speech API (Chrome/Edge only)
- `interimResults = true` shows text as they speak
- Three implementations:
  - `MythologyWizard.tsx` - Five Themes step
  - `RichTextEditor.tsx` - Story editor
  - `AIFieldHelper.tsx` - All form fields
- Pulsing animation indicates active listening
- Clears interim text when finalized

**Deployment Considerations:**
- Browser-dependent (Chrome/Edge work best)
- Requires HTTPS in production (browsers block on HTTP)
- No API costs (client-side only)

### 3. AI-Powered Name Suggestions (NEW - Dec 30, 2025)

**What It Does:** Click a category pill → get 5 contextual name suggestions

**Why It Matters:**
- **Reduces friction** - Naming is hard, especially for 12-year-olds
- **Contextual** - Names fit their mythology's theme/culture
- **Educational** - Explains what each name means
- **Not cheating** - AI suggests, student chooses

**Technical Notes:**
- Endpoint: `/api/ai/name-suggestions`
- Component: `AIInputHelper` in `AIFieldHelper.tsx`
- Uses OpenAI GPT-4 via `aiClient.request()`
- Fetches mythology context (genre, geography, five_themes)
- Returns 5 name/explanation pairs
- Categories: Storm, Fire, Water, Moon, Sun, Shadow, Wisdom, War, Love, Trickster

**Deployment Considerations:**
- Requires OpenAI API key
- ~500 tokens per request (~$0.001/call)
- No rate limiting yet (add if needed)

### 4. AI Image Generation (Phase 4A)

**What It Does:** Students earn tokens by solving math problems, then generate AI images

**Why It Matters:**
- **Visual storytelling** - Brings their characters to life
- **Math practice** - Quiz system reinforces skills
- **Motivation** - "Earn tokens to unlock cool stuff"
- **Safe AI use** - Gated access, content moderation

**Technical Notes:**
- **Math Quiz System:**
  - 20+ problem types (arithmetic, fractions, algebra, geometry)
  - SVG diagrams for coordinate plane
  - Streak tracking (5+ = 2×, 10+ = 3×, 15+ = 4× tokens)
  - Component: `MathQuizModal.tsx`
  - API: `/api/quiz/generate`, `/api/quiz/check`

- **Image Generation:**
  - Primary: Nano Banana (Gemini 2.5 Flash) - $0.039/image
  - Fallback: DALL-E 3 - $0.04-$0.12/image
  - Triple-layer safety (blocklist, pattern detection, system prompt)
  - Entity-specific prompts (characters, creatures, realms, stories)
  - Save/discard preview before finalizing

- **Access Control:**
  - Students: token-gated (earn via math)
  - Teachers/Admins: unlimited (👑 badge)
  - Dev mode: hidden cheat code (click 🎨 5× quickly)

**Deployment Considerations:**
- **CRITICAL:** Set `GEMINI_API_KEY` and `OPENAI_API_KEY`
- Images stored in Supabase Storage (check quota)
- Rate limiting: 10 images/day per student (configurable by teacher)
- Teacher can block specific math topics per classroom

### 5. Trading Cards & Collectibles (Phase 4C)

**What It Does:** Generate Pokemon-style trading cards with rarity tiers

**Why It Matters:**
- **Gamification** - Collecting is addictive and fun
- **Replayability** - Students want to collect all rarities
- **Social** - Can show off to friends
- **Motivation** - Incentive to create more characters

**Technical Notes:**
- 5 rarity tiers: Common (45%), Uncommon (25%), Rare (18%), Epic (9%), Legendary (3%)
- Holographic effects for Epic/Legendary
- Auto-calculated stats based on character type
- Component: `TradingCardGenerator.tsx`
- Gallery: `CollectionGallery.tsx`

**Deployment Considerations:**
- Uses image generation system (see above)
- Rarity rolling is weighted (explicit array order)
- Cheat mode bypasses tokens but still rolls random rarity

### 6. AI Battles (Phase 2D)

**What It Does:** Animated turn-based combat with GPT-4 narration

**Why It Matters:**
- **Engagement** - Kids LOVE battles
- **Creative writing** - GPT-4 writes epic battle stories
- **Stats teaching** - HP, ATK, DEF, SPD calculations
- **Crossovers** - Students can battle each other's mythologies

**Technical Notes:**
- Combat stats calculated by character type/danger level
- 5 battle types: Duel, Honor Combat, Ambush, Divine Contest, Tournament
- Turn-based simulation (max 50 rounds)
- Animated playback with HP bars, damage numbers, highlights
- Playback speed controls (Slow, Normal, Fast)
- GPT-4 generates 400-600 word narrative in chosen style
- Save battles to collection

**Deployment Considerations:**
- Requires OpenAI API key
- Battle narration: ~1,000 tokens per battle (~$0.01/battle)
- No rate limiting (could add if costs spike)

### 7. Stories with TipTap Editor (Phase 2A)

**What It Does:** Rich text editor for writing mythology stories

**Why It Matters:**
- **Writing practice** - Students write origin myths, legends, quests
- **Formatting tools** - Bold, italic, headings, lists, blockquotes
- **Character linking** - Tag characters mentioned in stories
- **Voice input** - Can dictate entire stories

**Technical Notes:**
- Component: `RichTextEditor.tsx`
- Library: TipTap (ProseMirror-based)
- Auto-save functionality
- Word count tracking
- Story types: origin, legend, prophecy, quest, battle, relationship
- Status: draft → in_progress → completed → published

**Deployment Considerations:**
- TipTap is client-side, no backend cost
- Stories stored as JSON in `stories.content` column
- Large stories (5,000+ words) can be slow to render

### 8. Interactive Maps with Konva.js (Phase 2B)

**What It Does:** Drag-and-drop map creation with locations, paths, regions

**Why It Matters:**
- **Visual world-building** - Maps make mythologies feel real
- **Geography integration** - Connects to academic standards
- **Creative expression** - Students design their own worlds
- **Type differentiation** - 5 map types with different rules

**Technical Notes:**
- Component: `MapCanvas.tsx` (1,200+ lines)
- Library: Konva.js (HTML5 Canvas)
- 4 marker styles: pin, circle, hex, star
- 60+ emoji icons for locations
- Path drawing with color/width/dashed options
- Region/polygon drawing
- Undo/redo system
- Grid overlay (square, hex)
- Background textures (parchment, clean, satellite)

**Map Types:**
- **World Map** (2000-2400×1500-1800px) - Continental scale
- **Regional Map** (1600-2000×1200-1500px) - Country/province
- **City/Settlement** (800-1200×600-900px) - Urban areas
- **Mystical Realm** (1000-1600×800-1200px) - Fantasy dimensions
- **Other/Custom** (800-2400×600-1800px) - Flexible

**Deployment Considerations:**
- Large canvas files (check storage limits)
- Map data stored as JSON in `maps.map_data` column
- Complex component, watch for performance issues

### 9. Gamification System (Phase 3)

**What It Does:** Points, badges, levels, streaks, leaderboards

**Why It Matters:**
- **Motivation** - Students love seeing progress
- **Competition** - Leaderboards drive engagement (but friendly!)
- **Achievement** - Badges recognize milestones
- **Retention** - Streaks encourage daily use

**Technical Notes:**
- **Points System:**
  - Character created: +50
  - Story written: +100-150 (based on length)
  - Map created: +75
  - Battle won: +30
  - Quiz solved: +5

- **Levels:**
  - Level 1: 0-100 points
  - Level 2: 100-250 points
  - Level 3: 250-500 points
  - (Exponential scaling up to Level 50)

- **Badges:**
  - 🎨 First Creation - Create first character
  - 🏆 Epic Worldbuilder - Create 10 characters
  - 📚 Storyteller - Write first story
  - 🔥 Daily Dedication - 7-day streak
  - ⚔️ Battle Champion - Win 5 battles
  - 🌟 Completionist - Finish all aspects

- **Streaks:**
  - Tracks consecutive days logged in
  - Breaks if miss a day
  - Visual indicator (🔥 emoji count)

- **Leaderboards:**
  - Scope: Classroom or Global
  - Categories: Points, Streak, Stories, Characters
  - Refreshes daily

**Deployment Considerations:**
- All stored in `profiles` table
- Daily cron job resets streaks (set up in Vercel)
- Leaderboard queries can be slow with 1000+ users (add indexing)

### 10. Assignment System (Phase 4E) 🆕

**What It Does:** Complete assignment CRUD with multi-age differentiation and narrative feedback

**Why It Matters:**
- **Homeschool Focus** - Multi-age classrooms need differentiated assignments
- **Growth Mindset** - Unlimited revisions, narrative feedback over grades
- **Parent Collaboration** - Parents view work and provide feedback
- **Standards Tracking** - Maps to CCSS and Alaska standards
- **Revolutionary Teaching** - Moves beyond traditional grading

**Technical Notes:**
- **Database Tables:**
  - `assignments` - Assignment metadata with differentiation
  - `assignment_submissions` - Student work with narrative feedback
  - `submission_history` - Revision tracking
  - `assignment_templates` - Pre-built templates (5 created)

- **Assignment Features:**
  - Multi-age targeting (min_grade_level, max_grade_level)
  - Difficulty levels JSONB (beginner, intermediate, advanced)
  - Scaffolding hints array for struggling students
  - Extension challenges array for gifted students
  - Standards array (CCSS.ELA-LITERACY.W.6.3, etc.)
  - AI feedback toggle (teacher reviews before releasing)
  - AI accuracy checking for science/history

- **Grading Philosophy:**
  - Narrative feedback focus (strengths, growth areas, next steps)
  - Grade released flag (teacher controls visibility)
  - Parent feedback field (collaborative learning)
  - Unlimited revisions (allow_revisions default: true)
  - Revision number tracking with history snapshots
  - Status workflow: not_started → in_progress → submitted → needs_revision → graded → released

- **Template System:**
  - 5 pre-built templates (mythology_basics, science, civics, math, ela)
  - Filter by category and difficulty
  - "Use This Template" button auto-fills creation form
  - Grade level range indicators

- **Student View:**
  - Assignment dashboard with status badges
  - Submit mythology link or text
  - View narrative feedback (only after teacher releases)
  - Revise and resubmit unlimited times

**Deployment Considerations:**
- Migration: `014_assignments.sql`
- RLS policies for teacher/student/parent access
- Parent RLS uses classroom_id to find children
- AI feedback requires OpenAI API key
- Template seeding happens in migration

### 11. Parent View (Phase 4F) 🆕

**What It Does:** Parent dashboard showing all children's work with feedback capability

**Why It Matters:**
- **Homeschool Collaboration** - Parents as co-educators, not surveillance
- **Transparency** - Parents see exactly what their child is learning
- **Involvement** - Parents can add feedback to support learning
- **Trust** - Shows responsible AI use and educational rigor

**Technical Notes:**
- **Routes:**
  - `/parent/dashboard` - View all children with stats
  - `/parent/child/[childId]/assignments` - Child's assignment list
  - `/parent/child/[childId]/assignment/[assignmentId]` - View work & add feedback

- **Features:**
  - Multi-student support (shows all children in household)
  - Quick stats: assignments, completion rate, average score
  - View child's submission (mythology link or text)
  - Read teacher feedback (narrative, strengths, growth areas)
  - See grade (only if teacher released it)
  - Add parent feedback in dedicated field (parent_feedback column)

- **Access Control:**
  - Parents can only see children in same classroom
  - RLS policy checks classroom_id
  - Parent can update parent_feedback but not grade/teacher feedback
  - Parent cannot see AI suggestions (teacher-only)

**Deployment Considerations:**
- Uses existing `assignment_submissions` table
- No new migrations needed
- Parent role already exists in profiles
- Encourages family discussion about learning

### 12. Standards Tracking (Phase 4G) 🆕

**What It Does:** Student-facing mastery dashboard aggregating standards from all assignments

**Why It Matters:**
- **Standards Without Obsession** - Growth over grades mentality
- **Self-Awareness** - Students see their own progress
- **Support Identification** - Helps identify areas needing practice
- **Accountability** - Shows educational value of mythology creation

**Technical Notes:**
- **Route:** `/teacher/standards` (also accessible to students for own data)

- **Data Source:**
  - Aggregates `standards_mastery` JSONB from `assignment_submissions`
  - Format: `{standard_code: mastery_percentage}`
  - Example: `{"CCSS.ELA-LITERACY.W.6.3": 87}`

- **Mastery Levels:**
  - 🟢 Mastered (90-100%) - Green
  - 🔵 Proficient (75-89%) - Blue
  - 🟡 Developing (60-74%) - Yellow
  - 🔴 Beginning (<60%) - Red

- **Features:**
  - Filter by category (ELA, Math, Science, Social Studies, Other)
  - Category auto-detected from standard code prefix
  - Progress bars showing percentage
  - Assignment count per standard (how many times practiced)
  - Expandable cards showing standard code and description

- **Standard Format:**
  - Supports CCSS: `CCSS.ELA-LITERACY.W.6.3`
  - Supports Alaska: `AK.SS.5.THEME.2`
  - Graceful handling of custom standards

**Deployment Considerations:**
- Uses existing `assignment_submissions.standards_mastery` field
- Teacher sets mastery level when grading
- No additional API calls or costs
- Client-side aggregation and filtering

### 13. Analytics Dashboard (Phase 4G) 🆕

**What It Does:** Teacher analytics with metrics, activity feed, and automated insights

**Why It Matters:**
- **Data-Driven Teaching** - Identify trends and patterns
- **Early Intervention** - Spot students needing support
- **Reflection** - Encourage positive teaching practices
- **Growth Mindset** - Focus on progress, not judgment

**Technical Notes:**
- **Route:** `/teacher/analytics`

- **Metrics Displayed:**
  - Total assignments created
  - Completion rate percentage (submitted/total)
  - Average score across all graded work
  - Revision rate (percentage of work revised)
  - Students with work vs total student count
  - Total submissions vs graded submissions

- **Recent Activity Feed:**
  - Last 10 assignment submissions
  - Shows: student name, assignment title, date, status
  - Status badges: submitted, needs_revision, graded, released
  - Click to navigate to submission

- **Automated Insights:**
  - AI-generated observations based on data patterns
  - Examples:
    - "Students revising 40% of work - excellent growth mindset!"
    - "Assignment X has only 25% completion"
    - "3 students ready for feedback on recent work"
    - "Class averaging 87% on narrative writing standards!"
    - "5 students haven't submitted in 7+ days"
  
- **Philosophy:**
  - Analytics support reflection, not judgment
  - No punitive metrics (no "failing student" counts)
  - Insights praise positive behaviors
  - Data helps identify support needs

**Deployment Considerations:**
- Queries `assignments` and `assignment_submissions` tables
- Client-side calculation of metrics
- Insights are hardcoded rules (not AI-generated yet)
- Future: Could integrate GPT-4 for dynamic insights

### 14. UX Enhancements - Animated Progress Meter (Phase 4H) 🆕

**What It Does:** Visual progress bar in Mythology Wizard showing journey through 5 steps

**Why It Matters:**
- **User Feedback** - Real user (Anna Somers) found wizard overwhelming without progress indicator
- **Psychological** - Visual progress makes multi-step process feel achievable
- **Engagement** - Fun animations keep students motivated
- **Clarity** - Always know "where am I" in the journey

**Technical Notes:**
- **Location:** Bottom of `MythologyWizard.tsx` modal

- **Visual Elements:**
  - Progress bar filling left-to-right (0% → 20% → 40% → 60% → 80% → 100%)
  - Shimmer effect flowing across filled portion
  - Step markers positioned along bar:
    - ✅ Green checkmarks for completed steps
    - ⭐ Sparkles for current step (pulsing glow)
    - Gray dots for future steps
  - Large percentage display (animated counting)
  - Current step badge with icon and name
  - "X steps remaining" counter
  - "Almost there!" celebration on final step

- **Animations:**
  - Spring physics for smooth bar filling (Framer Motion)
  - Pulsing glow on current step marker
  - Celebration particles float up when completing steps
  - Shimmer continuously flows (2s loop)

- **5 Steps Tracked:**
  1. Category - Choose mythology type
  2. Geography - Define physical world
  3. Five Themes - Geography interview
  4. Name - Name your mythology
  5. Preview - Final review

**Deployment Considerations:**
- Uses Framer Motion (already imported)
- No additional dependencies
- Purely client-side animation
- Addresses user feedback from dogfooding session
- Makes 5-step process feel like achievable journey

---

## 🎓 EDUCATIONAL PHILOSOPHY & VALUE

### The "Extended Mind" Approach to AI

**Core Principle:** AI should not write the mythology, but AI should help students write the mythology.

**How We Implement This:**

1. **AI Suggests, Student Chooses**
   - Name suggestions: AI offers 5 options, student picks or ignores
   - Story ideas: AI asks questions, student answers
   - Grammar: AI marks issues, student fixes

2. **Scaffolding, Not Completion**
   - Wizard guides setup, doesn't auto-fill
   - Prompts ask probing questions
   - Help buttons show examples, not templates

3. **Transparent AI Use**
   - Teacher dashboard shows AI usage
   - Students know when they're using AI
   - Parents receive letters explaining AI's role

4. **Token-Gating Creative AI**
   - Image generation requires math quiz
   - Teaches "AI costs resources"
   - Limits over-reliance

### Academic Standards Alignment

**Alaska ELA Standards (Common Core):**
- **CCSS.ELA-LITERACY.W.6-8.3** - Narrative writing
- **CCSS.ELA-LITERACY.W.6-8.4** - Clear, coherent writing
- **CCSS.ELA-LITERACY.W.6-8.5** - Planning, revising, editing
- **CCSS.ELA-LITERACY.SL.6-8.5** - Multimedia presentations

**Alaska Social Studies - Five Themes of Geography:**
- **Location** - Absolute and relative positioning
- **Place** - Physical and human characteristics
- **Human-Environment Interaction** - How people adapt/modify
- **Movement** - People, goods, ideas
- **Regions** - Areas with common features

**Alaska Cultural Standards:**
- **A1** - Culturally-knowledgeable students are grounded in cultural heritage
- **E5** - Students create innovative solutions using local knowledge
- **E7** - Students use technology to strengthen connections

**Alaska Math Standards:**
- Math quiz system covers:
  - Arithmetic (addition, subtraction, multiplication, division)
  - Fractions (simple, adding, decimals, percentages)
  - Algebra (simple equations, linear, order of operations)
  - Geometry (perimeter, area, angles, coordinate plane)
  - Word problems

### Learning Outcomes

By using this platform, students will:

1. **Develop Narrative Skills**
   - Plot structure (beginning, middle, end)
   - Character development (backstory, motivation, growth)
   - World-building (consistent rules, interconnected elements)
   - Dialogue writing (character voice)

2. **Practice Research**
   - Compare mythologies (Greek vs Norse vs Egyptian)
   - Understand cultural context
   - Apply Five Themes of Geography
   - Learn Alaska Native traditions

3. **Build Digital Literacy**
   - Create multimedia content
   - Collaborate online
   - Present work digitally
   - Use AI responsibly

4. **Strengthen Writing**
   - Grammar and mechanics
   - Revision and editing
   - Peer feedback
   - Portfolio development

5. **Exercise Creativity**
   - Original character design
   - Unique mythology creation
   - Visual storytelling
   - Cross-mythology collaboration

---

## 🛡️ CONTENT SAFETY & MODERATION

### Why This Matters

**Context:** 11-14 year olds creating content, AI generating images, student collaboration.

**Risks:**
- Inappropriate language in stories
- Violent/sexual content
- Bullying via crossover battles
- AI generating unsafe images
- Plagiarism (copying from Percy Jackson)

### Safety Systems

#### 1. Triple-Layer Image Safety

**Layer 1: Blocklist**
- Hard-blocked explicit terms
- Checked before AI generation
- File: `safetyFilter.ts`

**Layer 2: Pattern Detection**
- AI scans prompt for concerning content
- Looks for: violence, sexual, hateful, self-harm
- Rejects before image generation

**Layer 3: System Prompt Wrapper**
- Enforces age-appropriate output
- No text/words in images
- Family-friendly, educational tone

#### 2. Teacher Content Moderation

**Features:**
- Visibility controls (public, teacher-only, hidden)
- Flag inappropriate content
- Review queue for teacher
- Bulk actions (approve all, hide all)
- Moderation log

#### 3. Student Account Safety

**Features:**
- Classroom-scoped (students only see classmates)
- No direct messaging
- No profile pictures (custom avatars only)
- Parent access to portfolios

### Deployment Considerations

- **OpenAI Moderation API** integration planned (not yet implemented)
- **Profanity filter** for text content (TODO)
- **Image moderation** dashboard for teachers (implemented)
- **Reporting system** for students (TODO)

---

## 🎪 THE FUN FACTOR: WHAT MAKES THIS SPECIAL

### It's Not Just Another Writing App

**Comparable Products:**
- Google Docs - Too plain, no fun
- StoryJumper - Too young (elementary)
- Wattpad - Too social (teen drama)
- NaNoWriMo - Too intense (adult writers)

**What Makes Us Different:**
- 🎮 **Gamified** - Points, badges, levels, leaderboards
- 🤖 **AI-Enhanced** - But ethical and educational
- 🎨 **Visual** - Images, maps, trading cards, animations
- ⚔️ **Interactive** - Battles, crossovers, collaboration
- 🏫 **Educational** - Standards-aligned, teacher-friendly
- 🌊 **Culturally Aware** - Alaska Native support

### The Whimsy & Personality

**Examples:**
- **Confetti celebration** when you answer math correctly
- **Holographic shimmer** on legendary trading cards
- **"You're on fire!"** 🔥 messages for quiz streaks
- **Epic battle animations** with damage popups 💥
- **"AI is busy!"** error messages (not boring "500 error")
- **Emoji everywhere** - 🏛️ for mythologies, 🎨 for image gen, 👑 for teachers

**Tone:**
- Encouraging, never judgmental
- Celebrates creativity over perfection
- Makes learning feel like playing
- Serious about education, playful about delivery

### Student Testimonials (Anticipated)

*"I never liked writing but this is actually fun!"*  
*"I made my character into a trading card and it's LEGENDARY!"*  
*"The AI helped me think of a cool name but I wrote the whole story myself."*  
*"My teacher said my mythology was college-level!"*

---

## 🚨 DEPLOYMENT TROUBLESHOOTING GUIDE

### Context Loss Prevention

**Problem:** After 2 hours of deployment debugging, you lose context.

**Solution:** This document! But also:

1. **Keep a Deployment Log**
   - In VS Code, open a scratch file: `deployment-log.md`
   - Record each error and solution
   - Paste full error messages

2. **Check These Common Issues First**

```bash
# 1. Environment Variables
# Run in Vercel CLI:
vercel env pull

# 2. Build Logs
# Check Vercel dashboard → Deployments → Latest → Build Logs

# 3. Function Logs
# Check Vercel dashboard → Deployments → Latest → Function Logs

# 4. Database Connection
# Test Supabase connection:
curl https://your-project.supabase.co/rest/v1/profiles

# 5. API Routes
# Test each endpoint:
curl https://your-app.vercel.app/api/ai/assist
```

3. **Load This Document Into AI First**
   ```
   User: "I need help deploying to Vercel. First, read 
   AI_DEPLOYMENT_CONTEXT.md in full, then help me debug."
   ```

### Common Deployment Issues Reference

#### Issue: Build Timeout (>10 minutes)

**Symptoms:**
- Vercel shows "Build Timeout Exceeded"
- Logs show hanging on package installation

**Causes:**
- Large dependencies (Konva, TipTap, Cytoscape)
- Slow npm registry
- Build tasks running twice

**Solutions:**
1. Use `npm ci` instead of `npm install` in build command
2. Remove unused dependencies
3. Check for duplicate packages: `npm dedupe`

#### Issue: API Routes Return 404 in Production

**Symptoms:**
- Routes work locally: `http://localhost:3000/api/ai/assist`
- Routes fail in production: `https://app.vercel.app/api/ai/assist`

**Causes:**
- File naming mismatch (case sensitivity)
- Missing `route.ts` export
- Incorrect directory structure

**Solutions:**
1. Verify file is named `route.ts` (not `Route.ts`)
2. Verify export: `export async function POST(request: NextRequest) {...}`
3. Check directory: `app/src/app/api/ai/assist/route.ts`

#### Issue: Supabase RLS Denies Access

**Symptoms:**
- Frontend shows "Unauthorized" or "Forbidden"
- API logs show "new row violates row-level security policy"

**Causes:**
- RLS policies too restrictive
- Auth token not being sent
- Service role key not used for admin operations

**Solutions:**
1. Check RLS policies in Supabase dashboard
2. Verify auth middleware is running
3. Use `createClient()` from `@/lib/supabase/server` for API routes
4. For admin operations, use service role key

#### Issue: Images Not Loading

**Symptoms:**
- Image URLs return 403 Forbidden
- CORS errors in browser console

**Causes:**
- CORS not configured in Supabase Storage
- Image bucket not public
- Invalid storage URLs

**Solutions:**
1. Supabase → Storage → Buckets → Make public
2. Add CORS rules:
   ```json
   [
     {
       "origin": "https://your-app.vercel.app",
       "methods": ["GET", "HEAD"],
       "headers": ["*"]
     }
   ]
   ```
3. Update next.config.ts with remote patterns

#### Issue: Environment Variables Not Working

**Symptoms:**
- `process.env.OPENAI_API_KEY` is undefined
- API calls fail with "Missing API key"

**Causes:**
- Env vars not set in Vercel
- Wrong environment (Production vs Preview vs Development)
- Client vs Server confusion (NEXT_PUBLIC_ prefix)

**Solutions:**
1. Vercel → Settings → Environment Variables
2. Add to ALL environments (Production, Preview, Development)
3. Redeploy after adding env vars
4. Use `NEXT_PUBLIC_` prefix for client-side vars
5. NEVER expose secret keys client-side

#### Issue: Database Migrations Not Applied

**Symptoms:**
- Tables don't exist in production
- Queries fail with "relation does not exist"

**Causes:**
- Migrations not run on production database
- Wrong Supabase project (dev vs prod)

**Solutions:**
1. Supabase → SQL Editor → Run migrations manually
2. Or use Supabase CLI:
   ```bash
   npx supabase db push --project-ref your-prod-ref
   ```
3. Verify tables exist:
   ```bash
   npx supabase db dump --project-ref your-prod-ref
   ```

---

## 📊 MONITORING & MAINTENANCE

### What to Monitor Post-Deployment

1. **API Costs**
   - OpenAI usage: Check dashboard monthly
   - Gemini usage: Check Google Cloud billing
   - Target: <$50/month for 100 active students

2. **Error Rates**
   - Vercel analytics: Track 500 errors
   - Supabase logs: Track failed queries
   - Target: <1% error rate

3. **Performance**
   - Vercel speed insights: Track load times
   - Target: <3s initial page load

4. **Storage**
   - Supabase storage quota: Check monthly
   - Images can grow quickly (100MB per student)
   - Target: <10GB total

5. **User Activity**
   - Active students per day
   - Average time on site
   - Mythologies created per week

### Maintenance Tasks

**Weekly:**
- [ ] Check error logs
- [ ] Review flagged content
- [ ] Check API costs

**Monthly:**
- [ ] Database backup
- [ ] Storage cleanup (delete unused images)
- [ ] Review and respond to teacher feedback

**Quarterly:**
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization

---

## 🎯 QUICK START FOR AI ASSISTANTS

### When You're Asked to Help with Deployment

1. **First, read this entire document** (you're doing it now!)

2. **Ask clarifying questions:**
   - "Are you deploying for the first time or debugging an existing deployment?"
   - "What error message are you seeing?"
   - "Can you share the build logs?"

3. **Check the basics:**
   - Are environment variables set?
   - Is the build succeeding locally?
   - Are migrations applied to production DB?

4. **Reference these docs:**
   - This file: Big picture, deployment strategy
   - `README.md`: Feature list, quick start
   - `PROJECT_STATUS.md`: Implementation status
   - `CHANGELOG.md`: Recent changes
   - `docs/TROUBLESHOOTING.md`: Specific error fixes

5. **Maintain context:**
   - Keep deployment log as you work
   - Summarize progress every 30 minutes
   - When close to token limit, suggest creating a checkpoint

### When Context is Lost Mid-Deployment

If the conversation resets:

1. **User should say:**
   *"We're deploying The Mythology Codex to Vercel. Read AI_DEPLOYMENT_CONTEXT.md first. We were debugging [SPECIFIC ERROR]. Here's our deployment log so far: [PASTE LOG]."*

2. **You should:**
   - Read this document
   - Review deployment log
   - Identify where we left off
   - Continue from that point

---

## 🌟 THE VISION: WHERE WE'RE GOING

### Current State (December 31, 2025)

**Implemented (98%):**
- ✅ Core mythology creation
- ✅ Characters, creatures, stories, maps
- ✅ AI assistance (name suggestions, help buttons, voice input)
- ✅ Image generation (math quiz, trading cards, creative exports)
- ✅ Battles and crossovers
- ✅ Gamification (points, badges, levels)
- ✅ Teacher tools (classroom management, moderation)
- ✅ Assignment system (CRUD, differentiation, templates, narrative feedback)
- ✅ Parent view (collaborative feedback, transparency)
- ✅ Standards tracking (mastery dashboard)
- ✅ Analytics dashboard (metrics, insights, activity feed)
- ✅ UX enhancements (animated progress meter)

**Ready for Production:**
- All features stable
- Documentation complete and updated
- Test data exists (Oceanborn Legends - 87 entities)
- 115 test student accounts
- Security measures in place
- Assignment system tested and working
- Parent view enables homeschool collaboration
- Standards tracking without obsession
- Analytics support reflection, not judgment

### Near-Term Goals (Next 3 Months)

1. **Beta Testing**
   - Deploy to Vercel
   - Invite 1 classroom (35 students)
   - Gather feedback
   - Fix critical bugs

2. **Community Features (Phase 4E)**
   - Featured mythology showcase
   - Share images publicly
   - Mythology of the week
   - Student spotlights

3. **Polish (Phase 7)**
   - Accessibility audit (WCAG 2.1 AA)
   - Performance optimization
   - Mobile responsive fixes
   - Teacher onboarding videos

### Long-Term Vision (6-12 Months)

1. **Collaboration Features (Phase 5)**
   - Real-time co-editing (Yjs CRDT)
   - Chat system
   - Group mythologies

2. **Presentation Features (Phase 6)**
   - Text-to-speech
   - Audio recording
   - Slideshow exports
   - Portfolio PDFs

3. **Scale to Multiple Schools**
   - 500+ students
   - 10+ teachers
   - District-level dashboards
   - Curriculum guides

### The Dream (2-5 Years)

- **National Adoption** - Used in schools across Alaska, then US
- **Mythology Olympics** - Inter-school competitions
- **Published Works** - Students' mythologies become books
- **Museum Exhibits** - Physical displays of student art
- **AI Evolution** - GPT-5, better image generation, voice cloning for character narration

---

## 💡 FINAL NOTES FOR AI ASSISTANTS

### The Spirit of This Project

This isn't just code. It's:
- A love letter to creative writing
- A tool for Alaska Native students to tell their stories
- A safe space for middle schoolers to experiment with AI
- A teacher's assistant that saves hours of grading
- A proof that education can be fun

### Working with the Creator

**The Teacher (User):**
- Passionate about education
- Alaska-based (Copper River region)
- Comfortable with AI but not a developer
- Wants students to love learning
- Cares deeply about cultural authenticity

**Communication Style:**
- Prefers thoroughness over brevity
- Wants to understand "why" not just "how"
- Values context and documentation
- Appreciates humor and personality

### Success Criteria

You'll know deployment is successful when:
- ✅ Site loads at `https://[app].vercel.app`
- ✅ Teacher can create classroom
- ✅ Student can sign up with invite code
- ✅ Student can create mythology through wizard
- ✅ Student can create character and creature
- ✅ Student can solve math quiz and generate image
- ✅ Student can write story with voice input
- ✅ Student can battle AI opponent
- ✅ No errors in Vercel logs
- ✅ No API errors in browser console

---

## 📚 DOCUMENT REVISION HISTORY

| Date | Version | Changes |
|------|---------|---------|
| Dec 30, 2025 | 1.0 | Initial creation for production deployment |

---

**END OF AI DEPLOYMENT CONTEXT DOCUMENT**

*Next: Read [README.md](README.md) for detailed feature documentation*
