-- =============================================================================
-- PHASE 2E: CROSSOVER EVENTS
-- Cross-mythology interactions, collaborative stories, and teacher events
-- =============================================================================

-- CROSSOVER REQUESTS TABLE
-- Students can request to interact with other mythologies
CREATE TABLE IF NOT EXISTS public.crossover_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Request Details
  requester_mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  target_mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Request Type
  request_type TEXT NOT NULL CHECK (request_type IN (
    'battle',           -- Cross-mythology battle
    'alliance',         -- Form an alliance
    'conflict',         -- Declare mythological conflict
    'story',            -- Collaborative crossover story
    'character_meeting', -- Characters from different mythologies meet
    'trade',            -- Cultural/resource exchange
    'event'             -- Joint event participation
  )),
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'cancelled', 'completed')),
  
  -- Message
  message TEXT, -- Request message from sender
  response_message TEXT, -- Response from recipient
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- MYTHOLOGY ALLIANCES TABLE
-- Track ongoing relationships between mythologies
CREATE TABLE IF NOT EXISTS public.mythology_alliances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Participating Mythologies (always stored with lower ID first for consistency)
  mythology_1_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  mythology_2_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  
  -- Relationship Type
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'alliance',         -- Friendly cooperation
    'trade_partners',   -- Cultural exchange
    'rivalry',          -- Competitive but respectful
    'conflict',         -- Active opposition
    'neutral'           -- No strong relationship
  )),
  
  -- Details
  alliance_name TEXT, -- Optional name for the alliance ("The Northern Pact")
  description TEXT,   -- Story of how this relationship formed
  
  -- Origin
  formed_from_request_id UUID REFERENCES public.crossover_requests(id),
  formed_by UUID REFERENCES public.profiles(id),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique mythology pairs
  UNIQUE(mythology_1_id, mythology_2_id)
);

-- CROSSOVER STORIES TABLE
-- Collaborative stories between mythologies
CREATE TABLE IF NOT EXISTS public.crossover_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Participating Mythologies
  mythology_1_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  mythology_2_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  
  -- Authors
  author_1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Story Content
  title TEXT NOT NULL,
  story_type TEXT DEFAULT 'crossover' CHECK (story_type IN (
    'crossover',        -- General crossover
    'first_contact',    -- First meeting of mythologies
    'battle_story',     -- Story of a cross-mythology battle
    'alliance_origin',  -- How alliance formed
    'conflict_tale',    -- Story of mythological conflict
    'cultural_exchange' -- Trading knowledge/artifacts
  )),
  
  -- Story Content (TipTap JSON)
  content JSONB,
  word_count INTEGER DEFAULT 0,
  
  -- Characters Featured
  featured_characters UUID[], -- Character IDs from both mythologies
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'published')),
  
  -- Collaboration tracking
  last_edited_by UUID REFERENCES public.profiles(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TEACHER EVENTS TABLE
-- Class-wide events initiated by teachers
CREATE TABLE IF NOT EXISTS public.teacher_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Event Ownership
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  
  -- Event Details
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'tournament',       -- Battle tournament
    'story_challenge',  -- Writing challenge
    'alliance_week',    -- Encourage alliances
    'mythology_olympics', -- Multiple competitions
    'crossover_festival', -- Celebration of crossovers
    'custom'            -- Teacher-defined
  )),
  
  -- Timing
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Rules/Requirements
  rules JSONB, -- Flexible rules structure
  max_participants INTEGER,
  
  -- Rewards
  points_reward INTEGER DEFAULT 0,
  badge_reward TEXT, -- Badge ID to award
  
  -- Status
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'active', 'completed', 'cancelled')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EVENT PARTICIPANTS TABLE
-- Track who participates in teacher events
CREATE TABLE IF NOT EXISTS public.event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  event_id UUID REFERENCES public.teacher_events(id) ON DELETE CASCADE,
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Participation Details
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Results (for tournaments/competitions)
  placement INTEGER, -- 1st, 2nd, 3rd, etc.
  score INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  
  -- Unique participation per event
  UNIQUE(event_id, mythology_id)
);

