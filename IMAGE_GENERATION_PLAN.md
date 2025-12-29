# 🎨 AI Image Generation Feature Plan

## Overview
Allow students to generate AI images for their mythology entities (characters, creatures, realms, stories, mythologies) to bring their creations to life.

## ✅ Implementation Status

### Phase A: Core System (COMPLETE)
- [x] Math Quiz TypeScript Module (`app/src/lib/mathQuiz/`)
  - [x] `types.ts` - Quiz interfaces and constants
  - [x] `mathTypes.ts` - 20+ problem generators with SVG diagrams
  - [x] `quizEngine.ts` - Session management, streak tracking
- [x] Image Generation Module (`app/src/lib/imageGen/`)
  - [x] `types.ts` - Types, style presets, blocked terms
  - [x] `safetyFilter.ts` - Triple-layer safety system
  - [x] `promptBuilder.ts` - Prompt builders for all entity types + bonus features
  - [x] `nanobanana.ts` - Gemini + DALL-E fallback client
- [x] API Routes
  - [x] `/api/quiz/generate` - Generate quiz problems
  - [x] `/api/quiz/check` - Check answers, award tokens
  - [x] `/api/images/generate` - Generate images (POST) + get stats (GET)
  - [x] `/api/images/gallery` - User's image gallery
  - [x] `/api/images/moderate` - Teacher moderation
  - [x] `/api/classroom/image-settings` - Teacher settings management
- [x] Database Migration (`supabase/migrations/011_image_generation.sql`)
  - [x] `quiz_attempts` table
  - [x] `generated_images` table
  - [x] `classroom_image_settings` table
  - [x] `moderation_log` table
  - [x] Profile columns for tokens/streaks
  - [x] RLS policies
- [x] React Components
  - [x] `MathQuizModal.tsx` - Quiz interface with confetti
  - [x] `ImageGenModal.tsx` - Image generation UI
  - [x] `ImageGenButton.tsx` - Reusable button component
  - [x] `ImageGallery.tsx` - User image gallery
  - [x] `TeacherImageModeration.tsx` - Moderation dashboard
  - [x] `TeacherImageSettings.tsx` - Settings configuration

### Phase B: Battle Integration (COMPLETE)
- [x] Battle scene image generation
- [x] Victory/defeat cards
- [x] 5-click cheat code for dev testing

### Phase C: Collectibles (COMPLETE)
- [x] Trading card generator with 5 rarity tiers (Common 45%, Uncommon 25%, Rare 18%, Epic 9%, Legendary 3%)
- [x] Character stat cards with auto-calculated stats based on entity type
- [x] Collection gallery with filtering and sorting
- [x] 5-click cheat code for dev testing (bypasses tokens, still rolls random rarity)
- [x] Integration into character, creature, and story pages
- [x] Collection page with filtering and sorting
- [x] Holographic effects for Epic/Legendary cards
- [x] Rarity-specific card border colors and designs

### Phase D: Creative Exports (COMPLETE)
- [x] Comic strip generator (3-panel strips from stories)
- [x] Prophecy scroll generator (ancient scroll-style imagery)
- [x] Realm postcard generator ("Greetings from [Realm]" tourism postcards)
- [x] Wanted poster generator (CSS text overlay - AI generates portrait only)
- [x] 5-click cheat code for dev testing
- [x] Realm postcard integrated in 3 locations:
  - [x] Realm detail page (`/student/mythology/[id]/realm/[realmId]`)
  - [x] Character pages (domain postcards using geography_connection)
  - [x] Creature pages (habitat postcards)
- [x] Realms now clickable from mythology overview page
- [x] New realm detail page with full features (ImageGenPanel, ImageGallery, geography/inhabitants/dangers)

### Phase E: Community Features (PENDING)
- [ ] Image sharing between classrooms
- [ ] Featured image showcase
- [ ] Print-ready exports

