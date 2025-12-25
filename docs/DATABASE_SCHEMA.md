# 🗄️ DATABASE SCHEMA DOCUMENTATION

**Complete PostgreSQL schema for Mythology Builder Platform**  
**Last Updated:** December 24, 2025

---

## 📊 SCHEMA OVERVIEW

**Total Tables Planned:** 29  
**Tables Implemented:** 10  
**Database:** PostgreSQL 15+ (via Supabase)  
**Extensions Required:** `uuid-ossp`, `pgcrypto`

### Implementation Status

| Table | Status | Migration |
|-------|--------|-----------|
| profiles | ✅ Implemented | 001_initial_schema.sql |
| classrooms | ✅ Implemented | 001_initial_schema.sql |
| mythologies | ✅ Implemented | 001_initial_schema.sql |
| characters | ✅ Implemented | 001_initial_schema.sql |
| creatures | ✅ Implemented | 001_initial_schema.sql |
| moderation_flags | ✅ Implemented | 002_moderation.sql |
| stories | ✅ Implemented | 003_stories.sql |
| maps | ✅ Implemented | 004_maps_and_relationships.sql |
| relationships | ✅ Implemented | 004_maps_and_relationships.sql |
| realms | ✅ Implemented | 005_realms.sql |
| battles | ⏸️ Pending | Phase 2D |
| deities | ⏸️ Pending | Phase 2E |
| research_library | ⏸️ Pending | Phase 5 |
| gamification tables | ⏸️ Pending | Phase 3 |
| collaboration tables | ⏸️ Pending | Phase 4 |
| AI tables | ⏸️ Pending | Phase 5 |
| presentation tables | ⏸️ Pending | Phase 6 |

---

## 🏗️ TABLE CATEGORIES

1. **Core Tables** (4): `profiles`, `mythologies`, `characters`, `creatures`
2. **Content Tables** (6): `stories`, `locations`, `maps`, `relationships`, `battles`, `deities`
3. **Research Tables** (2): `research_library`, `deity_comparisons`
4. **Gamification Tables** (6): `points_log`, `badges`, `user_badges`, `daily_challenges`, `avatar_items`, `user_avatar_config`
5. **Collaboration Tables** (7): `version_history`, `chat_rooms`, `chat_room_participants`, `chat_messages`, `notifications`, `user_presence`, `mythology_collaborators`
6. **AI Tables** (3): `image_generations`, `image_prompts`, `style_presets`
7. **Presentation Tables** (4): `presentations`, `presentation_slides`, `presentation_shares`, `presentation_views`

---

## 📋 COMPLETE TABLE REFERENCE

### **1. PROFILES** *(Core - User Management)*

Extends Supabase Auth users with role-based access and student/teacher data.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Student-specific fields
  grade_level INTEGER CHECK (grade_level BETWEEN 6 AND 8),
  classroom_id UUID REFERENCES classrooms(id),
  
  -- Teacher-specific fields
  school_name TEXT,
  district_name TEXT,
  
  -- Gamification
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_count INTEGER DEFAULT 0,
  last_login_date DATE,
  
  -- Theme customization
  theme TEXT DEFAULT 'cyberpunk-neon',
  
  -- Privacy
  profile_visibility TEXT DEFAULT 'classroom' CHECK (profile_visibility IN ('public', 'classroom', 'private'))
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_classroom ON profiles(classroom_id);
CREATE INDEX idx_profiles_points ON profiles(points DESC);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Teachers can view all student profiles in their classroom
CREATE POLICY "Teachers view classroom students"
  ON profiles FOR SELECT
  USING (
    role = 'student' AND
    classroom_id IN (
      SELECT id FROM classrooms WHERE teacher_id = auth.uid()
    )
  );
```

---

### **2. CLASSROOMS** *(Core - Teacher Management)*

Teacher-managed classroom groups for organizing students.

```sql
CREATE TABLE classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  join_code TEXT UNIQUE NOT NULL, -- 6-character code for student signup
  school_year TEXT, -- e.g., "2025-2026"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Settings
  allow_ai_generation BOOLEAN DEFAULT true,
  allow_public_sharing BOOLEAN DEFAULT false,
  content_moderation_level TEXT DEFAULT 'strict' CHECK (content_moderation_level IN ('strict', 'moderate', 'relaxed'))
);

