# 🏛️ The Mythology Codex - Project Documentation

> **Status:** ✅ **Phases 0-4D Complete + Voice Input & AI Name Suggestions**  
> **Last Updated:** December 30, 2025  
> **Current State:** AI Image Generation, Trading Cards, Creative Exports, Real-Time Voice Input

---

## 📚 **Complete Documentation Index**

### Core Planning Documents
| Document | Purpose | Lines |
|----------|---------|-------|
| **[README.md](README.md)** | This file - project overview, status, quick start | ~1500 |
| **[PLAN.md](PLAN.md)** | Original master plan with architecture | ~1000 |
| **[PROJECT_STATUS.md](PROJECT_STATUS.md)** | Detailed implementation status and roadmap | ~900 |
| **[IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)** | Step-by-step development phases | ~8500 |
| **[BRAINSTORM_DECISIONS.md](BRAINSTORM_DECISIONS.md)** | 16 major design decisions documented | ~12000 |
| **[AGENT_PERSONALITY.md](AGENT_PERSONALITY.md)** | AI development assistant guidelines | ~200 |

### Feature Documentation
| Document | Purpose | Lines |
|----------|---------|-------|
| **[AI_ASSISTANCE_FEATURE.md](AI_ASSISTANCE_FEATURE.md)** | AI assistance system & Mythology Wizard (Phase 2F) | ~1800 |
| **[IMAGE_GENERATION_PLAN.md](IMAGE_GENERATION_PLAN.md)** | 🆕 AI Image Generation system (Phase 4A) - Math Quiz, Tokens, Safety | ~975 |
| **[BESTIARY_FEATURE.md](BESTIARY_FEATURE.md)** | Creature system design (Phase 1C) | ~500 |
| **[MAP_ASSETS_STRATEGY.md](MAP_ASSETS_STRATEGY.md)** | Map asset creation approach | ~300 |
| **[MAP_TYPE_DIFFERENTIATION.md](MAP_TYPE_DIFFERENTIATION.md)** | 5 map types with type-specific features | ~400 |
| **[TEST_PLAN_MAP_TYPES.md](TEST_PLAN_MAP_TYPES.md)** | Comprehensive map testing plan | ~300 |
| **[PHASE_2B_COMPLETION_SUMMARY.md](PHASE_2B_COMPLETION_SUMMARY.md)** | Map system completion details | ~500 |

### Test Data Documentation
| Document | Purpose | Lines |
|----------|---------|-------|
| **[OCEANBORN_LEGENDS_MASTER_PLAN.md](OCEANBORN_LEGENDS_MASTER_PLAN.md)** | Complete oceanic mythology specification | ~636 |
| **[EXAMPLE_MYTHOLOGIES.md](EXAMPLE_MYTHOLOGIES.md)** | Greek & Harry Potter example templates | ~500 |
| **[app/STUDENT_ACCOUNTS.md](app/STUDENT_ACCOUNTS.md)** | 115 test student account credentials | ~200 |

