# 🗡️ MYTHOLOGY PROJECT - MASTER PLAN
## Code Name: PANTHEON FORGE

**Last Updated:** December 30, 2025  
**Status:** Phase 4D Complete + Voice Input & AI Name Suggestions  
**Progress:** 96% (Phases 0-3 ✅, Phase 4A-D ✅, Voice/AI ✅, Phases 4E-7 ⏸️)

---

## 📍 PROJECT STATUS

### **✅ PHASES 0-4D: COMPLETE**

**Completed Phases:**
- ✅ Phase 0: Planning & Architecture
- ✅ Phase 1: Foundation/MVP (Auth, CRUD, Galleries, Teacher Tools)
- ✅ Phase 2A: Stories (TipTap rich text editor)
- ✅ Phase 2B: World Maps (Konva.js with type differentiation)
- ✅ Phase 2C: Relationships (Cytoscape.js) & Realms
- ✅ Phase 2D: AI Battles (Combat system with animated playback + GPT-4 narration)
- ✅ Phase 2E: Crossover Events (Cross-mythology battles, alliances, collaborative stories)
- ✅ Phase 3: Gamification (Points, badges, levels, streaks, leaderboards)
- ✅ Phase 4A: AI Image Generation Core (Math Quiz tokens, Nano Banana/DALL-E, Safety system)
- ✅ Phase 4B: Battle Integration (Battle scene generation, victory/defeat cards)
- ✅ Phase 4C: Collectibles (Trading cards with 5 rarities, stat cards, collection gallery)
- ✅ Phase 4D: Creative Exports (Comic strips, prophecy scrolls, realm postcards, wanted posters)

**Test Data:** Oceanborn Legends (87 entities: 35 chars, 25 creatures, 10 realms, 12 stories, 5 maps, 50+ relationships)

### **⏸️ REMAINING PHASES**

**Pending:**
- ⏸️ Phase 4E: Community Features (Image sharing, featured showcase)
- ⏸️ Phase 4F: Games/Polish (Mini-games, achievement badges)
- ⏸️ Phase 5: Real-time Collaboration (Yjs CRDT)
- ⏸️ Phase 6: Presentations
- ⏸️ Phase 7: Polish & Launch

---

## 🎯 MISSION OBJECTIVE
Build a web platform where 6th-8th graders create, manage, and showcase their original mythologies with gods, heroes, and world-building elements.

---

## 🏗️ ARCHITECTURE OVERVIEW

### **Frontend**
- **Framework**: React (Next.js for SEO + easy deployment)
- **Styling**: Tailwind CSS (fast, customizable, student-friendly themes)
- **Hosting**: Netlify (free tier, auto-deploys from Git)

### **Backend**
- **Database**: Supabase (PostgreSQL + real-time + auth + storage)
- **Authentication**: Supabase Auth (teacher admin vs student accounts)
- **File Storage**: Supabase Storage (student artwork uploads)

### **AI Integration** (Phase 2)
- **Image Generation**: OpenAI DALL-E or Stability AI
- **Text Assistance**: GPT-4 for lore generation/story prompts
- **Rate Limiting**: Teacher-controlled credits to prevent spam

---

## 📊 DATABASE SCHEMA (Initial Draft)

### **Tables:**

#### `users`
- `id` (uuid)
- `email` (string)
- `role` (enum: 'student', 'teacher', 'admin')
- `display_name` (string)
- `created_at` (timestamp)

#### `mythologies`
- `id` (uuid)
- `name` (string) - "The Northern Frost Pantheon"
- `geography_type` (enum: desert, mountain, ocean, forest, tundra, etc.)
- `description` (text)
- `created_by` (uuid → users)
- `group_members` (array of user_ids)
- `created_at` (timestamp)

#### `characters`
- `id` (uuid)
- `mythology_id` (uuid → mythologies)
- `created_by` (uuid → users)
- `name` (string) - "Volgar the Frostborn"
- `character_type` (enum: god, demigod, hero, mortal, legendary_figure, founder)
- `archetype` (enum: hero, trickster, warrior, wise_elder, nature_spirit, etc.)
- `domain` (string) - "Ice, Winter, Endurance"
- `description` (text) - Full lore
- `geography_connection` (text) - How their environment shaped them
- `image_url` (string) - Link to uploaded/generated image
- `created_at` (timestamp)