-- Indexes
CREATE INDEX idx_classrooms_teacher ON classrooms(teacher_id);
CREATE UNIQUE INDEX idx_classrooms_join_code ON classrooms(join_code);

-- RLS Policies
ALTER TABLE classrooms ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own classrooms
CREATE POLICY "Teachers manage own classrooms"
  ON classrooms FOR ALL
  USING (teacher_id = auth.uid());

-- Students can view their classroom
CREATE POLICY "Students view own classroom"
  ON classrooms FOR SELECT
  USING (
    id IN (
      SELECT classroom_id FROM profiles WHERE id = auth.uid()
    )
  );
```

---

### **3. MYTHOLOGIES** *(Core - Student Projects)*

Top-level container for each student's mythology world.

```sql
CREATE TABLE mythologies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Classification
  mythology_type TEXT CHECK (mythology_type IN ('greek', 'norse', 'egyptian', 'roman', 'celtic', 'asian', 'african', 'native_american', 'fantasy', 'sci-fi', 'cyberpunk', 'custom')),
  geography TEXT CHECK (geography IN ('mountains', 'ocean', 'desert', 'forest', 'urban', 'islands', 'underground', 'sky', 'space', 'multi-realm', 'other')),
  
  -- Media
  cover_image_url TEXT,
  
  -- Visibility
  visibility TEXT DEFAULT 'classroom' CHECK (visibility IN ('public', 'classroom', 'private')),
  
  -- Status
  is_published BOOLEAN DEFAULT false,
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected')),
  flagged_reason TEXT,
  
  -- Teacher grading
  teacher_grade TEXT,
  teacher_feedback TEXT,
  graded_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_mythologies_creator ON mythologies(created_by);
CREATE INDEX idx_mythologies_type ON mythologies(mythology_type);
CREATE INDEX idx_mythologies_visibility ON mythologies(visibility);
CREATE INDEX idx_mythologies_moderation ON mythologies(moderation_status);

-- RLS Policies
ALTER TABLE mythologies ENABLE ROW LEVEL SECURITY;

-- Users can view their own mythologies
CREATE POLICY "Users view own mythologies"
  ON mythologies FOR SELECT
  USING (created_by = auth.uid());

-- Users can create mythologies
CREATE POLICY "Users create mythologies"
  ON mythologies FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Users can update their own mythologies
CREATE POLICY "Users update own mythologies"
  ON mythologies FOR UPDATE
  USING (created_by = auth.uid());