### Technical Documentation (docs/)
| Document | Purpose | Lines |
|----------|---------|-------|
| **[docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** | PostgreSQL schema reference | ~4000 |
| **[docs/API_REFERENCE.md](docs/API_REFERENCE.md)** | REST API endpoint documentation | ~2000 |
| **[docs/TESTING_STRATEGY.md](docs/TESTING_STRATEGY.md)** | Testing approach and checklists | ~2500 |
| **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** | Production deployment guide | ~3000 |
| **[docs/TEACHER_ONBOARDING.md](docs/TEACHER_ONBOARDING.md)** | Educator training guide | ~2000 |
| **[docs/STUDENT_GUIDE.md](docs/STUDENT_GUIDE.md)** | Student quick-start guide | ~2000 |
| **[docs/PARENT_LETTER.md](docs/PARENT_LETTER.md)** | Parent communication template | ~2500 |
| **[docs/CONTENT_POLICY.md](docs/CONTENT_POLICY.md)** | Age-appropriate content guidelines | ~2500 |
| **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** | Issue resolution guide | ~2500 |
| **[docs/COST_BREAKDOWN.md](docs/COST_BREAKDOWN.md)** | Operational cost analysis | ~2500 |

---

## ⚡ QUICK START

### 🎯 **Starting Development**

```bash
# 1. Navigate to the app directory
cd mythology-project/app

# 2. Install dependencies (if not already done)
npm install

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

### 🔑 **Test Accounts**

**Teacher Account:**
- Email: `eastynsh@student.local`
- Password: `eastynsh`

**Student Accounts (115 available):**
- Format: `username@student.local` / `username`
- Examples: `student1@student.local` / `student1`
- Full list in [app/STUDENT_ACCOUNTS.md](app/STUDENT_ACCOUNTS.md)

### 🌊 **View Test Mythology (Oceanborn Legends)**

After logging in:
1. Go to Student Dashboard
2. Click on "Oceanborn Legends"
3. View all 87 test entities:
   - 35 Characters (gods, heroes, mortals)
   - 25 Creatures (leviathans, guardians, monsters)
   - 10 Realms (underwater domains, coastal sanctuaries)
   - 12 Stories (creation myths, legends, battles)
   - 5 Maps (world maps, realm details)

---

## 📊 CURRENT PROJECT STATUS

### **Implementation Progress Overview**

| Phase | Description | Status | Progress |
|-------|-------------|--------|----------|
| **Phase 0** | Project Setup | ✅ COMPLETE | 100% |
| **Phase 1A** | Authentication System | ✅ COMPLETE | 100% |
| **Phase 1B** | Character CRUD | ✅ COMPLETE | 100% |
| **Phase 1C** | Creature/Bestiary | ✅ COMPLETE | 100% |
| **Phase 1D** | Image Upload | ✅ COMPLETE | 100% |
| **Phase 1E** | Gallery View | ✅ COMPLETE | 100% |
| **Phase 1F** | Teacher Student Management | ✅ COMPLETE | 100% |
| **Phase 1G** | Content Moderation | ✅ COMPLETE | 100% |
| **Phase 2A** | Stories (TipTap) | ✅ COMPLETE | 100% |
| **Phase 2B** | World Maps (Konva.js) | ✅ COMPLETE | 100% |
| **Phase 2C** | Relationships (Cytoscape.js) | ✅ COMPLETE | 100% |
| **Phase 2D** | AI Battles | ✅ COMPLETE | 100% |
| **Phase 2E** | Crossovers | ✅ COMPLETE | 100% |
| **Phase 2F** | Mythology Creation Wizard | ✅ COMPLETE | 100% |
| **Phase 3** | Gamification (Points, Badges, Levels) | ✅ COMPLETE | 100% |
| **Phase 4A** | AI Image Generation Core | ✅ COMPLETE | 100% |
| **Phase 4B** | Battle Integration | ✅ COMPLETE | 100% |
| **Phase 4C** | Trading Cards & Collectibles | ✅ COMPLETE | 100% |
| **Phase 4D** | Creative Exports (Comics, Scrolls, Postcards, Posters) | ✅ COMPLETE | 100% |
| **Phase 4E** | Community Features (Murals, Sharing) | ⏸️ PENDING | 0% |
| **Phase 5** | Real-time Collaboration | ⏸️ PENDING | 0% |
| **Phase 6** | Presentations | ⏸️ PENDING | 0% |
| **Phase 7** | Polish & Launch | ⏸️ PENDING | 0% |

### **What's Working Right Now**

#### ✅ **Complete Foundation (Phases 0-1)**
- Full authentication system with teacher/student roles
- Classroom creation with invite codes
- Profile management with points, levels, streaks
- 115 student test accounts created and working

#### ✅ **Complete Content Creation**

**Mythologies:**
- Creation form (name, description, timeframe, genre, geography, cultural inspiration)
- Visibility controls (public, teacher-only, hidden)
- Detail page showing all associated content

**Characters (Phase 1B):**
- Creation form with all fields:
  - Name, character type (god, demigod, mortal, hero, creature, spirit)
  - Archetype (hero, trickster, mentor, guardian, villain, ruler, innocent)
  - Domain, powers, appearance, personality, backstory
  - Relationships, strengths, weaknesses, symbols, sacred items
- Detail view with full character information
- Edit and delete functionality

**Creatures (Phase 1C):**
- Creation form with comprehensive fields:
  - Name, creature type (beast, dragon, undead, elemental, construct, etc.)
  - Size category (tiny, small, medium, large, huge, gargantuan)
  - Danger level (harmless, low, moderate, high, extreme, legendary)
  - Alignment, intelligence, lifespan
  - Abilities, weaknesses, habitat, behavior, diet
  - Notable specimens, mythology role
- Detail view with all creature information
- Edit and delete functionality

**Stories (Phase 2A):**
- TipTap rich text editor with:
  - Bold, italic, strikethrough formatting
  - Headings (H1, H2, H3)
  - Lists (bullet, numbered)
  - Blockquotes
  - Code blocks
  - Horizontal rules
  - Undo/redo
- Story types: origin, legend, prophecy, quest, battle, relationship
- Word count tracking
- Excerpt generation
- TipTap JSON content storage
- Complete/draft status

**Maps (Phase 2B):**
- Konva.js interactive canvas with:
  - Location markers with customizable icons (60+ emojis)
  - 4 marker styles (pin, circle, hex, star)
  - Path drawing with color/width/dashed options
  - Region drawing (polygons)
  - Undo/redo system
  - Grid overlays (square, hex)
  - Snap-to-grid functionality
  - Background textures (parchment, clean, satellite, none)
- 5 map types with type-specific features:
  - **World Map** (🌍): 2000-2400×1500-1800px, circle/hex markers only
  - **Regional Map** (🗺️): 1600-2000×1200-1500px, circle/hex/star markers
  - **City/Settlement** (🏘️): 800-1200×600-900px, pin/circle/star markers
  - **Mystical Realm** (✨): 1000-1600×800-1200px, all marker styles
  - **Other/Custom** (📋): 800-2400×600-1800px, all marker styles
- Type-specific marker libraries
- Dynamic validation messages
- Location editing panel (drag to reposition)
- Path manager with delete functionality

**Realms (Database table added):**
- Realm types: underwater, surface, coastal, island, sky, underground, dimensional, spiritual, other
- Fields: name, description, access requirements, inhabitants, geography
- Cultural significance, connected realms
- Related characters and creatures arrays
- Map data (JSONB)
- Displayed in mythology detail page

**Relationships (Phase 2C):**
- Cytoscape.js interactive relationship graph
- Relationship types supported:
  - Family (parent-child, sibling, spouse, ancestor)
  - Social (ally, rival, enemy, mentor-student, friend)
  - Political (ruler-subject, worshipper-deity, creator-creation)
  - Romantic (lover, betrothed, unrequited)
  - Other (custom)
- Bidirectional relationship display
- Strength levels (weak, moderate, strong, unbreakable)
- Multiple layout algorithms:
  - Force-directed (default)
  - Hierarchical
  - Circular
  - Grid
- Node click to view character details
- Edge click to view relationship details
- Add relationship form with character selection
- Relationship filtering by type

**AI Battles (Phase 2D):**
- Battle Arena page accessible from mythology detail
- Combatant selection (characters vs characters, creatures vs creatures, or mixed)
- Combat stats calculated by character type/danger level:
  - Gods: 200 HP, 25 ATK, 20 DEF, 15 SPD
  - Demigods: 150 HP, 18 ATK, 15 DEF, 14 SPD
  - Heroes: 120 HP, 15 ATK, 12 DEF, 12 SPD
  - Spirits: 100 HP, 12 ATK, 8 DEF, 18 SPD
  - Mortals: 80 HP, 8 ATK, 8 DEF, 10 SPD
  - Creatures scale by danger level (harmless → catastrophic)
- 5 Battle Types:
  - **Duel** - Honorable one-on-one combat
  - **Honor Combat** - Formal combat for reputation
  - **Ambush** - Surprise attack (combatant 1 strikes first)
  - **Divine Contest** - Gods get +25% stats
  - **Tournament** - Spectated arena match
- Turn-based combat simulation with:
  - Initiative based on speed
  - Critical hits (15% chance, 2× damage)
  - Special abilities (25% chance to use)
  - Dodge mechanics (10% base + speed difference)
  - Max 50 rounds per battle
- **Animated Battle Playback:**
  - Watch each round unfold in real-time
  - Live HP bars that decrease with damage
  - Damage numbers pop up (-15 💥 for crits, ✨ for specials)
  - Combatant cards highlight when attacking/being hit
  - Playback speed controls (🐢 Slow, ▶️ Normal, ⚡ Fast)
  - Pause/Resume functionality
  - Skip to End option
  - Replay battle button
- **GPT-4 Battle Narration:**
  - 5 narration styles (Epic, Comedic, Tragic, Dramatic, Poetic)
  - Custom arena description support
  - 400-600 word narrative generated after battle
  - Fallback narration if API unavailable
- **Battle Stories Collection:**
  - Save favorite battles to collection
  - View saved battle narrations
  - Favorite/unfavorite saved battles
  - Delete unwanted battles
  - Sidebar panel with battle history

**Crossover Events (Phase 2E):**
- **Crossover Hub** with 4 tabs:
  - Browse mythologies from classmates
  - Incoming/outgoing request management
  - Alliance and rivalry tracking
  - Collaborative stories list
- **Request Types:**
  - ⚔️ Battle - Challenge another mythology to combat
  - 🤝 Alliance - Form a partnership
  - 📖 Story - Collaborate on a story together
  - 💰 Trade - Exchange resources or ideas
  - ⚡ Conflict - Declare a rivalry
- **Cross-Mythology Battles:**
  - Select partner from established alliances
  - Pick champions from each mythology
  - Animated battle playback with HP bars
  - Victory celebration and results
- **Collaborative Stories:**
  - TipTap rich text editor
  - Dual author display
  - Auto-save functionality
  - Story workflow (draft → in_progress → completed → published)
  - Word count tracking
- **Teacher Events:**
  - Tournament, story challenge, alliance week
  - Mythology olympics, crossover festival
  - Custom event creation
  - Participant tracking with placements

**Mythology Creation Wizard (Phase 2F):**
- **Guided 5-Step Creation Process:**
  - Step 1: Choose mythology category and cultural style
  - Step 2: Define geography (environment, climate, landmarks)
  - Step 3: Apply Five Themes of Geography
  - Step 4: Name your mythology with AI suggestions
  - Step 5: Preview and create
- **6 Mythology Categories with 20+ Cultural Styles:**
  - 🏛️ Classic Mythology (Greek/Roman, Norse, Egyptian, Celtic, Asian, African, Indigenous Americas, **Alaska Native**, Mesopotamian, Polynesian)
  - 📜 Historical Mythology (Hindu, Japanese Shinto, Chinese, Slavic)
  - 🚀 Future Mythology (Cyberpunk, Post-Apocalyptic, Space Opera)
  - 🏙️ Modern Mythology (Urban Fantasy)
  - 🌀 Abstract Mythology (Elemental, Cosmic Horror, Dream Realm)
  - ✨ Custom (Build your own)
- **Alaska Native Cultural Support:**
  - Detailed cultural context for Ahtna, Yup'ik, Tlingit, Inupiaq peoples
  - Authentic naming guidance (ravens, salmon, glaciers, northern lights)
  - Designed for 65% Alaska Native student population (Copper River region)
- **Multi-Select Geography Builder:**
  - 12 environment options with kid-friendly descriptions
  - 10 climate options (including "Frozen Tundra" and "Eternal Night")
  - 12 landmark options (Sacred Temple, World Tree, Crystal Cave, etc.)
  - Students can select MULTIPLE options for each category
  - AI assistance on each sub-step with contextual prompts
- **Five Themes Integration:**
  - Location, Place, Human-Environment Interaction, Movement, Regions
  - Real-world examples and mythology examples for each theme
  - 8 quick-starter ideas per theme (clickable chips)
  - "Stuck? Get a Hint!" feature with rotating prompts
- **Context-Aware AI Name Suggestions:**
  - AI considers chosen cultural style when suggesting names
  - Includes all geography choices in the prompt
  - Provides authentic naming patterns for each culture
  - Explains meaning and connection for each suggestion
- **Real-Time Voice Input:** 🆕
  - Students can speak instead of type in any text field
  - Live transcription preview shows text as they speak
  - Pulsing animation indicates active listening
  - Powered by Web Speech API (Chrome/Edge support)
  - Integrated in: Mythology Wizard, Story Editor, All Form Fields

**AI-Powered Name Suggestions (Character/Creature Creation):** 🆕
- **Contextual Name Generation:**
  - Category pills (Storm-related, Fire-related, Moon/Night, etc.)
  - AI generates 5 unique names based on mythology context
  - Each name includes brief explanation of meaning
  - Uses mythology's genre, geography, and cultural inspiration
- **Smart Context Building:**
  - Fetches Five Themes geography answers
  - Considers existing name if user wants variations
  - Different prompts for characters vs creatures
- **User Experience:**
  - Click category → AI generates suggestions
  - Loading indicator per category
  - Click any suggestion to use it
  - Works on both character and creature creation pages

**AI Image Generation (Phase 4A):** 🆕
- **Math Quiz Token System:**
  - 20+ problem types across 6 categories (Arithmetic, Fractions, Algebra, Geometry, Decimals, Word Problems)
  - SVG diagrams for coordinate plane and geometry questions
  - Streak tracking with bonus multipliers (3+ = ✨, 5+ = 🔥 2×, 10+ = 🔥🔥 3×, 15+ = 🔥🔥🔥 4×)
  - Configurable questions-per-token (default: 3)
  - Confetti celebration on correct answers
  - Teacher-configurable blocked math topics
- **Dual Image Generation Providers:**
  - **Primary:** Nano Banana (Gemini 2.5 Flash Image) - $0.039/image
  - **Fallback:** DALL-E 3 - $0.04-$0.12/image
  - Provider badge shows which AI generated the image (🍌 or 🎨)
  - Automatic fallback if primary fails
- **Triple-Layer Safety System:**
  - Layer 1: Blocklist (hard-blocked words)
  - Layer 2: Pattern detection (AI scans for concerning content)
  - Layer 3: System prompt wrapper (enforces age-appropriate output)
  - No text/words generated in images
- **Entity-Specific Prompt Builders:**
  - Character portraits with personality and domain
  - Creature illustrations with danger level styling
  - Realm landscapes with geography
  - Story scene illustrations
  - Mythology overview images
- **Access Control:**
  - Token-gated for students (earn through math quiz)
  - Unlimited for teachers/admins (👑 badge)
  - Hidden dev cheat code (click 🎨 5x quickly → 🔧 Dev Mode)
- **UI Features:**
  - Side panel on character pages (70/30 split)
  - Save/Discard preview before finalizing
  - Image gallery per user
  - Teacher moderation dashboard
- **Database Tables:**
  - `quiz_attempts` - Math quiz history
  - `generated_images` - All AI images with metadata
  - `classroom_image_settings` - Teacher controls
  - `moderation_log` - Image moderation tracking
  - Profile columns for `image_tokens` and `quiz_streak`

**Battle Image Integration (Phase 4B):** 🆕
- **Battle Scene Generation:**
  - Generate epic battle scenes during combat
  - Victory celebration cards
  - Defeat images with dramatic flair
- **Animated Battle Enhancements:**
  - Images integrated into battle playback
  - Champion portraits in combatant cards

**Trading Cards & Collectibles (Phase 4C):** 🆕
- **Trading Card Generator:**
  - 5 rarity tiers: Common (45%), Uncommon (25%), Rare (18%), Epic (9%), Legendary (3%)
  - Unique card designs per rarity with colors and borders
  - Random rarity rolls with probability weighting
  - Holographic effects for Epic/Legendary cards
  - Works for characters and creatures
- **Character Stat Cards:**
  - Auto-calculated stats based on character type
  - Combat stats (HP, ATK, DEF, SPD) with visual bars
  - Domain and power listings
  - Professional stat card layout
- **Collection Gallery:**
  - View all collected trading cards
  - Filter by rarity, entity type
  - Sort by name, rarity, date collected
  - Card count statistics

**Creative Exports (Phase 4D):** 🆕
- **Comic Strip Generator:**
  - Generate 3-panel comic strips from stories
  - Sequential narrative panels
  - Story-aware scene generation
  - Perfect for illustrating key story moments
- **Prophecy Scroll Generator:**
  - Ancient scroll-style imagery
  - Mystical text and prophecy visualization
  - Aged parchment aesthetic
  - Great for origin stories and prophecies
- **Realm Postcard Generator:**
  - "Greetings from [Realm]" tourism-style postcards
  - Location-based imagery with landmarks
  - Integrated on realm detail pages
  - Also available on character pages (domain postcards)
  - Also available on creature pages (habitat postcards)
- **Wanted Poster Generator:**
  - Classic "WANTED" poster style
  - AI generates portrait only
  - CSS overlay adds: WANTED header, name, danger level, crimes, rewards
  - Perfect for villains and dangerous creatures
  - Professional Western poster aesthetic

#### ✅ **Gallery & Discovery**
- Public mythology gallery
- Search and filter functionality
- Visibility-aware display

#### ✅ **Teacher Tools**
- Teacher dashboard with:
  - Classroom management
  - Student roster view
  - Invite code display
  - Statistics cards
- Student management page
- Content moderation system

---

## 🗄️ DATABASE SCHEMA

### **Implemented Tables (21 total)**

```
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE TABLES                              │
├─────────────────────────────────────────────────────────────────────┤
│ CORE TABLES (001_initial_schema.sql)                                │
│ ├── profiles          - User accounts with roles, gamification      │
│ ├── classrooms        - Teacher-managed classrooms with invite codes│
│ ├── mythologies       - Student mythology projects                  │
│ ├── characters        - Gods, heroes, mortals with full attributes  │
│ └── creatures         - Bestiary with types, danger levels, abilities│
├─────────────────────────────────────────────────────────────────────┤
│ CONTENT TABLES                                                       │
│ ├── moderation_flags  - Content moderation system (002_moderation)  │
│ ├── stories           - Rich text stories with TipTap JSON (003)    │
│ ├── maps              - Konva canvas maps with locations (004_maps) │
│ ├── relationships     - Character relationships (004_relationships) │
│ ├── realms            - Locations/realms with geography (005_realms)│
│ └── battle_stories    - Saved AI battle narrations (007_battles)    │
├─────────────────────────────────────────────────────────────────────┤
│ CROSSOVER TABLES (008_crossover_events.sql)                         │
│ ├── crossover_requests   - Cross-mythology interaction requests     │
│ ├── mythology_alliances  - Alliance/rivalry relationships           │
│ ├── crossover_stories    - Collaborative stories between mythologies│
│ ├── crossover_battles    - Cross-mythology battle records           │
│ ├── teacher_events       - Teacher-created class-wide events        │
│ └── event_participants   - Event participation tracking             │
├─────────────────────────────────────────────────────────────────────┤
│ IMAGE GENERATION TABLES (011_image_generation.sql) 🆕               │
│ ├── quiz_attempts        - Math quiz history with answers/streaks   │
│ ├── generated_images     - AI-generated images with metadata        │
│ ├── classroom_image_settings - Teacher controls for image gen       │
│ └── moderation_log       - Image moderation tracking                │
└─────────────────────────────────────────────────────────────────────┘
```

### **Migration Files**

| File | Tables Created | Purpose |
|------|----------------|---------|
| `001_initial_schema.sql` | profiles, classrooms, mythologies, characters, creatures | Core foundation |
| `002_moderation.sql` | moderation_flags | Content moderation |
| `003_stories.sql` | stories | Rich text story storage |
| `004_maps.sql` | maps | Konva canvas map storage |
| `004_relationships.sql` | relationships | Character relationships |
| `005_realms.sql` | realms | Locations and geography |
| `007_battle_stories.sql` | battle_stories | Saved battle narrations |
| `008_crossover_events.sql` | crossover_requests, mythology_alliances, crossover_stories, crossover_battles, teacher_events, event_participants | Cross-mythology interactions |
| `011_image_generation.sql` | quiz_attempts, generated_images, classroom_image_settings, moderation_log + profile columns | 🆕 AI Image Generation system |

### **Key Schema Features**
- UUID primary keys with auto-generation
- Foreign key relationships with CASCADE delete
- Row Level Security (RLS) policies on all tables
- Performance indexes for common queries
- Timestamp triggers for updated_at
- JSONB fields for flexible data (canvas_data, content, map_data)

---

## 🧩 APPLICATION STRUCTURE

### **App Directory Structure**

```
app/
├── .env.local                    # Environment variables (Supabase keys)
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
│
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── layout.tsx            # Root layout with fonts/metadata
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css           # Global styles (Tailwind)
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx          # Login form
│   │   │
│   │   ├── signup/
│   │   │   └── page.tsx          # Signup form with role selection
│   │   │
│   │   ├── gallery/
│   │   │   └── page.tsx          # Public mythology gallery
│   │   │
│   │   ├── student/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx      # Student dashboard with mythology grid
│   │   │   │
│   │   │   └── mythology/
│   │   │       ├── create/
│   │   │       │   └── page.tsx  # Mythology creation form
│   │   │       │
│   │   │       └── [id]/
│   │   │           ├── page.tsx  # Mythology detail (shows all content)
│   │   │           │
│   │   │           ├── character/
│   │   │           │   ├── create/
│   │   │           │   │   └── page.tsx      # Character creation form
│   │   │           │   └── [characterId]/
│   │   │           │       └── page.tsx      # Character detail view
│   │   │           │
│   │   │           ├── creature/
│   │   │           │   ├── create/
│   │   │           │   │   └── page.tsx      # Creature creation form
│   │   │           │   └── [creatureId]/
│   │   │           │       └── page.tsx      # Creature detail view
│   │   │           │
│   │   │           ├── story/
│   │   │           │   ├── create/
│   │   │           │   │   └── page.tsx      # Story editor with TipTap
│   │   │           │   └── [storyId]/
│   │   │           │       └── page.tsx      # Story reader view
│   │   │           │
│   │   │           ├── map/
│   │   │           │   ├── create/
│   │   │           │   │   └── page.tsx      # Map editor with Konva
│   │   │           │   └── [mapId]/
│   │   │           │       └── page.tsx      # Map viewer
│   │   │           │
│   │   │           ├── relationships/
│   │   │           │   └── page.tsx          # Relationship graph (Cytoscape)
│   │   │           │
│   │   │           └── battle/
│   │   │               └── page.tsx          # Battle Arena (1100+ lines)
│   │   │
│   │   ├── teacher/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx      # Teacher dashboard with stats
│   │   │   │
│   │   │   └── students/
│   │   │       └── page.tsx      # Student management
│   │   │
│   │   └── api/
│   │       ├── classrooms/
│   │       │   └── create/
│   │       │       └── route.ts  # Classroom creation (service role)
│   │       │
│   │       ├── moderate/
│   │       │   └── route.ts      # Content moderation API
│   │       │
│   │       └── battles/
│   │           └── simulate/
│   │               └── route.ts  # Battle simulation API (GPT-4 narration)
│   │
│   ├── components/
│   │   ├── MapCanvas.tsx         # Konva.js map editor (1271 lines)
│   │   ├── RichTextEditor.tsx    # TipTap story editor (202 lines)
│   │   ├── RelationshipGraph.tsx # Cytoscape.js graph (271 lines)
│   │   └── AddRelationshipForm.tsx # Relationship creation form
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser Supabase client
│   │   │   ├── server.ts         # Server Supabase client
│   │   │   └── middleware.ts     # Auth middleware
│   │   │
│   │   ├── openai/
│   │   │   └── client.ts         # OpenAI API client
│   │   │
│   │   ├── mapTypes.ts           # Map type configurations (278 lines)
│   │   ├── relationshipTypes.ts  # Relationship type definitions
│   │   ├── cytoscape-config.ts   # Cytoscape.js configuration
│   │   ├── battleEngine.ts       # Combat simulation engine (380+ lines)
│   │   └── battleNarration.ts    # GPT-4 narration generator (220+ lines)
│   │
│   └── proxy.ts                  # Request proxy/middleware
│
├── scripts/
│   ├── seed-test-data.ts         # Create test mythologies
│   ├── bulk-create-students.ts   # Create 115 student accounts
│   ├── create-test-student.ts    # Create single test account
│   ├── cleanup-duplicate-mythologies.ts # Database cleanup
│   ├── check-myths.ts            # Debug mythology queries
│   ├── check-all.ts              # Debug all data
│   │
│   │── # Oceanborn Legends Population Scripts (87 entities total)
│   ├── oceanborn-phase-1.ts      # Phase 1: 8 divine entities
│   ├── oceanborn-phase-1-fixed.ts # Fixed version
│   ├── oceanborn-phase-2.ts      # Phase 2: 12 major deities
│   ├── oceanborn-phase-3a.ts     # Phase 3A: 8 heroes/mortals
│   ├── oceanborn-phase-3b.ts     # Phase 3B: 7 heroes/mortals
│   ├── oceanborn-phase-4a.ts     # Phase 4A: 8 creatures
│   ├── oceanborn-phase-4b.ts     # Phase 4B: 8 creatures
│   ├── oceanborn-phase-4c.ts     # Phase 4C: 9 creatures
│   ├── oceanborn-phase-5.ts      # Phase 5: 10 realms
│   ├── oceanborn-phase-6.ts      # Phase 6: 12 stories
│   └── oceanborn-phase-7.ts      # Phase 7: 5 maps
│
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql    # Core tables
│       ├── 002_moderation.sql        # Moderation flags
│       ├── 003_stories.sql           # Stories table
│       ├── 004_maps.sql              # Maps table
│       ├── 004_relationships.sql     # Relationships table
│       ├── 005_realms.sql            # Realms table
│       └── 007_battle_stories.sql    # Battle stories table
│
└── public/                       # Static assets
```

---

## 🌊 OCEANBORN LEGENDS TEST DATA

### **Complete Test Mythology: 87 Entities**

The "Oceanborn Legends" mythology serves as comprehensive test data demonstrating all features:

#### **Phase 1: Divine Hierarchy (8 entities)**
| # | Name | Type | Domain |
|---|------|------|--------|
| 1 | Abyssara | Primordial | The Deep Mother, infinite ocean |
| 2 | Tideus | Primordial | The First Current, movement & time |
| 3 | Pressura | Primordial | The Crushing Depth, pressure & fear |
| 4 | Nautrion | Supreme God | King of the Deep, coral throne |
| 5 | Marineth | Supreme Goddess | Queen of Tides, prophecy |
| 6 | Abyssor | Supreme God | Lord of Trenches, secrets |
| 7 | Luminara | Supreme Goddess | Lady of Bioluminescence, hope |
| 8 | Krakus | Supreme God | Storm Bringer, destruction |

#### **Phase 2: Major Deities (12 entities)**
| # | Name | Domain |
|---|------|--------|
| 9 | Coralith | God of Reef Construction |
| 10 | Pearlessa | Goddess of Treasures |
| 11 | Salinar | God of Salt & Preservation |
| 12 | Ventris | Goddess of Thermal Vents |
| 13 | Glacius | God of Icebergs |
| 14 | Echolus | God of Sound & Whale Song |
| 15 | Shellar | Goddess of Protection |
| 16 | Toxira | Goddess of Venom |
| 17 | Migratus | God of Fish Migrations |
| 18 | Scavenor | God of the Deep Floor |
| 19 | Brinara | Goddess of Shipwrecks |
| 20 | Surgus | God of Waves |

#### **Phase 3A: Heroes & Mortals (8 entities)**
| # | Name | Type |
|---|------|------|
| 21 | Captain Theron Deepdive | Human hero |
| 22 | Silvara the Merborn | Demigod |
| 23 | Keth the Reefbreaker | Villain |
| 24 | Princess Naia of Pearlspire | Mortal |
| 25 | Grusk the Exile | Demigod |
| 26 | The Tidesworn Brotherhood | Hero group |
| 27 | Lyssa the Drowned | Undead hero |
| 28 | Elder Corazon | Mortal sage |

#### **Phase 3B: Heroes & Mortals (7 entities)**
| # | Name | Type |
|---|------|------|
| 29 | Finn the Small | Child hero |
| 30 | Captain Morag Blackwave | Pirate queen |
| 31 | Zephyros the Navigator | Human hero |
| 32 | Serena Coralborn | Mutant |
| 33 | The Pearl Divers (Twins) | Twin heroes |
| 34 | Dreadlord Maw | Corrupted hero |
| 35 | Aria Shellsong | Bard/chronicler |

#### **Phase 4A: Creatures (8 entities)**
| # | Name | Type | Danger |
|---|------|------|--------|
| 36 | Tidecaller Leviathan | Dragon | Legendary |
| 37 | Glassfin Sharks | Beast | Moderate |
| 38 | Coral Wyrm | Dragon | High |
| 39 | Abyss Crawlers | Horror | Extreme |
| 40 | Storm Mantas | Beast | High |
| 41 | Pearled Kraken | Giant | Extreme |
| 42 | Echo Whales | Beast | Low |
| 43 | Venom Blooms | Plant | Moderate |

#### **Phase 4B: Creatures (8 entities)**
| # | Name | Type | Danger |
|---|------|------|--------|
| 44 | Ice Serpents | Dragon | High |
| 45 | Shell Golems | Construct | Moderate |
| 46 | Singing Sirens | Fey | High |
| 47 | Brine Hydra | Dragon | Extreme |
| 48 | Scavenger Eels | Beast | Low |
| 49 | Undertow Beast | Elemental | Extreme |
| 50 | Bloom Jellies | Beast | Low |
| 51 | Migration King | Beast | Moderate |

#### **Phase 4C: Creatures (9 entities)**
| # | Name | Type | Danger |
|---|------|------|--------|
| 52 | Light Dancers | Spirit | Harmless |
| 53 | Pressure Crushers | Elemental | Extreme |
| 54 | Tempest Whale | Beast | Legendary |
| 55 | Pearl Oysters | Beast | Harmless |
| 56 | Tide Pool Guardians | Spirit | Low |
| 57 | Salt Golems | Construct | Moderate |
| 58 | Current Riders | Elemental | Low |
| 59 | Forgotten Depths | Horror | Extreme |
| 60 | Plankton Swarms | Beast | Harmless |

#### **Phase 5: Realms (10 entities)**
| # | Name | Type | Ruler |
|---|------|------|-------|
| 61 | The Luminous Abyss | Underwater | Luminara |
| 62 | The Pressure Forge | Underwater | Pressura |
| 63 | The Frozen Frontier | Underwater | Glacius |
| 64 | The Coral Gardens | Underwater | Coralith |
| 65 | The Storm Zones | Surface | Krakus & Ventris |
| 66 | The Brine Pools | Underwater | Salinar |
| 67 | The Tidewatcher's Horizon | Surface | Tideus |
| 68 | The Pearlescent Depths | Underwater | Pearlessa |
| 69 | The Tidal Sanctuaries | Coastal | Marineth |
| 70 | The Forgotten Deep | Underwater | Unmourned spirits |

#### **Phase 6: Stories (12 entities)**
| # | Title | Type | Words |
|---|-------|------|-------|
| 71 | The First Breath: Creation of the Ocean | Origin | 289 |
| 72 | The Coral Pact: When Gods Learned Cooperation | Legend | 335 |
| 73 | The Storm That Forged A Friendship | Relationship | 361 |
| 74 | The Drowning King and the Pearl of Wisdom | Quest | 478 |
| 75 | The Battle of the Frozen Deep | Battle | 521 |
| 76 | The Prophecy of the Tide Caller | Prophecy | 437 |
| 77 | The Pearl Whisperer's Burden | Legend | 487 |
| 78 | How The Scavenger Became A God | Origin | 520 |
| 79 | The Song That Ended A War | Legend | 474 |
| 80 | The Day The Kraken Wept | Relationship | 589 |
| 81 | The Coral Wyrm's First Battle | Battle | 494 |
| 82 | The Migration That Never Ended | Quest | 495 |

#### **Phase 7: Maps (5 entities)**
| # | Title | Type | Size | Locations |
|---|-------|------|------|-----------|
| 83 | The Ocean Realms - Complete Map | World | 1400×1000 | 8 |
| 84 | The Luminous Abyss - Detailed Map | Realm | 1200×900 | 5 |
| 85 | The Frozen Frontier - Glacius's Domain | Realm | 1200×800 | 5 |
| 86 | The Coral Gardens - Biodiversity Map | Realm | 1300×850 | 6 |
| 87 | Migration Routes - Journey of Migration King | World | 1500×900 | 7 |

### **Total: 87 Entities**
- 35 Characters (3 primordial, 5 supreme, 12 major, 15 heroes/mortals)
- 25 Creatures (dragons, beasts, spirits, constructs, etc.)
- 10 Realms (underwater, surface, coastal domains)
- 12 Stories (origin myths, legends, battles, quests)
- 5 Maps (world maps and realm visualizations)

---

## 🛠️ TECH STACK

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.1.0 | React framework with App Router |
| React | 19.2.3 | UI component library |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| TipTap | 3.14.0 | Rich text editor for stories |
| Konva.js | 10.0.12 | Canvas graphics for maps |
| React-Konva | 19.2.1 | React bindings for Konva |
| Cytoscape.js | 3.33.1 | Graph visualization for relationships |

### **Backend & Database**
| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service |
| PostgreSQL | Relational database |
| Supabase Auth | Authentication with roles |
| Supabase Storage | Image and file storage |
| Row Level Security | Database-level authorization |

### **AI Services**
| Technology | Purpose |
|------------|---------|
| OpenAI GPT-4 | Text generation (planned) |
| OpenAI DALL-E 3 | Image generation (planned) |
| OpenAI Moderation | Content safety (implemented) |

### **Development Tools**
| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| PostCSS | CSS processing |
| tsx | TypeScript execution for scripts |
| dotenv | Environment variable management |

### **Package Dependencies**

```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.2.2",
    "@supabase/auth-helpers-nextjs": "^0.15.0",
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.89.0",
    "@tiptap/extension-character-count": "^3.14.0",
    "@tiptap/extension-placeholder": "^3.14.0",
    "@tiptap/react": "^3.14.0",
    "@tiptap/starter-kit": "^3.14.0",
    "@types/cytoscape": "^3.21.9",
    "cytoscape": "^3.33.1",
    "dotenv": "^17.2.3",
    "konva": "^10.0.12",
    "next": "16.1.0",
    "openai": "^6.15.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "react-hook-form": "^7.68.0",
    "react-konva": "^19.2.1",
    "zod": "^4.2.1"
  }
}
```

---

## 📁 COMPONENT REFERENCE

### **MapCanvas.tsx (1271 lines)**

Full-featured map editor component using Konva.js:

```typescript
interface MapCanvasProps {
  width?: number;           // Canvas width (800-2400)
  height?: number;          // Canvas height (600-1800)
  backgroundColor?: string; // Background color
  locations: Location[];    // Location markers
  onLocationsChange: (locations: Location[]) => void;
  editable?: boolean;       // Edit mode toggle
  mapType?: MapType;        // 'world' | 'regional' | 'city' | 'mystical' | 'other'
}
```

**Features:**
- Location markers with 60+ emoji icons
- 4 marker styles: pin, circle, hex, star
- Path drawing with customizable color/width/dashed
- Region polygons
- Undo/redo history (50 states)
- Grid overlays (square, hex)
- Snap-to-grid
- Background textures
- Type-specific marker restrictions
- Drag-to-reposition locations
- Floating edit panel

### **RichTextEditor.tsx (202 lines)**

TipTap-based rich text editor for story creation:

```typescript
interface RichTextEditorProps {
  content: string;          // TipTap JSON content
  onChange: (content: string, wordCount: number) => void;
  placeholder?: string;     // Placeholder text
}
```

**Features:**
- Bold, italic, strikethrough
- Headings (H1, H2, H3)
- Bullet and numbered lists
- Blockquotes
- Code blocks
- Horizontal rules
- Character and word count
- JSON content storage

### **RelationshipGraph.tsx (271 lines)**

Cytoscape.js-based relationship visualization:

```typescript
interface RelationshipGraphProps {
  characters: Character[];
  relationships: Relationship[];
  onNodeClick?: (characterId: string) => void;
  onEdgeClick?: (relationship: Relationship) => void;
  selectedLayout?: LayoutType;
  filteredRelationshipTypes?: string[];
  className?: string;
}
```

**Features:**
- Interactive node-link diagram
- Character nodes with type coloring
- Relationship edges with labels
- Multiple layouts (force-directed, hierarchical, circular, grid)
- Click handlers for nodes and edges
- Zoom and pan controls
- Relationship type filtering

### **AddRelationshipForm.tsx**

Form component for creating character relationships:

**Features:**
- Character 1 and Character 2 selection
- Relationship type dropdown
- Strength level selection
- Description text area
- Validation

---

## 🔧 UTILITY LIBRARIES

### **mapTypes.ts (278 lines)**

Map type configuration and utilities:

```typescript
export type MapType = 'world' | 'regional' | 'city' | 'mystical' | 'other';