#### `creatures` *(NEW - Bestiary Feature)*
- `id` (uuid)
- `mythology_id` (uuid → mythologies)
- `created_by` (uuid → users)
- `name` (string) - "Frost Wyrm"
- `creature_type` (enum: beast, monster, magical_being, spirit, undead, construct, hybrid, elemental, dragon, other)
- `alignment` (enum: good, neutral, evil, ambiguous, lawful, chaotic)
- `intelligence_level` (enum: non_sentient, animal_intelligence, sentient, highly_intelligent)
- `size_category` (enum: tiny, small, medium, large, huge, gargantuan)
- `habitat` (string) - "Frozen mountain peaks"
- `description` (text) - Physical appearance, behavior, ecology
- `abilities` (text) - Special powers, attacks, defenses
- `cultural_significance` (text) - Role in mythology/society
- `origin_story` (text) - How they came to be
- `weaknesses` (text) - What can defeat/harm them
- `related_characters` (array of character_ids) - Which gods/heroes interact with them
- `is_unique` (boolean) - Is this a unique entity or a species?
- `danger_level` (enum: harmless, minor_threat, dangerous, deadly, catastrophic)
- `image_url` (string)
- `created_at` (timestamp)

#### `relationships`
- `id` (uuid)
- `character_1_id` (uuid → characters)
- `character_2_id` (uuid → characters)
- `relationship_type` (enum: parent, sibling, rival, ally, enemy)
- `description` (text)

