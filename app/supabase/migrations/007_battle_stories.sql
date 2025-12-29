-- Battle Stories Table
-- A simple table for students to save their favorite battle narrations
-- This works independently of the full battle system

CREATE TABLE IF NOT EXISTS public.battle_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Battle Details
  title TEXT NOT NULL,
  combatant_1_name TEXT NOT NULL,
  combatant_1_type TEXT NOT NULL, -- 'character' or 'creature'
  combatant_2_name TEXT NOT NULL,
  combatant_2_type TEXT NOT NULL,
  winner_name TEXT,
  
  -- Battle Settings
  battle_type TEXT DEFAULT 'duel',
  narration_style TEXT DEFAULT 'epic',
  arena_description TEXT,
  
  -- The Story
  narration TEXT NOT NULL,
  combat_summary JSONB, -- Optional summary of combat stats/rounds
  
  -- Metadata
  is_favorite BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX idx_battle_stories_mythology ON public.battle_stories(mythology_id);
CREATE INDEX idx_battle_stories_created_by ON public.battle_stories(created_by);

-- RLS Policies
ALTER TABLE public.battle_stories ENABLE ROW LEVEL SECURITY;

-- Anyone can view battle stories from public mythologies
CREATE POLICY "Battle stories are viewable by everyone"
  ON public.battle_stories FOR SELECT
  USING (true);

-- Users can create battle stories for their own mythologies
CREATE POLICY "Users can create battle stories"
  ON public.battle_stories FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own battle stories
CREATE POLICY "Users can update own battle stories"
  ON public.battle_stories FOR UPDATE
  USING (auth.uid() = created_by);

-- Users can delete their own battle stories
CREATE POLICY "Users can delete own battle stories"
  ON public.battle_stories FOR DELETE
  USING (auth.uid() = created_by);