-- Teachers can view student mythologies in their classroom
CREATE POLICY "Teachers view classroom mythologies"
  ON mythologies FOR SELECT
  USING (
    created_by IN (
      SELECT p.id FROM profiles p
      JOIN classrooms c ON p.classroom_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

-- Public mythologies are viewable by all
CREATE POLICY "Public mythologies viewable"
  ON mythologies FOR SELECT
  USING (visibility = 'public' AND moderation_status = 'approved');

-- Classroom mythologies viewable by classmates
CREATE POLICY "Classroom mythologies viewable"
  ON mythologies FOR SELECT
  USING (
    visibility = 'classroom' AND
    created_by IN (
      SELECT id FROM profiles WHERE classroom_id = (
        SELECT classroom_id FROM profiles WHERE id = auth.uid()
      )
    )
  );
```

---

### **4. CHARACTERS** *(Core - Gods, Heroes, Protagonists)*

Individual characters within mythologies (gods, goddesses, heroes, mortals).

```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID NOT NULL REFERENCES mythologies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT, -- e.g., "God of Thunder"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Archetype
  archetype TEXT CHECK (archetype IN ('god', 'goddess', 'hero', 'mortal', 'demigod', 'titan', 'spirit', 'other')),
  
  -- Domains (for deities)
  domain TEXT[], -- e.g., ['thunder', 'sky', 'justice']
  
  -- Description
  appearance TEXT,
  personality TEXT,
  backstory TEXT,
  powers TEXT[],
  weaknesses TEXT[],
  symbols TEXT[], -- e.g., ['eagle', 'lightning bolt']
  
  -- Media
  image_url TEXT,
  image_generation_prompt TEXT,
  image_style_preset TEXT,
  
  -- Geography connection
  primary_location UUID REFERENCES locations(id),
  realm TEXT, -- e.g., "Olympus", "Underworld"
  
  -- Moderation
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected')),
  flagged_reason TEXT
);

-- Indexes
CREATE INDEX idx_characters_mythology ON characters(mythology_id);
CREATE INDEX idx_characters_archetype ON characters(archetype);
CREATE INDEX idx_characters_moderation ON characters(moderation_status);

-- RLS Policies
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

-- Users can manage characters in their mythologies
CREATE POLICY "Users manage own characters"
  ON characters FOR ALL
  USING (
    mythology_id IN (
      SELECT id FROM mythologies WHERE created_by = auth.uid()
    )
  );

-- Public visibility follows mythology visibility
CREATE POLICY "Public characters viewable"
  ON characters FOR SELECT
  USING (
    mythology_id IN (
      SELECT id FROM mythologies WHERE visibility = 'public' AND moderation_status = 'approved'
    )
  );

-- Classroom visibility
CREATE POLICY "Classroom characters viewable"
  ON characters FOR SELECT
  USING (
    mythology_id IN (
      SELECT m.id FROM mythologies m
      JOIN profiles p ON m.created_by = p.id
      WHERE m.visibility = 'classroom'
      AND p.classroom_id = (SELECT classroom_id FROM profiles WHERE id = auth.uid())
    )
  );
```

---

### **5. CREATURES** *(Core - Bestiary)*

Monsters, magical beings, and creatures within mythologies.

```sql
CREATE TABLE creatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID NOT NULL REFERENCES mythologies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Classification
  creature_type TEXT CHECK (creature_type IN ('beast', 'monster', 'magical_being', 'spirit', 'undead', 'construct', 'hybrid', 'elemental', 'dragon', 'other')),
  alignment TEXT CHECK (alignment IN ('good', 'neutral', 'evil', 'ambiguous', 'lawful', 'chaotic')),
  intelligence TEXT CHECK (intelligence IN ('non-sentient', 'animal', 'sentient', 'highly_intelligent')),
  danger_level TEXT CHECK (danger_level IN ('harmless', 'minor', 'dangerous', 'deadly', 'catastrophic')),
  
  -- Description
  appearance TEXT,
  behavior TEXT,
  habitat TEXT,
  diet TEXT,
  abilities TEXT[],
  weaknesses TEXT[],
  
  -- Combat stats (optional)
  size TEXT CHECK (size IN ('tiny', 'small', 'medium', 'large', 'huge', 'gargantuan')),
  health_points INTEGER,
  attack_power INTEGER,
  defense INTEGER,
  speed INTEGER,
  
  -- Media
  image_url TEXT,
  image_generation_prompt TEXT,
  
  -- Moderation
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected')),
  flagged_reason TEXT
);

-- Indexes
CREATE INDEX idx_creatures_mythology ON creatures(mythology_id);
CREATE INDEX idx_creatures_type ON creatures(creature_type);
CREATE INDEX idx_creatures_danger ON creatures(danger_level);

-- RLS Policies (same pattern as characters)
ALTER TABLE creatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own creatures"
  ON creatures FOR ALL
  USING (
    mythology_id IN (
      SELECT id FROM mythologies WHERE created_by = auth.uid()
    )
  );
```

---

### **6. STORIES** *(Content - Narratives)*

Rich text stories written by students within their mythologies.

```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID NOT NULL REFERENCES mythologies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Content
  content JSONB, -- TipTap JSON format
  excerpt TEXT, -- First 200 characters for previews
  word_count INTEGER DEFAULT 0,
  
  -- Classification
  story_type TEXT CHECK (story_type IN ('origin', 'adventure', 'legend', 'prophecy', 'battle', 'love', 'tragedy', 'comedy', 'other')),
  
  -- Relationships
  character_ids UUID[], -- Characters featured in story
  creature_ids UUID[], -- Creatures featured
  location_ids UUID[], -- Locations featured
  
  -- AI assistance
  ai_assisted BOOLEAN DEFAULT false,
  ai_suggestions JSONB, -- Track AI-generated suggestions
  
  -- Status
  is_draft BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  
  -- Moderation
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected')),
  flagged_reason TEXT,
  
  -- Teacher feedback
  teacher_feedback TEXT,
  teacher_grade TEXT
);