#### `stories`
- `id` (uuid)
- `mythology_id` (uuid → mythologies)
- `title` (string)
- **Bestiary system** (add creatures with alignment, abilities, danger levels)
✅ Upload artwork (image files)
✅ View/explore other students' mythologies (gallery view)
✅ Simple pantheon tree visualization (relationships between gods)
✅ **Creature catalog view** (browse bestiary by alignment, type, danger level)
✅ **Example mythologies** (Greek & Harry Potter as reference template
- `created_at` (timestamp)

#### `ai_generations`
- `id` (uuid)
- `user_id` (uuid → users)
- `type` (enum: image, text)
- `prompt` (text)
- `result_url` (string)
- `credits_used` (int)
- `created_at` (timestamp)

---

## 🎨 KEY FEATURES

### **Phase 1: Core Platform (MVP)**
✅ User authentication (teacher creates class, adds students)
✅ Create mythology (name, geography type, description)
✅ Add characters to mythology (form with archetype, domain, lore)
✅ Upload artwork (image files)
✅ View/explore other students' mythologies (gallery view)
✅ Simple pantheon tree visualization (relationships between gods)

### **Phase 2: AI Enhancement**
- AI image generator (text prompt → character visual)
- AI lore assistant (suggest story conflicts, character traits)
- AI geography advisor (suggests cultural elements based on terrain)
- Teacher dashboard with AI credit management

### **Phase 3: Collaboration & Growth**
- Real-time collaborative editing
- Comments/feedback system between students
- "Mythology Crossover Events" (inter-pantheon stories)
- Export to PDF (portfolio piece)
- Timeline view (mythology grows over semester)

---

## 🎭 USER FLOWS

### **Teacher Flow:**
1. Sign up → Create classroom
2. Generate student invite codes/emails
3. Set project parameters (due dates, AI credit limits)
4. Monitor student progress (dashboard)
5. Review/grade submissions

### **Student Flow:**
1. Sign in with classroom code
2. Create/join mythology (solo or group)
3. Add characters (fill out form + upload/generate image)
4. Define relationships between characters
5. Write conflict stories
6. Explore other mythologies
7. Submit for grading

---

## 🎯 PAGES/ROUTES

```
/                          → Landing page (public)
/login                     → Auth page
/dashboard                 → Student/Teacher home
/mythology/create          → New mythology form
/mythology/[id]            → View specific mythology
/mythology/[id]/edit       → Edit mythology details
/character/create          → Add character form
/character/[id]            → Character profile page
/character/[id]/edit       → Edit character
/gallery                   → Browse all mythologies
/ai-studio                 → AI generation tools
/admin                     → Teacher controls
```

---

## 🔥 TECH STACK DECISIONS

### **Why Next.js?**
- Server-side rendering (SEO for school showcase)
- API routes (handle AI requests securely)
- Easy deployment to Netlify/Vercel

### **Why Supabase?**
- Free tier generous for classroom use
- Built-in auth (no rolling our own)
- Real-time subscriptions (live collaboration later)
- Row-level security (students only edit their own)
- PostgreSQL = relational data (perfect for mythology relationships)

### **Why Tailwind?**
- Fast styling
- RespDEVELOPMENT ROADMAP

### **🔵 PHASE 0: PLANNING & ARCHITECTURE** *(Current - Dec 17)*
- ✅ Define project scope and features
- ✅ Design database schema
- ✅ Plan content safety systems
- ✅ Document environment setup
- ⏭️ Final architecture approval

### **🟢 PHASE 1: FOUNDATION (MVP)** *(Target: 1-2 weeks)*
**Goal**: Basic functional platform for students to create mythologies

**Phase 1A-1G: COMPLETED ✅**
- ✅ Next.js 14 project with TypeScript
- ✅ Supabase integration (database + auth + storage)
- ✅ Database tables (users, mythologies, characters, creatures, stories, maps)
- ✅ Authentication (teacher/student roles)
- ✅ Full CRUD operations for characters and creatures
- ✅ Image upload system
- ✅ Gallery view with filtering
- ✅ Visibility controls
- ✅ Teacher dashboard
- ✅ Moderation system

**Phase 1 Deliverable**: ✅ COMPLETE - Students can create mythologies, add characters/creatures, upload images, control visibility

---

### **🟡 PHASE 2: ADVANCED FEATURES** *(CURRENT - Dec 20)*
**Goal**: Rich multimedia world-building tools

**Phase 2A: Story System - COMPLETED ✅**
- ✅ TipTap rich text editor integration
- ✅ Story creation/editing with formatting
- ✅ Character tagging in stories
- ✅ Story visibility controls
- ✅ Story gallery view

**Phase 2B: World Maps - COMPLETED ✅**
- ✅ Konva.js canvas integration
- ✅ 004_maps.sql migration created (ready to apply)
- ✅ MapCanvas component (850 lines, 4 marker styles, undo/redo)
- ✅ Map creation form with type selector (5 types: world/regional/city/mystical/other)
- ✅ Map detail viewer (read-only mode)
- ✅ Wired into mythology detail page
- ✅ Asset strategy document (MAP_ASSETS_STRATEGY.md)
- ✅ Map type differentiation design (MAP_TYPE_DIFFERENTIATION.md - 400 lines research)
- ✅ **Type Differentiation Implemented:**
  - ✅ Type-specific canvas size constraints (world: 2400×1800, city: 1200×900, etc.)
  - ✅ Marker style restrictions per type (world: circle/hex only, city: pin/circle/star, etc.)
  - ✅ Marker libraries (60+ categorized icons: terrain, political, urban, magical)
  - ✅ Type-specific instructions and validation messages
  - ✅ Dynamic dimension updates on type selection
  - ✅ Comprehensive test plan (TEST_PLAN_MAP_TYPES.md)

**Next Steps:**
- [ ] Phase 2D: AI Battles (next up)
- [ ] Phase 2E: Crossover Events

**Phase 2C: Relationship Graphs & Realms - COMPLETED ✅**
- ✅ Cytoscape.js integration (v3.33.1)
- ✅ 004_maps_and_relationships.sql migration applied
- ✅ 005_realms.sql migration applied
- ✅ RelationshipGraph component (271 lines)
- ✅ AddRelationshipForm component
- ✅ Visual relationship graph with 8 relationship types
- ✅ 5 layout algorithms (force-directed, hierarchical, circular, grid, random)
- ✅ Click/drag/filter/export interactions
- ✅ Realms table and UI display in mythology detail page
- ✅ **Test Data:** 50+ relationships in Oceanborn Legends

**Phase 2D: AI Battles** *(Not Started - NEXT UP)*
- [ ] Combat stats schema (HP, Attack, Defense, Speed)
- [ ] Turn-based combat simulation engine
- [ ] GPT-4 battle narration integration
- [ ] Battle history tracking
- [ ] Battle results as story content

**Phase 2E: Crossover Collaborations** *(Not Started)*
- [ ] Inter-mythology story creation
- [ ] Shared world events
- [ ] Collaborative editing

**Phase 2 Deliverable**: Rich multimedia platform with maps, stories, relationships, and interactive features

---

### **🟠 PHASE 3: AI ENHANCEMENT** *(Target: 1-2 weeks)*
**Goal**: AI-powered worldbuilding assistance

- [ ] Setting Primer Generator (AI worldbuilding prompts)
- [ ] Consistency Checker (detect contradictions)
- [ ] Archetype Expander (genre-specific suggestions)
- [ ] Conflict Generator (story ideas)
- [ ] AI image generation (DALL-E integration)
- [ ] Rate limiting system (prevent abuse)
- [ ] Teacher AI credit management

**Phase 3 Deliverable**: Students have AI assistants for creativity without doing the work for them

---

### **🔴 PHASE 4: ADVANCED FEATURES** *(Target: 2+ weeks)*
**Goal**: Collaboration, relationships, and showcase

- [ ] Pantheon relationship mapping (visual tree)
- [ ] Story/conflict writing system
- [ ] Group collaboration tools (shared mythologies)
- [ ] Comments/feedback between students
- [ ] Export to PDF (portfolio piece)
- [ ] Timeline view (mythology evolution)
- [ ] Public showcase mode (parent night)
- [ ] Grading/submission system

**Phase 4 Deliverable**: Full-featured platform for semester-long project

---

### **🟣 PHASE 5: POLISH & SCALE** *(Ongoing)*
**Goal**: Production-ready + long-term features

- [ ] Performance optimization
- [ ] Accessibility (WCAG 2.1 AA compliance)
- [ ] Mobile responsive design
- [ ] Cross-mythology events (multiverse interactions)
- [ ] Parent read-only accounts
- [ ] Analytics dashboard for teacher
- [ ] Backup/export systems
- [ ] Documentation for future teachers

**Phase 5 Deliverable**: Scalable platform ready for multiple classrooms--|
| Netlify | 100GB bandwidth/month | More than enough for classroom |
| Supabase | 500MB database, 1GB storage | Scale up if needed (~$25/mo) |
| OpenAI API | Pay-per-use | ~$0.02/image, rate-limit to control costs |

**Budget**: Could run entirely free for pilot, ~$25-50/mo if scaling AI features

---

## 📅 TIMELINE

### **Week 1-2: MVP Development**
- Set up Next.js + Supabase
- Build auth system
- Create mythology & character forms
- Basic gallery view

### **Week 3: Polish + Test**
- Teacher dashboard
- Image uploads working
- Relationship mapping
- Deploy to Netlify

### **Week 4+: Phase 2**
- AI integration
- Advanced features
- Student testing & feedback

---

## 🛡️ CONTENT SAFETY & GUARDRAILS (CRITICAL)

### **The Law of the Land**
- **35-40 students** in the classroom
- **Read-only access** to peers' work (can view, cannot edit)
- **Granular visibility controls** (students choose what to show/hide)
- **Teacher-approved guardrails** (explicit moderation rules)
- **Zero tolerance** for unsafe content

---

### **VISIBILITY & PRIVACY SYSTEM**

#### **Student Controls (Per Item)**
Each student can set visibility for:
- **Entire Mythology**: Public to class / Private (teacher-only) / Hidden (draft mode)
- **Individual Characters**: Visible / Hidden / Teacher-review-only
- **Stories/Lore**: Visible / Hidden / Teacher-review-only
- **Images**: Visible / Hidden / Teacher-review-only
- **Comments**: Enable/Disable on their content

#### **UI Implementation**
- Toggle switches on each content piece: 👁️ **Visible to Class** | 🔒 **Teacher Only** | ✏️ **Draft/Hidden**
- Banner on student dashboard: "Your mythology is currently [PUBLIC/PRIVATE]"
- Confirmation modal: "Are you sure you want to make this visible to your classmates?"

#### **Teacher Override**
- Teacher can **force-hide** any content (overrides student choice)
- Teacher can **lock visibility** settings (prevent student from making public until reviewed)
- Teacher dashboard shows: "15 items awaiting review, 8 hidden by you"

---

### **CONTENT MODERATION GUARDRAILS**

#### **Tier 1: AUTOMATIC BLOCKING (AI + Keyword Filters)**

**BLOCKED CONTENT CATEGORIES:**
1. **Sexual Content**: Any depictions, descriptions, or references to sexual activity, anatomy, or situations
2. **Child Safety Violations**: ANY content depicting minors in dangerous, inappropriate, or sexual contexts
3. **Illegal Activities**: Drug use, weapons violence, criminal instructions
4. **Hate Speech**: Racial slurs, discriminatory language, religious intolerance
5. **Profanity & Vulgarity**: Curse words, sexual language, graphic descriptions of violence
6. **Personal Information**: Phone numbers, addresses, last names (FERPA compliance)
7. **External Links**: No URLs unless teacher-approved domains

**HOW IT WORKS:**
- **Text Filtering**: OpenAI Moderation API + custom keyword blocklist
- **Image Filtering**: AI image moderation (detect inappropriate visuals)
- **Real-time Scanning**: Content checked BEFORE save/submit
- **Blocked Action**: Red banner: "This content violates classroom guidelines. See rules."

#### **Tier 2: FLAGGED FOR REVIEW**

**AUTO-FLAGGED CONTENT:**
- Borderline language (violence descriptions, intense themes)
- References to real-world tragedies or sensitive topics
- Student reports (peer flagging system)
- AI uncertainty (moderation score between 0.5-0.7)

**TEACHER REVIEW QUEUE:**
- Dashboard shows flagged items: "⚠️ 3 items need review"
- Teacher can: **Approve** | **Reject** | **Request Edit** | **Hide**
- Student gets notification: "Your content is under review. You'll be notified within 24 hours."

#### **Tier 3: TEACHER-APPROVED EXCEPTIONS**

Some mythology themes might trigger filters but are educational:
- "God of War" (violence context)
- "Fertility deity" (biological/agricultural context)
- Greek/Roman mythology parallels (historical accuracy)

**EXCEPTION PROCESS:**
1. Teacher reviews flagged content
2. If contextually appropriate, teacher can **whitelist** specific content
3. Whitelist logged: `[Teacher: John Doe] Approved "Ares battle scene" on 12/17/2025 - Reason: Historical mythology parallel`
4. Student notified: "Your content was approved by your teacher."

---

### **GUARDRAIL VISIBILITY & TRANSPARENCY**

#### **Student-Facing Rules Page**
Accessible from every page (footer link): **"Content Guidelines"**

**Page Contents:**
```
🛡️ MYTHOLOGY PROJECT - CONTENT RULES

To keep our classroom safe and respectful, the following rules apply:

✅ ALLOWED:
- Creative mythological stories (gods, heroes, adventures)
- Fantasy violence (battles, conflicts between deities)
- Themes of good vs. evil, courage, wisdom
- References to nature, elements, culture

❌ NOT ALLOWED:
- Sexual content or romantic descriptions
- Real curse words or inappropriate language
- Descriptions of real-world violence or crime
- Anything that makes classmates uncomfortable
- Sharing personal information (addresses, phone numbers)
- Hate speech or bullying language

⚠️ REQUIRES TEACHER APPROVAL:
- Intense battle scenes or violence
- References to death or the underworld
- Cultural or religious themes (must be respectful)

🚨 ZERO TOLERANCE:
- Any content depicting harm to children
- Illegal activities or dangerous behavior
- Bullying or targeting classmates

If your content is blocked, you'll see a message. 
Ask your teacher if you have questions!

[Last Updated by: Mr./Ms. [Teacher Name] on 12/17/2025]
```

#### **Teacher Admin Dashboard - Guardrail Control Panel**

**Section: "Active Content Filters"**

Table showing all active rules:
| Rule | Status | Last Modified | Actions |
|------|--------|---------------|---------|
| Block sexual content | ✅ Active | 12/17/2025 | Edit \| View Blocks |
| Block profanity | ✅ Active | 12/17/2025 | Edit \| View Blocks |
| Flag violence descriptions | ✅ Active | 12/17/2025 | Edit \| View Flags |
| Block external links | ✅ Active | 12/17/2025 | Edit \| View Blocks |
| CSAM detection | 🔒 Mandatory | N/A | View Logs |

**Teacher Controls:**
- **Add Custom Keywords**: Teacher adds specific words to blocklist
- **Adjust Sensitivity**: Slider for AI moderation threshold (Strict ↔ Permissive)
- **Review Logs**: See all blocked content attempts (anonymized)
- **Approve Exceptions**: Whitelist specific flagged content
- **Export Report**: Monthly safety report for admin

**Audit Trail:**
Every guardrail change logged:
```
[12/17/2025 10:30 AM] Teacher John Doe enabled "Block profanity"
[12/17/2025 10:35 AM] Teacher John Doe added custom keyword: "damn"
[12/17/2025 11:00 AM] Teacher John Doe approved flagged content: Character_ID_123
```

---

### **TECHNICAL IMPLEMENTATION**

#### **Moderation Pipeline**

```
Student submits content
    ↓
[1] Client-side pre-check (basic keyword scan)
    ↓
[2] Server receives content
    ↓
[3] OpenAI Moderation API (sexual, hate, violence, self-harm)
    ↓
[4] Custom keyword filter (teacher-defined blocklist)
    ↓
[5] Image moderation (if image present)
    ↓
[6] Decision:
    - PASS → Save to database (visible per privacy settings)
    - FLAG → Save as "pending review" (hidden, notify teacher)
    - BLOCK → Reject save, show error to student
```

#---

## 🌌 INFINITE MYTHOLOGY SETTINGS (THE GAME CHANGER)

### **Core Philosophy**
**Mythologies are NOT confined to ancient civilizations.** Students can create pantheons in:
- Cyberpunk megacities (gods of the Net, AI deities, corporate titans)
- Post-apocalyptic wastelands (radiation spirits, survivor legends)
- Space opera empires (stellar gods, void entities, hyperspace navigators)
- Steampunk Victorian era (machine spirits, clockwork prophets)
- Fae courts & folklore (Wild Hunt, seasonal courts, trickster spirits)
- Underwater kingdoms (deep sea leviathans, coral guardians)
- Desert punk Mad Max worlds (sand gods, fuel deities, road warriors)
- Medieval fantasy (classic but personalized)
- Modern urban fantasy (gods hiding in cities, subway spirits)
- Bio-punk genetic labs (evolution deities, mutation lords)
- **Literally anything they can imagine**

### **The "Setting Builder" System**

#### **Step 1: Choose Your Universe**
When creating a mythology, students select:

**TIMEFRAME:**
- Ancient Past (traditional mythology)
- Medieval/Renaissance
- Industrial Revolution
- Modern Day (20th-21st century)
- Near Future (next 100 years)
- Far Future (space age, post-human)
- Post-Apocalyptic
- Timeless/Mythic (no specific era)

**GENRE/AESTHETIC:**
- Fantasy (high fantasy, dark fantasy, fairy tale)
- Sci-Fi (space opera, cyberpunk, biopunk, hard sci-fi)
- Steampunk/Dieselpunk
- Horror/Gothic
- Urban Fantasy
- Post-Apocalyptic
- Alternate History
- Surreal/Dreamlike
- **Mix & Match** (cyberpunk + medieval = techno-knights?)

**PRIMARY SETTING:**
- Mountains/Highlands
- Oceans/Islands
- Deserts/Wastelands
- Forests/Jungles
- Tundra/Arctic
- Urban/City
- Underground/Caves
- Sky/Floating Islands
- Space/Void
- Digital/Virtual Realm
- Multiple Realms (students define)

#### **Step 2: AI-Generated "Setting Primer"**

Based on selections, AI generates a **custom worldbuilding prompt guide**:

**EXAMPLE: Cyberpunk + Ocean + Near Future**
```
Your mythology exists in a flooded megacity where rising seas 
drowned coastal cities. Technology and water intertwine. 

Consider:
- Do your gods represent digital vs. natural forces?
- How did the flood reshape belief systems?
- Are there deities of clean water vs. polluted seas?
- Do hackers worship network gods?
- What happens to old gods when cities sink?

Suggested archetypes for your setting:
- The Drowned Prophet (pre-flood survivor)
- Data Kraken (AI merged with sea creature)
- Coral Queen (nature reclaiming tech)
- Signal Ghost (deity of lost communications)
```

**EXAMPLE: Post-Apocalyptic + Desert + Timeless**
```
Your mythology thrives in an endless wasteland where 
resources are scarce and survival is worship.

Consider:
- Are your gods born from radiation, drought, or war?
- What do people value most? (Water, fuel, shelter, memory?)
- Do old world relics have spiritual power?
- Are there prophets who remember the "before times"?
- What causes conflict between deities?

Suggested archetypes:
- The Water Bearer (god of scarce resources)
- The Rust King (decay and entropy deity)
- The Caravan Guide (protection and journey)
- The Sandstorm Trickster (chaos of the wastes)
```

#### **Step 3: Consistency AI Assistant**

As students build their mythology, AI checks for **internal consistency**:

**CONSISTENCY CHECKS:**
- **Tech Level**: "You said this is medieval, but your god uses lasers. Want to adjust?"
- **Cultural Logic**: "Your desert people worship a god of ice. What's the story behind that?"
- **Naming Conventions**: "Your character names are Greek-style, but your setting is cyberpunk. Intentional?"
- **Visual Aesthetic**: "Your images show high-tech cities, but your lore describes villages. Which is accurate?"
- **Power Scaling**: "This demigod seems more powerful than your main god. Want to clarify hierarchy?"

**HOW IT WORKS:**
- **Passive Mode**: AI suggestion banner appears: "💡 Consistency Tip: [suggestion]"
- **Active Mode**: Student clicks "Check My Mythology" → AI generates report
- **Not Blocking**: Students can IGNORE suggestions (maybe they want intentional contradictions)
- **Learning Tool**: Teaches worldbuilding consistency

#### **Step 4: Genre-Specific Prompts**

AI generates **targeted questions** based on genre:

**For Cyberpunk:**
- "What corporations control your world?"
- "How do people interface with technology?"
- "Is there a resistance against the gods?"

**For Fantasy:**
- "What magic system exists?"
- "Are there prophecies or chosen ones?"
- "What creatures inhabit your world?"

**For Post-Apocalypse:**
- "What caused the collapse?"
- "What remnants of the old world remain?"
- "How do survivors organize?"

**For Space Opera:**
- "How many planets/systems exist?"
- "What alien races are there?"
- "How do gods span across space?"

---

### **UI/UX for Setting Creation**

#### **Visual Setting Selector**
Interactive grid with images:
```
[Ancient Forest] [Neon City] [Desert Wasteland]
[Ocean Depths] [Space Station] [Fairy Court]
[Clockwork City] [Volcanic Realm] [Virtual World]
```
Click one → expands with sub-options

#### **The "Vibe Generator"**
Student describes their vision in natural language:
> "I want gods who are like... old machines that gained consciousness in an abandoned factory"

AI suggests:
- **Timeframe**: Post-industrial decay
- **Genre**: Steampunk/Horror
- **Setting**: Urban ruins
- **Themes**: Rebirth, obsolescence, forgotten technology
- **Sample deity**: "The Forge-Mind, god of awakened engines"

#### **Inspiration Library**
Pre-made setting examples (not to copy, but to spark ideas):
- "The Neon Pantheon" (cyberpunk gods of the Net)
- "The Sunken Court" (underwater fae kingdom)
- "The Rust Prophets" (post-apocalyptic machine spirits)
- "The Void Walkers" (space-faring cosmic entities)
- "The Green Rebellion" (solarpunk nature vs. tech)

Each example shows:
- Setting description
- Sample character
- Possible conflicts
- Cultural elements

---

### **Database Schema Updates**

**Add to `mythologies` table:**
```sql
- timeframe (enum: ancient, medieval, industrial, modern, near_future, far_future, post_apocalyptic, timeless)
- genre (enum: fantasy, scifi, cyberpunk, steampunk, horror, urban_fantasy, post_apocalyptic, alternate_history, surreal, mixed)
- primary_setting (text) - From list above
- aesthetic_tags (array) - ["neon", "gritty", "mystical", "mechanical", etc.]
- setting_description (text) - Their custom worldbuilding summary
- consistency_check_enabled (boolean) - Do they want AI suggestions?
```

**New Table: `setting_prompts`**
```sql
- id (uuid)
- timeframe (text)
- genre (text)
- prompt_text (text) - The AI-generated worldbuilding guide
- example_archetypes (json) - Suggested character types
- generated_for_mythology_id (uuid → mythologies)
- created_at (timestamp)
```

**New Table: `consistency_checks`**
```sql
- id (uuid)
- mythology_id (uuid → mythologies)
- check_type (enum: tech_level, cultural_logic, naming, visual, power_scaling)
- ai_suggestion (text)
- student_response (enum: accepted, dismissed, modified)
- created_at (timestamp)
```

---

### **EXAMPLE STUDENT MYTHOLOGIES**

**Mythology 1: "The Network Divine"**
- **Timeframe**: Near Future (2080s)
- **Genre**: Cyberpunk
- **Setting**: Megacity with layered infrastructure
- **Gods**:
  - **Cipher, the Code Weaver**: God of hackers and data flow
  - **NeonMara**: Goddess of advertisements and desire
  - **The Blackout**: Trickster god who causes system failures
- **Cultural Practice**: People leave data offerings at server shrines

**Mythology 2: "The Ashen Court"**
- **Timeframe**: Post-Apocalyptic (300 years after nuclear war)
- **Genre**: Dark Fantasy
- **Setting**: Desert wasteland with buried cities
- **Gods**:
  - **Radiance, the Glowing Mother**: Goddess of radiation (feared and worshipped)
  - **The Salvager**: God of scavenged tech and survival
  - **Dust King**: Lord of forgotten memories
- **Cultural Practice**: Tribes trade stories of the "Before Times" as currency

**Mythology 3: "The Chrono-Fae"**
- **Timeframe**: Timeless
- **Genre**: Urban Fantasy + Folklore
- **Setting**: Modern city with hidden magical layers
- **Gods**:
  - **The Subway Siren**: Goddess who lures travelers between worlds
  - **Coffee Oracle**: Minor deity of late-night revelations
  - **The Wild Hunt**: Pack of motorcycle-riding fae warriors
- **Cultural Practice**: Leaving offerings at crosswalks for safe passage

---

### **AI Tools for Consistency & Creativity**

#### **Tool 1: "The Setting Checker"**
Analyzes all content in mythology:
- Flags anachronisms (unless intentional)
- Highlights contradictions
- Suggests missing worldbuilding elements
- Generates "missing piece" prompts: "You have gods of technology but no cultural practices around tech. Want ideas?"

#### **Tool 2: "The Archetype Expander"**
Student says: "I want a trickster god"
AI generates setting-specific version:
- **In Cyberpunk**: "A hacker god who corrupts corporate data"
- **In Fantasy**: "A shapeshifter who steals from the rich"
- **In Space Opera**: "An alien who bends spacetime for pranks"
- **In Post-Apocalypse**: "A scavenger who hoards and redistributes resources"

#### **Tool 3: "The Conflict Generator"**
Based on their setting + characters, AI suggests mythology-appropriate conflicts:
- **Cyberpunk**: "God of Privacy vs. God of Surveillance"
- **Post-Apocalypse**: "God of Hoarding vs. God of Sharing"
- **Space**: "Earth-born deity vs. Alien cosmic entity"
- **Steampunk**: "Goddess of Steam vs. God of Electricity"

#### **Tool 4: "The Cultural Practice Builder"**
AI suggests rituals/traditions based on setting:
- **Desert**: Water-sharing ceremonies, sandstorm prayers
- **Cyberpunk**: Data encryption rituals, VR pilgrimages
- **Space**: Void-walking rites, stellar navigation prayers
- **Urban**: Subway offerings, street art blessings

---

### **Teacher Benefits**

This system means:
- **Engagement Explosion**: Every kid finds their vibe (gamer kids → sci-fi, fantasy readers → medieval, tech kids → cyberpunk)
- **Differentiation Built-In**: Advanced students create complex multi-realm mythologies, others keep it simple
- **Same Learning Outcomes**: Regardless of setting, they're still learning how environment shapes culture
- **Showcase Diversity**: End-of-semester gallery has 40 WILDLY different mythologies instead of 40 Greek god clones

---

### **Database Schema Addition**

**New Table: `moderation_rules`**
```sql
- id (uuid)
- rule_type (enum: block_keyword, flag_keyword, block_category, sensitivity_level)
- rule_value (text) - The keyword or category
- enabled (boolean)
- creaIMMEDIATE NEXT ACTIONS

### **Option A: Continue Planning**
If you want to refine more concepts before building:
1. **Finalize UI/UX**: Sketch wireframes or describe key screens
2. **Refine Database Schema**: Review tables for any missing pieces
3. **Define User Flows**: Map exact student/teacher workflows
4. **Brainstorm More Features**: Any wild ideas we haven't covered?

### **Option B: Start Building**
If you're ready to go operational:
1. **Initialize Next.js 14 Project**: Set up the foundation with TypeScript + Tailwind
2. **Create Supabase Project**: Set up database and get connection credentials
3. **Build Auth System**: Teacher/student login with role-based access
4. **Create First Pages**: Landing, login, dashboard basics

### **Option C: Hybrid Approach**
Build foundation while continuing to refine:
1. Set up Next.js + basic structure
2. Continue brainstorming features as we build
3. Iterate fast, add complexity as we go

---

## 🗂️ PROJECT FILES CREATED

### Core Documentation
- **[PLAN.md](PLAN.md)** - This master plan (you are here)
- **[AGENT_PERSONALITY.md](AGENT_PERSONALITY.md)** - Personality profile for consistency
- **[BRAINSTORM_DECISIONS.md](BRAINSTORM_DECISIONS.md)** - Major feature decisions and rationale
- **[EXAMPLE_MYTHOLOGIES.md](EXAMPLE_MYTHOLOGIES.md)** - Reference templates (Greek & Harry Potter)

### Feature-Specific Documentation
- **[BESTIARY_FEATURE.md](BESTIARY_FEATURE.md)** - Creature system design and implementation
- **[MAP_ASSETS_STRATEGY.md](MAP_ASSETS_STRATEGY.md)** - Asset creation strategy for world maps
- **[MAP_TYPE_DIFFERENTIATION.md](MAP_TYPE_DIFFERENTIATION.md)** - Complete map type system design (world/regional/city/mystical/other)

### Configuration Files
- **[.env.example](.env.example)** - Environment variable template
- **[.env](.env)** - Active environment variables (git-ignored)
- **[.gitignore](.gitignore)** - Security protections

---

## 🎯 DECISION POINT

**What's the move, boss?**

**A**: Keep brainstorming features/concepts  
**B**: Start building the Next.js foundation now  
**C**: Build while we brainstorm (iterative approach)  

**SAY THE WORD AND WE'RE OPERATIONAL.** 🕶️ mythology, image)
- content_id (uuid)
- student_id (uuid)
- action (enum: blocked, flagged, approved)
- rule_triggered (uuid → moderation_rules)
- teacher_action (text) - If reviewed
- created_at (timestamp)
```

**New Table: `content_visibility`**
```sql
- id (uuid)
- content_type (enum: character, story, mythology, image)
- content_id (uuid)
- visibility (enum: public, teacher_only, hidden)
- locked_by_teacher (boolean)
- student_id (uuid)
- updated_at (timestamp)
```

---

### **EMERGENCY PROTOCOLS**

#### **If Inappropriate Content Slips Through:**
1. **Student/Teacher Flags Content**: "🚩 Report" button on all content
2. **Immediate Auto-Hide**: Reported content hidden until reviewed
3. **Teacher Notification**: Email + dashboard alert
4. **Review & Action**: Teacher investigates within 24 hours
5. **Consequences**: Warning system (1st: warning, 2nd: restricted access, 3rd: parent contact)

#### **CSAM Detection (Non-Negotiable)**
- **Third-party service**: PhotoDNA or similar (Microsoft/Google)
- **Automatic report**: Law enforcement notification (per legal requirements)
- **Immediate account suspension**: Student loses access pending investigation
- **Teacher/Admin alert**: Escalation to school administration

---

## 🎲 OPEN QUESTIONS

1. **Age Verification**: Should we require parent consent for accounts?
2. **Peer Reporting**: Allow students to flag each other's content? (Potential for abuse vs. community moderation)
3. **Appeals Process**: If student disagrees with blocked content, how do they appeal?
4. **Public Showcase**: End-of-semester showcase for parents—separate "curated" version?
5. **Data Retention**: How long do we keep moderation logs? (FERPA compliance)
6. **Gamification**: Badges? "Most creative pantheon" votes?
7. **Accessibility**: Screen reader support? Text-to-speech for stories?

---

## 🔮 FUTURE WILD IDEAS

- **VR Gallery**: Walk through 3D mythology museums
- **Voice Acting**: Students record myth narrations
- **Trading Cards**: Generate printable cards for each character
- **Mythology Battles**: Turn-based strategy game with their gods
- **School-Wide Crossover**: Entire grade's mythologies in shared universe
- **Parent Showcase Night**: QR codes to scan & explore

---

## 🎬 NEXT STEPS

**What's the move, boss?**

1. Start building the Next.js + Supabase foundation?
2. Refine the database schema?
3. Mock up some UI designs?
4. Set up the project structure right now?

**SAY THE WORD AND WE'RE OPERATIONAL.**