export const MAP_TYPE_CONFIGS: Record<MapType, MapTypeConfig>;

export function getMarkersForType(mapType: MapType): MarkerIcon[];
export function getInstructionsForType(mapType: MapType): string;
export function getValidationMessageForType(mapType: MapType, locationCount: number): string;
export function getSuggestedMarkerStyle(mapType: MapType): string;
export function isMarkerStyleAllowed(mapType: MapType, style: string): boolean;
```

### **relationshipTypes.ts**

Relationship type definitions:

```typescript
export interface Relationship {
  id: string;
  character_1_id: string;
  character_2_id: string;
  relationship_type: string;
  strength: 'weak' | 'moderate' | 'strong' | 'unbreakable';
  description: string;
  is_bidirectional: boolean;
}

export const RELATIONSHIP_TYPES = [
  'parent-child', 'sibling', 'spouse', 'ancestor',
  'ally', 'rival', 'enemy', 'mentor-student', 'friend',
  'ruler-subject', 'worshipper-deity', 'creator-creation',
  'lover', 'betrothed', 'unrequited',
  'other'
];
```

### **cytoscape-config.ts**

Cytoscape.js styling and layout configuration:

```typescript
export type LayoutType = 'force-directed' | 'hierarchical' | 'circular' | 'grid';