-- Indexes
CREATE INDEX idx_stories_mythology ON stories(mythology_id);
CREATE INDEX idx_stories_type ON stories(story_type);
CREATE INDEX idx_stories_draft ON stories(is_draft);
CREATE INDEX idx_stories_word_count ON stories(word_count DESC);

-- RLS Policies
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own stories"
  ON stories FOR ALL
  USING (
    mythology_id IN (
      SELECT id FROM mythologies WHERE created_by = auth.uid()
    )
  );
```

---

### **7. LOCATIONS** *(Content - Places)*

Geographic locations within mythologies (realms, cities, landmarks).

```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID NOT NULL REFERENCES mythologies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Classification
  location_type TEXT CHECK (location_type IN ('realm', 'city', 'temple', 'mountain', 'forest', 'ocean', 'underworld', 'sky', 'battlefield', 'sacred_site', 'other')),
  
  -- Geography
  climate TEXT,
  terrain TEXT,
  notable_features TEXT[],
  
  -- Inhabitants
  resident_character_ids UUID[],
  resident_creature_ids UUID[],
  
  -- Media
  image_url TEXT,
  
  -- Map coordinates (if placed on map)
  map_x FLOAT,
  map_y FLOAT,
  
  -- Moderation
  moderation_status TEXT DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'flagged', 'rejected'))
);

-- Indexes
CREATE INDEX idx_locations_mythology ON locations(mythology_id);
CREATE INDEX idx_locations_type ON locations(location_type);

-- RLS Policies (same pattern)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
```

---

### **8. MAPS** *(Content - Visual Geography)*

Custom maps created with Konva.js canvas.

```sql
CREATE TABLE maps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID NOT NULL REFERENCES mythologies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Canvas data
  canvas_data JSONB, -- Konva.js JSON export
  canvas_width INTEGER DEFAULT 1920,
  canvas_height INTEGER DEFAULT 1080,
  
  -- Background
  background_image_url TEXT,
  background_color TEXT DEFAULT '#1a1a2e',
  
  -- Layers (for organization)
  layers JSONB, -- Array of layer objects
  
  -- Saved as image
  exported_image_url TEXT
);

-- Indexes
CREATE INDEX idx_maps_mythology ON maps(mythology_id);

-- RLS Policies
ALTER TABLE maps ENABLE ROW LEVEL SECURITY;
```

---

### **9. RELATIONSHIPS** *(Content - Character Connections)*

Graph data for relationship mapping (Cytoscape.js).

```sql
CREATE TABLE relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID NOT NULL REFERENCES mythologies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Entities (can be characters or creatures)
  from_entity_type TEXT NOT NULL CHECK (from_entity_type IN ('character', 'creature')),
  from_entity_id UUID NOT NULL,
  to_entity_type TEXT NOT NULL CHECK (to_entity_type IN ('character', 'creature')),
  to_entity_id UUID NOT NULL,
  
  -- Relationship type
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('parent', 'child', 'sibling', 'spouse', 'enemy', 'ally', 'creator', 'rival', 'mentor', 'servant', 'worshipper', 'other')),
  
  -- Description
  description TEXT,
  
  -- Bidirectional flag
  is_bidirectional BOOLEAN DEFAULT false,
  
  UNIQUE(from_entity_type, from_entity_id, to_entity_type, to_entity_id, relationship_type)
);

-- Indexes
CREATE INDEX idx_relationships_mythology ON relationships(mythology_id);
CREATE INDEX idx_relationships_from ON relationships(from_entity_type, from_entity_id);
CREATE INDEX idx_relationships_to ON relationships(to_entity_type, to_entity_id);

-- RLS Policies
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
```

---

### **10. BATTLES** *(Content - Combat Events)*

AI-generated battle scenarios between characters/creatures.

```sql
CREATE TABLE battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Participants (can be from different mythologies)
  participant_1_type TEXT NOT NULL CHECK (participant_1_type IN ('character', 'creature')),
  participant_1_id UUID NOT NULL,
  participant_1_mythology_id UUID NOT NULL REFERENCES mythologies(id),
  
  participant_2_type TEXT NOT NULL CHECK (participant_2_type IN ('character', 'creature')),
  participant_2_id UUID NOT NULL,
  participant_2_mythology_id UUID NOT NULL REFERENCES mythologies(id),
  
  -- Battle settings
  location_description TEXT,
  battle_type TEXT CHECK (battle_type IN ('duel', 'war', 'contest', 'ritual_combat')),
  
  -- AI-generated result
  battle_narrative TEXT, -- GPT-4 generated story
  winner_type TEXT CHECK (winner_type IN ('participant_1', 'participant_2', 'draw', 'both_perish')),
  
  -- Stats (for display)
  turn_count INTEGER,
  battle_duration TEXT -- e.g., "3 rounds"
);