-- CROSSOVER BATTLES TABLE
-- Track battles between mythologies
CREATE TABLE IF NOT EXISTS public.crossover_battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Battle Participants
  mythology_1_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  mythology_2_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  
  -- Combatants (can be character or creature)
  combatant_1_type TEXT CHECK (combatant_1_type IN ('character', 'creature')),
  combatant_1_id UUID NOT NULL,
  combatant_2_type TEXT CHECK (combatant_2_type IN ('character', 'creature')),
  combatant_2_id UUID NOT NULL,
  
  -- Battle Details
  battle_type TEXT DEFAULT 'crossover_duel' CHECK (battle_type IN (
    'crossover_duel',
    'champion_battle',
    'tournament_match',
    'exhibition',
    'grudge_match'
  )),
  
  -- Results
  winner_combatant_id UUID,
  winning_mythology_id UUID REFERENCES public.mythologies(id),
  
  -- Combat Log & Narration
  combat_log JSONB,
  narration TEXT,
  narration_style TEXT,
  
  -- Event Connection (if part of tournament)
  event_id UUID REFERENCES public.teacher_events(id),
  
  -- Users
  initiated_by UUID REFERENCES public.profiles(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_crossover_requests_requester ON public.crossover_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_crossover_requests_target ON public.crossover_requests(target_user_id);
CREATE INDEX IF NOT EXISTS idx_crossover_requests_status ON public.crossover_requests(status);
CREATE INDEX IF NOT EXISTS idx_mythology_alliances_myth1 ON public.mythology_alliances(mythology_1_id);
CREATE INDEX IF NOT EXISTS idx_mythology_alliances_myth2 ON public.mythology_alliances(mythology_2_id);
CREATE INDEX IF NOT EXISTS idx_crossover_stories_myth1 ON public.crossover_stories(mythology_1_id);
CREATE INDEX IF NOT EXISTS idx_crossover_stories_myth2 ON public.crossover_stories(mythology_2_id);
CREATE INDEX IF NOT EXISTS idx_teacher_events_classroom ON public.teacher_events(classroom_id);
CREATE INDEX IF NOT EXISTS idx_teacher_events_status ON public.teacher_events(status);
CREATE INDEX IF NOT EXISTS idx_crossover_battles_myth1 ON public.crossover_battles(mythology_1_id);
CREATE INDEX IF NOT EXISTS idx_crossover_battles_myth2 ON public.crossover_battles(mythology_2_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE public.crossover_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mythology_alliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crossover_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crossover_battles ENABLE ROW LEVEL SECURITY;

-- Crossover Requests Policies
CREATE POLICY "Users can view their sent or received requests"
  ON public.crossover_requests FOR SELECT
  USING (requester_id = auth.uid() OR target_user_id = auth.uid());

CREATE POLICY "Users can create crossover requests"
  ON public.crossover_requests FOR INSERT
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Requesters can update their pending requests"
  ON public.crossover_requests FOR UPDATE
  USING (requester_id = auth.uid() OR target_user_id = auth.uid());

-- Mythology Alliances Policies
CREATE POLICY "Anyone can view alliances"
  ON public.mythology_alliances FOR SELECT
  USING (true);

CREATE POLICY "Mythology owners can create alliances"
  ON public.mythology_alliances FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mythologies 
      WHERE id = mythology_1_id AND created_by = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.mythologies 
      WHERE id = mythology_2_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Alliance participants can update"
  ON public.mythology_alliances FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.mythologies 
      WHERE (id = mythology_1_id OR id = mythology_2_id) AND created_by = auth.uid()
    )
  );

-- Crossover Stories Policies
CREATE POLICY "Anyone can view published crossover stories"
  ON public.crossover_stories FOR SELECT
  USING (status = 'published' OR author_1_id = auth.uid() OR author_2_id = auth.uid());

CREATE POLICY "Authors can create crossover stories"
  ON public.crossover_stories FOR INSERT
  WITH CHECK (author_1_id = auth.uid() OR author_2_id = auth.uid());

CREATE POLICY "Authors can update their stories"
  ON public.crossover_stories FOR UPDATE
  USING (author_1_id = auth.uid() OR author_2_id = auth.uid());

-- Teacher Events Policies
CREATE POLICY "Classroom members can view events"
  ON public.teacher_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (role = 'teacher' OR classroom_id = teacher_events.classroom_id)
    )
  );

CREATE POLICY "Teachers can create events"
  ON public.teacher_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Event creators can update"
  ON public.teacher_events FOR UPDATE
  USING (created_by = auth.uid());

-- Event Participants Policies
CREATE POLICY "Anyone can view participants"
  ON public.event_participants FOR SELECT
  USING (true);

CREATE POLICY "Users can join events"
  ON public.event_participants FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their participation"
  ON public.event_participants FOR UPDATE
  USING (user_id = auth.uid());

-- Crossover Battles Policies
CREATE POLICY "Anyone can view crossover battles"
  ON public.crossover_battles FOR SELECT
  USING (true);

CREATE POLICY "Users can create crossover battles"
  ON public.crossover_battles FOR INSERT
  WITH CHECK (initiated_by = auth.uid());