export const cytoscapeStylesheet: cytoscape.StylesheetStyle[];
export function getLayoutConfig(layout: LayoutType): cytoscape.LayoutOptions;
```

---

## 📜 SCRIPTS REFERENCE

### **Data Population Scripts**

```bash
# Seed basic test data
npx tsx scripts/seed-test-data.ts

# Create 115 student accounts
npx tsx scripts/bulk-create-students.ts

# Create single test account
npx tsx scripts/create-test-student.ts

# Populate Oceanborn Legends (run in order)
npx tsx scripts/oceanborn-phase-1-fixed.ts  # 8 divine entities
npx tsx scripts/oceanborn-phase-2.ts         # 12 major deities
npx tsx scripts/oceanborn-phase-3a.ts        # 8 heroes
npx tsx scripts/oceanborn-phase-3b.ts        # 7 heroes
npx tsx scripts/oceanborn-phase-4a.ts        # 8 creatures
npx tsx scripts/oceanborn-phase-4b.ts        # 8 creatures
npx tsx scripts/oceanborn-phase-4c.ts        # 9 creatures
npx tsx scripts/oceanborn-phase-5.ts         # 10 realms
npx tsx scripts/oceanborn-phase-6.ts         # 12 stories
npx tsx scripts/oceanborn-phase-7.ts         # 5 maps
```

### **Utility Scripts**

```bash
# Check mythology data
npx tsx scripts/check-myths.ts