-- Indexes
CREATE INDEX idx_battles_participant1 ON battles(participant_1_mythology_id);
CREATE INDEX idx_battles_participant2 ON battles(participant_2_mythology_id);

-- RLS Policies
ALTER TABLE battles ENABLE ROW LEVEL SECURITY;
```

---

### **11. DEITIES** *(Content - Curated Reference)*

Teacher-curated or system-seeded reference data for real mythological deities.

```sql
CREATE TABLE deities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  mythology_tradition TEXT NOT NULL, -- 'greek', 'norse', 'egyptian', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Classification
  domain TEXT[],
  archetype TEXT,
  
  -- Description
  description TEXT,
  symbols TEXT[],
  powers TEXT[],
  famous_stories TEXT[],
  
  -- Media
  image_url TEXT,
  wikipedia_url TEXT,
  
  -- For student research
  family_relations JSONB, -- { "parents": ["Cronus", "Rhea"], "children": ["Athena", "Apollo"] }
  equivalent_deities JSONB -- { "roman": "Jupiter", "egyptian": "Amun" }
);

-- Indexes
CREATE INDEX idx_deities_tradition ON deities(mythology_tradition);
CREATE INDEX idx_deities_name ON deities(name);

-- RLS Policies (publicly readable for research)
ALTER TABLE deities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Deities publicly readable"
  ON deities FOR SELECT
  TO authenticated
  USING (true);
```

---

### **12. RESEARCH_LIBRARY** *(Content - Curated Resources)*

Teacher-curated educational resources for mythology research.

```sql
CREATE TABLE research_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Resource type
  resource_type TEXT CHECK (resource_type IN ('article', 'video', 'website', 'book', 'primary_source', 'interactive')),
  
  -- Content
  url TEXT,
  content TEXT, -- For articles stored in-platform
  
  -- Categorization
  mythology_tradition TEXT[], -- ['greek', 'roman']
  topics TEXT[], -- ['heroes', 'creation_myths', 'underworld']
  grade_level_min INTEGER,
  grade_level_max INTEGER,
  
  -- Visibility
  is_public BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX idx_research_tradition ON research_library USING GIN (mythology_tradition);
CREATE INDEX idx_research_topics ON research_library USING GIN (topics);

-- RLS Policies
ALTER TABLE research_library ENABLE ROW LEVEL SECURITY;
```

---

### **13. DEITY_COMPARISONS** *(Content - Cross-Mythology)*

Student-created comparisons between deities from different traditions.

```sql
CREATE TABLE deity_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Deities being compared
  deity_ids UUID[] NOT NULL, -- References to deities table
  
  -- Comparison data
  title TEXT NOT NULL,
  comparison_text TEXT,
  similarities JSONB, -- Structured comparison data
  differences JSONB,
  
  -- Teacher feedback
  teacher_feedback TEXT,
  teacher_grade TEXT
);

-- Indexes
CREATE INDEX idx_deity_comparisons_creator ON deity_comparisons(created_by);