### Phase F: Games/Polish (PENDING)
- [ ] Mini-games with generated images
- [ ] Achievement badges
- [ ] Character evolution timelines

---

---

## 🍌 Image Generation Service

### Primary Service: Google Nano Banana (Gemini 2.5 Flash Image)
| Feature | Details |
|---------|---------|
| Model ID | `gemini-2.5-flash-image` |
| **Price** | **$0.039 per image** |
| Resolution | Up to 1024×1024 |
| Speed | Optimized for high-volume, low-latency |
| Safety | Built-in child safety, SynthID watermarking |

### Why Nano Banana?
- Cheapest option ($0.039 vs DALL-E's $0.04-$0.12)
- Built-in safety evaluations including child safety
- SynthID invisible watermark on all images (accountability)
- Same API as text Gemini (easy integration)
- High throughput for classroom loads

### Cost Estimate
- Class of 30 students × 10 images each = **$11.70 total**

### Fallback Options
- DALL-E 3 as backup if Nano Banana is down
- Imagen 4 Fast ($0.02) for even cheaper option

---

## 🛡️ Safety System (Triple-Layer)

### Layer 1: Input Filtering (Before Generation)
- **Blocklist**: Hard-blocked words (nudity, explicit terms, drug references, slurs, etc.)
- **Pattern Detection**: AI scans prompt for concerning patterns even without exact words
- **Age-Appropriate Rewriting**: If student writes something borderline, AI rewrites it safely

**Behavior on Block**: 
- Rejected with friendly message ("Let's try a different description!")
- Logged for teacher review
- NOT silently rewritten (transparency)

### Layer 2: Generation Settings
- Use Gemini's built-in safety settings (child safety enabled)
- Force "illustrated/artistic" style (not photorealistic)
- Prepend system instructions:
  ```
  "Create a child-friendly, illustrated mythology image suitable for 
  elementary students. Style: [student's chosen style]. 
  No gore, no nudity, no drugs, no explicit content."
  ```

### Layer 3: Output Review
- **AI Review**: After generation, scan image with Gemini Vision to detect inappropriate content
- **Auto-Flag**: Questionable images flagged for teacher review before student sees them
- **Teacher Dashboard**: All images visible to teacher at all times

### Violence Boundaries

**ALLOWED ✅**
- Weapons (swords, spears, bows, guns, bombs)
- Monsters with fangs, claws, scary features
- Battle scenes (warriors fighting)
- Danger/tension (character facing a monster)
- Blood (minimal, stylized - like a scratch)
- Dark/scary atmospheres
- Skeletons/skulls (common in mythology)

**BLOCKED 🚫**
- Graphic wounds/gore (exposed organs, dismemberment)
- Death scenes (bodies, dying characters)
- Torture/suffering
- Realistic blood pools
- Execution scenes
- Nudity of any kind
- Drug use/references
- Slurs/hate symbols

**GREY ZONE ⚠️ (Flag for Teacher)**
- Characters in chains (context-dependent)
- War aftermath scenes
- Anything the AI is uncertain about

---

## 👨‍🏫 Teacher Controls

| Control | Description |
|---------|-------------|
| **View All Images** | Gallery of every image generated by any student |
| **Delete Any Image** | Remove inappropriate images immediately |
| **Disable Per Student** | Turn off image generation for specific students |
| **Disable Class-Wide** | Kill switch for entire class |
| **Token Management** | Adjust free images / quiz questions needed |
| **Prompt Visibility** | See what prompts students used |
| **Pending Queue** | Optional: Require approval before images show |
| **Math Topic Control** | Disable specific math topics per student (prevent gaming) |

### Teacher Can Also:
- Generate images themselves (for demonstrations)
- Pre-generate "approved" images for entities
- Set daily limit (default: 3 images/day to encourage daily return)

---

## 🔄 Daily Engagement System

### Daily Image Cap: 3 per student
**Purpose**: Encourage students to return daily rather than binge-generate

**How it works:**
- Student can generate up to 3 images per day
- Resets at midnight (or teacher-configured time)
- Tokens still required for each image
- Teacher can adjust limit per student or class
- Teacher can grant "bonus" images for special occasions

**UI Messaging:**
- "You have 2 image generations left today!"
- "Come back tomorrow for 3 more! 🎨"
- Teacher override: "Ms. Johnson granted you 2 bonus images!"

---

## 🧮 Math Quiz Token System

### Token Economy
- **First 5 images**: FREE (no quiz required)
- **After that**: Earn tokens via math quizzes
- **Exchange Rate**: 3 correct answers = 1 image token (teacher configurable)

### Streak Bonuses
| Streak | Bonus |
|--------|-------|
| 5 correct in a row | 2 tokens instead of 1 |
| 10 correct in a row | 3 tokens instead of 1 |
| 15+ correct in a row | 4 tokens instead of 1 |

### Quiz Settings
- **Time Limit**: None (untimed)
- **XP System**: Ignored (not used)
- **Visual Diagrams**: Keep all SVG diagrams
- **Storage**: All quiz results stored in database

### Teacher Math Controls
- Enable/disable specific math topics per student
- Example: If Bobby is gaming system with single-digit addition, teacher can disable `addition-single` for Bobby
- Set grade level filtering
- Configure questions-per-token ratio

### 33 Available Math Types
From existing `mathTypes.js`:

**Elementary ⭐**
- `mult-1-12` - Multiplication 1-12
- `addition-single` - Single Digit Addition  
- `subtraction-basic` - Basic Subtraction

**Middle School ⭐⭐**
- `addition-double` - Double Digit Addition
- `division-basic` - Basic Division

**Advanced Middle ⭐⭐⭐**
- `mult-2x1` - 2×1 Multiplication
- `mult-2x2` - 2×2 Multiplication
- `fractions-basic` - Basic Fractions

**6th Grade**
- `parallelogram-area` - Parallelogram Area
- `triangle-area` - Triangle Area
- `decimals-operations` - Decimal Operations
- `ratio-concepts` - Ratio Concepts
- `percent-basics` - Percent Basics
- `solve-equations` - Solving Equations
- `coordinate-plane` - Coordinate Plane
- `division-fractions` - Division with Fractions
- `unit-rates` - Unit Rates
- `integers-operations` - Integer Operations
- `order-of-operations` - Order of Operations
- `absolute-value` - Absolute Value
- `exponents` - Exponents
- `gcf-lcm` - GCF & LCM
- `algebraic-expressions` - Algebraic Expressions
- `equivalent-expressions` - Equivalent Expressions
- `surface-area` - Surface Area
- `volume-fractions` - Volume with Fractions
- `variable-relationships` - Variable Relationships
- `inequalities` - Inequalities
- `coordinate-problems` - Coordinate Problems
- `mean-mad` - Mean & MAD

**High School ⭐⭐⭐⭐⭐**
- `algebra-linear` - Linear Equations
- `geometry-area` - Geometry Area & Perimeter
- `geometry-proofs` - Geometry Proofs

---

## 🎨 Prompt Strategy (Hybrid Approach)

### Step 1: Auto-Generate Base Prompt
When student clicks "Generate Image" on an entity (e.g., their creature "Frostfang the Ice Wolf"), system builds:
```
"Frostfang the Ice Wolf, a massive white wolf with icy blue eyes 
and frost-covered fur, from Alaska Native mythology, 
in an illustrated children's book style"
```

### Step 2: Student Modifications
Student sees the prompt and can:
- ✅ **Generate as-is** (one click)
- ✏️ **Add details**: "Make him howling at the northern lights"
- 🎨 **Pick a style** from presets

### Step 3: Safety Filtering
Student additions run through Layer 1 safety filter

### Style Presets
- Illustrated storybook
- Watercolor painting
- Ancient stone carving
- Comic book style
- Pixel art
- Oil painting
- Cave painting
- Anime/manga style

### Student Restrictions
- Students can ADD to prompts, but NOT DELETE safety words
- All additions filtered through blocklist
- Maximum addition length: 100 characters

---

## 🖼️ UI/UX Design

### Entity Detail Page (Before Image)
```
┌─────────────────────────────────────────┐
│  🐺 FROSTFANG THE ICE WOLF              │
│  ─────────────────────────────          │
│  Type: Creature                         │
│  Origin: Alaska Native (Inupiaq)        │
│  Description: A massive wolf...         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │    [No image yet]               │    │
│  │                                 │    │
│  │    🎨 Generate Image            │    │
│  │    (4 tokens remaining)         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Edit] [Delete] [Add to Story]         │
└─────────────────────────────────────────┘
```

### Entity Detail Page (After Image)
```
│  ┌─────────────────────────────────┐    │
│  │    [Generated Wolf Image]       │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│  🎨 Regenerate  |  ⬇️ Download  |  🗑️   │
```

### Image Generation Modal Flow
1. Show auto-generated prompt
2. Let student add details (optional)
3. Let student pick style preset
4. Show token cost (1 token)
5. Generate button
6. Loading state with fun mythology facts
7. Display result with approve/regenerate options

### Gallery Features
- Students can generate MULTIPLE images per entity
- Gallery shows all generated images
- Student picks "featured" image for entity
- Download option: PNG format, with subtle watermark

---

## 💾 Database Schema

### New Tables/Fields Needed

```prisma
// Add to User model
model User {
  // ... existing fields
  imageTokens        Int      @default(5)  // Start with 5 free
  totalImagesGenerated Int    @default(0)
  quizStreak         Int      @default(0)
  
  // Relations
  generatedImages    GeneratedImage[]
  quizAttempts       QuizAttempt[]
  disabledMathTopics String[] // Topics disabled by teacher for this student
}

// New model for generated images
model GeneratedImage {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  
  entityType    String   // 'character', 'creature', 'realm', 'story', 'mythology'
  entityId      String   // ID of the entity this image is for
  
  prompt        String   // Full prompt used
  studentAddition String? // What the student added
  stylePreset   String   // Which style was used
  
  imageUrl      String   // Stored image URL
  thumbnailUrl  String?  // Smaller version
  
  status        String   @default("approved") // 'approved', 'pending', 'rejected'
  flaggedReason String?  // If flagged, why
  
  isFeatured    Boolean  @default(false) // Is this the entity's main image?
  
  createdAt     DateTime @default(now())
  reviewedAt    DateTime?
  reviewedBy    String?  // Teacher who reviewed
}

// New model for quiz attempts
model QuizAttempt {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  
  mathType      String   // Which math type
  problem       String   // The problem text
  userAnswer    String   // What they answered
  correctAnswer String   // Correct answer
  isCorrect     Boolean
  
  tokensEarned  Int      @default(0) // Tokens earned from this answer
  streakAtTime  Int      // Their streak when answering
  
  createdAt     DateTime @default(now())
}

// Teacher settings for image generation
model ClassImageSettings {
  id                 String   @id @default(cuid())
  classId            String   @unique
  class              Class    @relation(fields: [classId], references: [id])
  
  imageGenEnabled    Boolean  @default(true)
  requireApproval    Boolean  @default(false) // Pending queue?
  freeImageCount     Int      @default(5)
  questionsPerToken  Int      @default(3)
  
  allowedMathTopics  String[] // Empty = all allowed
  blockedMathTopics  String[] // Specific blocked topics
  
  dailyLimitPerStudent Int?   // Optional daily cap
  
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}
```

---

## 📁 File Structure

```
app/src/
├── lib/
│   ├── mathQuiz/
│   │   ├── mathTypes.ts        # Ported from mathTypes.js
│   │   ├── quizEngine.ts       # Quiz logic, streak tracking
│   │   └── types.ts            # TypeScript interfaces
│   │
│   └── imageGen/
│       ├── nanobanana.ts       # Gemini image generation
│       ├── safetyFilter.ts     # Input/output filtering
│       ├── promptBuilder.ts    # Build prompts from entities
│       └── types.ts            # TypeScript interfaces
│
├── components/
│   ├── quiz/
│   │   ├── MathQuizModal.tsx   # Quiz popup
│   │   ├── QuizQuestion.tsx    # Single question display
│   │   ├── QuizProgress.tsx    # Progress/streak display
│   │   └── DiagramRenderer.tsx # SVG diagram display
│   │
│   └── imageGen/
│       ├── ImageGenButton.tsx  # "Generate Image" button
│       ├── ImageGenModal.tsx   # Full generation flow
│       ├── StylePicker.tsx     # Style preset selector
│       ├── PromptEditor.tsx    # Add to prompt UI
│       └── ImageGallery.tsx    # View all generated images
│
├── app/
│   └── api/
│       ├── quiz/
│       │   ├── generate/route.ts   # Generate quiz question
│       │   ├── check/route.ts      # Check answer, award tokens
│       │   └── settings/route.ts   # Teacher settings
│       │
│       └── images/
│           ├── generate/route.ts   # Generate image
│           ├── moderate/route.ts   # Teacher moderation
│           └── gallery/route.ts    # Fetch user's images
```

---

## 🔧 API Routes

### Quiz Routes

**POST /api/quiz/generate**
```typescript
Request: { mathType?: string, userId: string }
Response: { 
  problem: string, 
  hint: string, 
  diagram?: string, // SVG
  mathType: string,
  difficulty: number 
}
```

**POST /api/quiz/check**
```typescript
Request: { 
  answer: string, 
  correctAnswer: string, 
  mathType: string, 
  userId: string 
}
Response: { 
  isCorrect: boolean, 
  streak: number,
  tokensEarned: number,
  totalTokens: number,
  streakBonus: boolean
}
```

### Image Routes

**POST /api/images/generate**
```typescript
Request: {
  entityType: string,
  entityId: string,
  stylePreset: string,
  studentAddition?: string,
  userId: string
}
Response: {
  imageUrl: string,
  imageId: string,
  tokensRemaining: number,
  status: 'approved' | 'pending'
}
```

**GET /api/images/gallery**
```typescript
Request: { userId: string, entityId?: string }
Response: {
  images: GeneratedImage[]
}
```

**POST /api/images/moderate** (Teacher only)
```typescript
Request: {
  imageId: string,
  action: 'approve' | 'reject' | 'delete',
  reason?: string
}
```

---

## 🚀 Implementation Phases

### Phase 1: Quiz System
1. Port mathTypes.js to TypeScript
2. Create quiz database models
3. Build quiz API routes
4. Create MathQuizModal component
5. Integrate token tracking

### Phase 2: Image Generation Core
1. Set up Nano Banana API integration
2. Create safety filter system
3. Build prompt builder from entities
4. Create image generation API route
5. Set up image storage (cloud storage TBD)

### Phase 3: UI Components
1. ImageGenButton on entity pages
2. ImageGenModal with full flow
3. StylePicker component
4. PromptEditor with restrictions
5. Loading states with mythology facts

### Phase 4: Teacher Dashboard
1. Image gallery view
2. Moderation queue
3. Per-student controls
4. Math topic management
5. Class-wide settings

### Phase 5: Polish & Testing
1. Rate limiting (1 generation per 30 seconds)
2. Error handling & fallbacks
3. Mobile responsiveness
4. Accessibility
5. Load testing

---

## ❓ Open Questions

1. **Image Storage**: Where do images live? 
   - Cloudinary? S3? Vercel Blob?
   - Need permanent storage with CDN

2. **Rate Limiting**: 
   - 1 generation per 30 seconds per student?
   - Daily caps beyond token system?

3. **Sharing**: Can students share images with classmates?

4. **Printing**: Export for classroom display?

5. **Maps**: User was skeptical about maps - skip for now?

6. **Backup Service**: If Nano Banana down, auto-switch to DALL-E?

---

## 📊 Success Metrics

- Images generated per student
- Quiz completion rates
- Token economy balance (are students earning enough?)
- Teacher intervention rate (how often do they need to moderate?)
- Student satisfaction (do they like their images?)

---

## � Image Storage

### Decision: **Supabase Storage** ✅

**Why Supabase?**
- Already using Supabase for database and auth
- No new service to set up
- Same authentication - students can only access their images
- Same admin dashboard for teachers
- Built-in CDN for fast loading
- Free tier: 1GB storage, 2GB bandwidth

**Storage Estimate:**
- 30 students × 50 images × 500KB = ~750MB (fits in free tier!)

**Bucket Structure:**
```
mythology-images/
├── {userId}/
│   ├── characters/
│   │   └── {characterId}_{timestamp}.png
│   ├── creatures/
│   │   └── {creatureId}_{timestamp}.png
│   ├── realms/
│   │   └── {realmId}_{timestamp}.png
│   ├── stories/
│   │   └── {storyId}_{timestamp}.png
│   ├── mythologies/
│   │   └── {mythologyId}_{timestamp}.png
│   └── maps/
│       └── {mapId}_{timestamp}.png
```

**RLS Policies:**
- Students: Read/write own images only
- Teachers: Read all images in their class
- Admins: Full access

---

## 📋 Final Decisions Summary

| Question | Decision |
|----------|----------|
| **Image Storage** | Supabase Storage (already using it!) |
| **Daily Limit** | 3 approved images per day (encourages daily return) |
| **Sharing** | ✅ Yes - students can share with classmates |
| **Printing/Export** | ✅ Yes - export for classroom display |
| **Maps** | ✅ Attempt it (try to generate map images) |
| **Backup Service** | ✅ Yes - auto-switch to DALL-E if Nano Banana fails |
| **Image Editing** | ✅ Yes - students can crop/adjust images |
| **Image History** | Keep only the chosen/featured image (delete attempts) |

---

## �🔗 Integration Points with Existing Features

### From BRAINSTORM_DECISIONS.md:
- **AI Usage per Student**: Track image generations per student
- **Teacher can adjust limits and reset usage**
- **Activity Log**: Shows "Generated AI image for [entity]"
- **AI Credits Management**: Already planned in original architecture

### From PLAN.md:
- **ai_generations table**: Already designed in schema
  - `id`, `user_id`, `type` (image/text), `prompt`, `result_url`, `credits_used`, `created_at`
- **Teacher Dashboard**: AI credit management planned
- **Rate Limiting**: Teacher-controlled to prevent spam

### From BESTIARY_FEATURE.md:
- **Creature Images**: Each creature card has `[Creature Image]` placeholder
- **Perfect for AI generation**: Creatures are visual by nature
- **Danger Level visuals**: Could influence image style (scary vs friendly)

### Entities That Need Images:
1. **Characters** - Gods, heroes, mortals (3+ per mythology)
2. **Creatures** - Beasts, monsters, spirits (from bestiary)
3. **Realms** - Locations in the mythology
4. **Stories** - Cover images or scene illustrations
5. **Mythologies** - Overall "cover art"
6. **Maps** - TBD (skeptical about quality)

---

## ✅ All Questions Answered!

All major design decisions have been made. Ready for implementation!

---

## 🚀 BONUS FEATURES: THE EPIC ADDITIONS

### 1. ⚔️ Visual Battle System Integration

**Battle Cards with Generated Images:**
```
┌────────────────────────┬────────────────────────────────────┐
│                        │                                    │
│   [FROSTFANG IMAGE]    │        [FIRE SERPENT IMAGE]        │
│                        │                                    │
│   🐺 FROSTFANG         │        🐍 FIRE SERPENT             │
│   HP: ████████░░ 80%   │        HP: ██████████ 100%         │
│   ATK: ⚔️ 75           │        ATK: ⚔️ 82                  │
└────────────────────────┴────────────────────────────────────┘
```

**Animated Battle Effects:**
- Images shake when hit
- Flash red when damaged
- Glow with power when attacking
- Victory pose for winner
- Defeat animation (fade/fall) for loser

---

### 2. 🃏 Trading Card Generator

**Collectible Cards for Every Entity:**
```
┌─────────────────────────┐
│  ★★★★★ LEGENDARY ★★★★★   │
├─────────────────────────┤
│    [AI GENERATED        │
│     CHARACTER IMAGE]    │
├─────────────────────────┤
│  CIPHER, GOD OF CODE    │
│  Domain: Technology     │
├─────────────────────────┤
│  ⚔️ 92  🛡️ 78  💫 88    │
│  Created by: Alex M.    │
└─────────────────────────┘
```

**Features:**
- Rarity tiers: Common → Uncommon → Rare → Epic → Legendary
- Holographic CSS effects for rare cards
- **PRINTABLE** - kids cut them out!
- **SHAREABLE** - trade codes with classmates
- **BATTLE-READY** - use card stats in combat

---

### 3. 📖 Comic Strip Generator

**Turn Stories into Visual Comics:**
```
┌──────────┬──────────┬──────────┐
│  PANEL 1 │  PANEL 2 │  PANEL 3 │
│ [Scene]  │ [Hero]   │ [Monster]│
│ "In the  │ "Cipher  │ "THE     │
│ beginning│ rose..." │ KRAKEN!" │
└──────────┴──────────┴──────────┘
```

**How it works:**
1. Student selects a story
2. AI breaks story into key scenes (3-6 panels)
3. Generate image for each panel
4. Add speech bubbles/captions
5. Export as comic book PDF!

---

### 4. 🎬 Mythology Intro Generator

**Anime-Style Opening Credits:**
1. Title card with mythology name
2. Flash through all character portraits
3. Montage of realm images
4. Epic creature reveal
5. Creator credit (Student name)

Uses CSS animations + generated images for a 5-10 second "trailer"!

---

### 5. 🧩 Crossover Mashup Images

**When Two Mythologies Meet:**
```
Prompt: "Epic scene showing Frostfang the Ice Wolf 
from Northern Frost mythology facing the Fire Serpent 
from Volcanic Pantheon, illustrated children's book style"
```

- Creates UNIQUE crossover image
- Both students own the image
- Appears in both mythology galleries
- Special "Crossover" badge on image

---

### 6. 📜 Prophecy Scroll Generator

**Mystical Prophecy Documents:**
```
┌─────────────────────────────────────┐
│      ☽ THE PROPHECY OF ICE ☽        │
│   [Mystical character image]        │
│   "When the frost moon rises        │
│    and the code runs cold..."       │
│      ─────── ⚜ ───────              │
└─────────────────────────────────────┘
```

- Aged parchment texture
- Mysterious, ethereal image style
- Printable as classroom decorations

---

### 7. 🎭 Character Evolution System

**Visual Progression as Story Develops:**

| Stage | Trigger | Image Style |
|-------|---------|-------------|
| **Novice** | Creation | Simple, young appearance |
| **Awakened** | First story | Glowing eyes, hint of power |
| **Warrior** | First battle | Battle armor, weapons |
| **Champion** | Win 3 battles | Epic armor + aura |
| **Legendary** | Complete mythology | Full god form, maximum epic |

Each evolution generates a NEW image showing growth!

---

### 8. 🖼️ Realm Postcards

**Printable Tourism Postcards:**
```
┌─────────────────────────────────────┐
│      [REALM IMAGE - SCENIC]         │
│         ☀️ Greetings from           │
│      THE FROZEN PEAKS! ❄️           │
├─────────────────────────────────────┤
│  Wish you were here! The ice        │
│  crystals are beautiful...          │
│  - Frostfang 🐺                     │
└─────────────────────────────────────┘
```

---

### 9. 🎪 Wanted Posters (For Villains!)

**Bounty-Style Villain Posters:**
```
╔═══════════════════════════════════╗
║         ⚠️ WANTED ⚠️              ║
║    [VILLAIN IMAGE - MENACING]     ║
║      THE DATA KRAKEN              ║
║   REWARD: 10,000 Digital Coins    ║
╚═══════════════════════════════════╝
```

Perfect for antagonists and monsters!

---

### 10. 🎮 Mini-Games with Images

**Mythology Memory Match:**
- Flip cards to match characters to domains
- Uses generated images as card faces

**Guess the Mythology:**
- Show cropped/obscured image
- Guess which mythology it's from
- Earns bonus tokens!

**Battle Tournament Brackets:**
- Visual bracket with character portraits
- Auto-generated battle scenes at each match

---

### 11. 📊 Class Mythology Mural

**Giant Collaborative Canvas:**
```
┌─────────────────────────────────────────────────────────┐
│            🏛️ MRS. JOHNSON'S MYTHOLOGY PANTHEON         │
├─────────┬─────────┬─────────┬─────────┬─────────┬──────┤
│ Alex's  │ Jordan's│ Maya's  │ Chris's │ Sam's   │ ...  │
│ Cipher  │ Ash God │ Chrono  │ Ocean   │ Storm   │      │
│ [IMG]   │ [IMG]   │ [IMG]   │ [IMG]   │ [IMG]   │      │
├─────────┴─────────┴─────────┴─────────┴─────────┴──────┤
│                  CREATURES ROW                          │
├─────────┬─────────┬─────────┬─────────┬─────────┬──────┤
│ Kraken  │ Serpent │ Dragon  │ Levia   │ Thunder │ ...  │
│ [IMG]   │ [IMG]   │ [IMG]   │ [IMG]   │ [IMG]   │      │
└─────────┴─────────┴─────────┴─────────┴─────────┴──────┘
```

- Printable as POSTER for classroom wall
- Auto-updates as new images are generated
- Teacher picks "featured" images for mural

---

### 12. 🌟 Achievement Badges with Custom Images

**AI-Generated Badge Art:**

| Achievement | Badge |
|-------------|-------|
| First Image | 🎨 Artist Awakened |
| 10 Images | 🖼️ Gallery Master |
| Win Battle | ⚔️ Victor |
| 5-Win Streak | 🔥 Unstoppable |
| Crossover | 🤝 Realm Bridger |
| Complete Mythology | 👑 Pantheon Creator |
| Help Classmate | 💝 Mythic Mentor |

Each badge is a mini AI-generated image specific to the achievement!

---

## 🎯 Implementation Priority

### Phase A: Core Image Generation
1. Basic image generation for entities
2. Math quiz token system
3. Safety filters
4. Teacher controls

### Phase B: Battle Integration
5. Battle cards with images
6. Animated battle effects
7. Crossover mashup images

### Phase C: Collectibles
8. Trading card generator
9. Character evolution images
10. Achievement badge images

### Phase D: Creative Exports
11. Comic strip generator
12. Prophecy scrolls
13. Realm postcards
14. Wanted posters

### Phase E: Community Features
15. Class mythology mural
16. Mythology intro generator
17. Mini-games with images

### Phase F: Polish
18. Tournament bracket visuals
19. Memory match game
20. Guess the mythology game

---

*Last Updated: December 28, 2025*
*Status: ✅ Phases A, B, D COMPLETE - Ready for Phase C (Collectibles) 🎴*