# Check all data
npx tsx scripts/check-all.ts

# Clean up duplicate mythologies
npx tsx scripts/cleanup-duplicate-mythologies.ts

# Reset student password
npx tsx scripts/reset-student-password.ts
```

---

## 🚀 DEPLOYMENT

### **Environment Variables Required**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (for AI features)
OPENAI_API_KEY=your-openai-key
```

### **Development Server**

```bash
cd mythology-project/app
npm run dev
# Opens at http://localhost:3000
```

### **Production Build**

```bash
cd mythology-project/app
npm run build
npm start
```

### **Vercel Deployment**

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

---

## 📅 DEVELOPMENT TIMELINE

### **Completed Work**

| Date | Phase | Work Completed |
|------|-------|----------------|
| Dec 18, 2025 | Phase 0 | Project setup, Next.js, Supabase integration |
| Dec 18, 2025 | Phase 1A | Authentication system, profiles, classrooms |
| Dec 19, 2025 | Phase 1B-1G | Characters, creatures, gallery, teacher tools, moderation |
| Dec 20, 2025 | Phase 2A | TipTap story editor integration |
| Dec 20, 2025 | Phase 2B | Konva.js map system with type differentiation |
| Dec 21, 2025 | Phase 2C | Cytoscape.js relationship graphs |
| Dec 19-24, 2025 | Test Data | Oceanborn Legends 87 entities populated |
| Dec 24, 2025 | UI Update | Realms display added to mythology detail page |