-- RLS Policies
ALTER TABLE deity_comparisons ENABLE ROW LEVEL SECURITY;
```

---

### **14-19. GAMIFICATION TABLES**

*See Phase 3 in IMPLEMENTATION_ROADMAP.md for complete schemas:*
- `points_log` - Point transaction history
- `badges` - Badge definitions (50+ types)
- `user_badges` - User badge unlocks
- `daily_challenges` - Daily challenge tracking
- `avatar_items` - Unlockable avatar customizations
- `user_avatar_config` - User avatar settings

---

### **20-26. COLLABORATION TABLES**

*See Phase 4 in IMPLEMENTATION_ROADMAP.md for complete schemas:*
- `version_history` - Content version snapshots
- `chat_rooms` - Group chat rooms
- `chat_room_participants` - Chat membership
- `chat_messages` - Real-time messages
- `notifications` - User notifications
- `user_presence` - Online status tracking
- `mythology_collaborators` - Collaboration permissions

---

### **27-29. AI & PRESENTATION TABLES**

*See Phases 5-6 in IMPLEMENTATION_ROADMAP.md for complete schemas:*
- `image_generations` - AI image generation history
- `style_presets` - Image style presets
- `presentations` - Student presentations
- `presentation_slides` - Individual slides
- `presentation_shares` - Shareable links
- `presentation_views` - View tracking

---

## 🔗 ENTITY RELATIONSHIP DIAGRAM

```
profiles (users)
  ├─ 1:N → mythologies (student projects)
  │   ├─ 1:N → characters
  │   ├─ 1:N → creatures
  │   ├─ 1:N → stories
  │   ├─ 1:N → locations
  │   ├─ 1:N → maps
  │   └─ N:N → relationships (graph edges)
  │
  ├─ 1:N → classrooms (if teacher)
  ├─ 1:N → points_log
  ├─ N:N → badges (via user_badges)
  ├─ 1:N → presentations
  └─ 1:N → notifications

characters/creatures
  ├─ N:N → relationships
  ├─ N:N → stories (featured in)
  └─ N:N → battles (participants)

deities (reference data)
  └─ N:N → deity_comparisons

presentations
  └─ 1:N → presentation_slides
```

---

## 🔒 ROW LEVEL SECURITY (RLS) PATTERNS

All tables use RLS policies following these patterns:

1. **Own Content:** Users can CRUD their own records
2. **Teacher Access:** Teachers can view/grade student content in their classroom
3. **Classroom Visibility:** Students can view classmates' content when `visibility = 'classroom'`
4. **Public Visibility:** Anyone can view content when `visibility = 'public'` AND `moderation_status = 'approved'`
5. **Reference Data:** Publicly readable (deities, research_library)

---

## 📈 PERFORMANCE INDEXES

**Critical indexes for scalability:**

```sql
-- Leaderboards (sorted by points DESC)
CREATE INDEX idx_profiles_leaderboard ON profiles(points DESC, streak_count DESC);

-- Gallery pagination (recent creations)
CREATE INDEX idx_characters_recent ON characters(created_at DESC);
CREATE INDEX idx_creatures_recent ON creatures(created_at DESC);
CREATE INDEX idx_stories_recent ON stories(created_at DESC);

-- Teacher grading queue
CREATE INDEX idx_mythologies_pending_review ON mythologies(moderation_status, created_at) WHERE moderation_status = 'pending';

-- Real-time chat
CREATE INDEX idx_chat_messages_room ON chat_messages(room_id, created_at DESC);

-- Notification inbox
CREATE INDEX idx_notifications_user ON notifications(user_id, read, created_at DESC);
```

---

## 🔄 AUTOMATED FUNCTIONS & TRIGGERS

**Example: Auto-update updated_at timestamp**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_mythologies_updated_at
  BEFORE UPDATE ON mythologies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- (Repeat for characters, creatures, stories, etc.)
```

---

## 📊 STORAGE BUCKETS (Supabase Storage)

In addition to database tables, these storage buckets are required:

1. **`avatars`** - User profile pictures
2. **`images`** - Character/creature/location images
3. **`maps`** - Exported map images
4. **`audio`** - Student audio narrations
5. **`exports`** - Generated PowerPoint/PDF files

**Storage RLS policies:**
- Users can upload to their own folders
- Teachers can view student content
- Public bucket for approved content

---

## 🚀 MIGRATION STRATEGY

All migrations are in `supabase/migrations/` directory:

- `20240101_create_core_tables.sql` - Phase 1 tables
- `20240102_create_content_tables.sql` - Phase 2 tables
- `20240103_create_gamification_tables.sql` - Phase 3 tables
- `20240104_create_collaboration_tables.sql` - Phase 4 tables
- `20240105_create_ai_tables.sql` - Phase 5 tables
- `20240106_create_presentation_tables.sql` - Phase 6 tables
- `20240107_seed_reference_data.sql` - Seed badges, deities, style presets

Run migrations:
```bash
supabase db push
```

---

**Next:** See [IMPLEMENTATION_ROADMAP.md](../IMPLEMENTATION_ROADMAP.md) for phase-by-phase implementation of these tables.

---

*Schema Complete - 29 tables documented* ✅