### **Upcoming Work**

| Phase | Description | Estimated Hours |
|-------|-------------|-----------------|
| Phase 2D | AI Battles (GPT-4 narration) | 20-30 |
| Phase 2E | Crossovers (inter-mythology) | 20-30 |
| Phase 3 | Gamification (points, badges, levels) | 40-50 |
| Phase 4 | Collaboration (real-time, chat) | 50-60 |
| Phase 5 | AI Enhancement (DALL-E, Midjourney) | 40-50 |
| Phase 6 | Presentations (TTS, exports) | 30-40 |
| Phase 7 | Polish & Launch | 30-40 |

---

## 🔒 SECURITY

### **Authentication**
- Supabase Auth with email/password
- Role-based access (teacher, student)
- Session management with middleware
- Protected routes

### **Database Security**
- Row Level Security (RLS) on all tables
- Service role key for admin operations only
- Foreign key constraints
- Input validation with Zod

### **Content Safety**
- OpenAI Moderation API integration
- Teacher moderation queue
- Content visibility controls
- Age-appropriate guidelines

---

## 📞 SUPPORT

### **Documentation**
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [TipTap Docs](https://tiptap.dev)
- [Konva.js Docs](https://konvajs.org/docs/)
- [Cytoscape.js Docs](https://js.cytoscape.org/)

### **Project Documentation**
- See [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for issue resolution
- See [docs/TEACHER_ONBOARDING.md](docs/TEACHER_ONBOARDING.md) for educator guidance
- See [docs/STUDENT_GUIDE.md](docs/STUDENT_GUIDE.md) for student help

---

## 📄 LICENSE

*To be determined based on deployment context (school district, open source, etc.)*

---

## 🎉 ACKNOWLEDGMENTS

Built for middle school educators and students who want to explore mythology through creative digital storytelling.

**Let's build something legendary.** 🏛️✨

---

*Last Updated: December 24, 2025*
*Total Documentation: ~50,000+ lines across all files*
