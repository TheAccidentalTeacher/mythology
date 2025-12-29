-- ================================================================
-- Phase 2D: AI Battles - Combat System
-- ================================================================
-- Adds combat stats to characters/creatures and battle tracking
-- ================================================================

-- ----------------------------------------------------------------
-- Add Combat Stats to Characters
-- ----------------------------------------------------------------
ALTER TABLE public.characters
ADD COLUMN IF NOT EXISTS combat_hp INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS combat_attack INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS combat_defense INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS combat_speed INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS combat_special_ability TEXT,
ADD COLUMN IF NOT EXISTS combat_special_damage INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS battle_wins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS battle_losses INTEGER DEFAULT 0;

-- Set default combat stats based on character_type
-- Gods are most powerful, mortals weakest
COMMENT ON COLUMN public.characters.combat_hp IS 'Base: 100. Gods: 200, Demigods: 150, Heroes: 120, Mortals: 80';
COMMENT ON COLUMN public.characters.combat_attack IS 'Base: 10. Gods: 25, Demigods: 18, Heroes: 15, Mortals: 8';
COMMENT ON COLUMN public.characters.combat_defense IS 'Base: 10. Gods: 20, Demigods: 15, Heroes: 12, Mortals: 8';
COMMENT ON COLUMN public.characters.combat_speed IS 'Base: 10. Determines turn order. Higher = goes first';

-- ----------------------------------------------------------------
-- Add Combat Stats to Creatures
-- ----------------------------------------------------------------
ALTER TABLE public.creatures
ADD COLUMN IF NOT EXISTS combat_hp INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS combat_attack INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS combat_defense INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS combat_speed INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS combat_special_ability TEXT,
ADD COLUMN IF NOT EXISTS combat_special_damage INTEGER DEFAULT 20,
ADD COLUMN IF NOT EXISTS battle_wins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS battle_losses INTEGER DEFAULT 0;

COMMENT ON COLUMN public.creatures.combat_hp IS 'Based on danger_level: harmless=50, minor=80, dangerous=120, deadly=160, catastrophic=250';

-- ----------------------------------------------------------------
-- BATTLES TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  
  -- Combatants (can be character or creature)
  combatant_1_type TEXT NOT NULL CHECK (combatant_1_type IN ('character', 'creature')),
  combatant_1_id UUID NOT NULL,
  combatant_2_type TEXT NOT NULL CHECK (combatant_2_type IN ('character', 'creature')),
  combatant_2_id UUID NOT NULL,
  
  -- Battle Settings
  battle_type TEXT DEFAULT 'duel' CHECK (battle_type IN ('duel', 'honor_combat', 'ambush', 'divine_contest', 'tournament')),
  arena_description TEXT,
  
  -- Results
  winner_type TEXT CHECK (winner_type IN ('character', 'creature', 'draw')),
  winner_id UUID,
  
  -- Combat Log
  total_rounds INTEGER DEFAULT 0,
  combat_log JSONB DEFAULT '[]'::jsonb, -- Array of round-by-round actions
  
  -- AI Narration
  battle_narration TEXT, -- Full GPT-4 generated story
  narration_style TEXT DEFAULT 'epic' CHECK (narration_style IN ('epic', 'comedic', 'tragic', 'dramatic', 'poetic')),
  
  -- Stats Snapshot (at time of battle)
  combatant_1_stats JSONB,
  combatant_2_stats JSONB,
  
  -- Metadata
  created_by UUID REFERENCES public.profiles(id),
  is_crossover BOOLEAN DEFAULT FALSE, -- True if combatants from different mythologies
  crossover_mythology_id UUID REFERENCES public.mythologies(id),
  
  -- Visibility
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'teacher_only', 'hidden')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster battle lookups
CREATE INDEX IF NOT EXISTS idx_battles_mythology ON public.battles(mythology_id);
CREATE INDEX IF NOT EXISTS idx_battles_combatant_1 ON public.battles(combatant_1_type, combatant_1_id);
CREATE INDEX IF NOT EXISTS idx_battles_combatant_2 ON public.battles(combatant_2_type, combatant_2_id);
CREATE INDEX IF NOT EXISTS idx_battles_winner ON public.battles(winner_type, winner_id);

-- ----------------------------------------------------------------
-- Row Level Security for Battles
-- ----------------------------------------------------------------
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;

-- Anyone can view public battles
CREATE POLICY "Public battles are viewable by everyone"
  ON public.battles FOR SELECT
  USING (visibility = 'public');

-- Users can view battles in their classroom
CREATE POLICY "Users can view classroom battles"
  ON public.battles FOR SELECT
  USING (
    mythology_id IN (
      SELECT m.id FROM public.mythologies m
      JOIN public.profiles p ON m.classroom_id = p.classroom_id
      WHERE p.id = auth.uid()
    )
  );

-- Teachers can view all battles in their classroom (including teacher_only)
CREATE POLICY "Teachers can view all classroom battles"
  ON public.battles FOR SELECT
  USING (
    mythology_id IN (
      SELECT m.id FROM public.mythologies m
      JOIN public.classrooms c ON m.classroom_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

-- Users can create battles for their own mythologies
CREATE POLICY "Users can create battles"
  ON public.battles FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    mythology_id IN (
      SELECT id FROM public.mythologies WHERE created_by = auth.uid()
    )
  );

-- Users can update their own battles
CREATE POLICY "Users can update own battles"
  ON public.battles FOR UPDATE
  USING (created_by = auth.uid());

-- Users can delete their own battles
CREATE POLICY "Users can delete own battles"
  ON public.battles FOR DELETE
  USING (created_by = auth.uid());

-- ----------------------------------------------------------------
-- BATTLE_SPECTATORS TABLE (for watching battles in real-time)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.battle_spectators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  battle_id UUID REFERENCES public.battles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(battle_id, user_id)
);

ALTER TABLE public.battle_spectators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can spectate public battles"
  ON public.battle_spectators FOR ALL
  USING (
    battle_id IN (SELECT id FROM public.battles WHERE visibility = 'public')
  );

-- ----------------------------------------------------------------
-- Function to calculate combat stats based on type
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_character_combat_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Set combat stats based on character_type if not already set
  IF NEW.combat_hp IS NULL OR NEW.combat_hp = 100 THEN
    CASE NEW.character_type
      WHEN 'god' THEN
        NEW.combat_hp := 200;
        NEW.combat_attack := 25;
        NEW.combat_defense := 20;
        NEW.combat_speed := 15;
      WHEN 'demigod' THEN
        NEW.combat_hp := 150;
        NEW.combat_attack := 18;
        NEW.combat_defense := 15;
        NEW.combat_speed := 14;
      WHEN 'hero' THEN
        NEW.combat_hp := 120;
        NEW.combat_attack := 15;
        NEW.combat_defense := 12;
        NEW.combat_speed := 12;
      WHEN 'spirit' THEN
        NEW.combat_hp := 100;
        NEW.combat_attack := 12;
        NEW.combat_defense := 8;
        NEW.combat_speed := 18;
      WHEN 'mortal' THEN
        NEW.combat_hp := 80;
        NEW.combat_attack := 8;
        NEW.combat_defense := 8;
        NEW.combat_speed := 10;
      ELSE
        NEW.combat_hp := 100;
        NEW.combat_attack := 10;
        NEW.combat_defense := 10;
        NEW.combat_speed := 10;
    END CASE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_creature_combat_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Set combat stats based on danger_level if not already set
  IF NEW.combat_hp IS NULL OR NEW.combat_hp = 100 THEN
    CASE NEW.danger_level
      WHEN 'harmless' THEN
        NEW.combat_hp := 50;
        NEW.combat_attack := 5;
        NEW.combat_defense := 5;
        NEW.combat_speed := 8;
      WHEN 'minor_threat' THEN
        NEW.combat_hp := 80;
        NEW.combat_attack := 10;
        NEW.combat_defense := 8;
        NEW.combat_speed := 10;
      WHEN 'dangerous' THEN
        NEW.combat_hp := 120;
        NEW.combat_attack := 15;
        NEW.combat_defense := 12;
        NEW.combat_speed := 12;
      WHEN 'deadly' THEN
        NEW.combat_hp := 160;
        NEW.combat_attack := 20;
        NEW.combat_defense := 16;
        NEW.combat_speed := 14;
      WHEN 'catastrophic' THEN
        NEW.combat_hp := 250;
        NEW.combat_attack := 30;
        NEW.combat_defense := 25;
        NEW.combat_speed := 12;
      ELSE
        NEW.combat_hp := 100;
        NEW.combat_attack := 10;
        NEW.combat_defense := 10;
        NEW.combat_speed := 10;
    END CASE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-calculating stats
DROP TRIGGER IF EXISTS set_character_combat_stats ON public.characters;
CREATE TRIGGER set_character_combat_stats
  BEFORE INSERT ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION calculate_character_combat_stats();

DROP TRIGGER IF EXISTS set_creature_combat_stats ON public.creatures;
CREATE TRIGGER set_creature_combat_stats
  BEFORE INSERT ON public.creatures
  FOR EACH ROW
  EXECUTE FUNCTION calculate_creature_combat_stats();

-- ----------------------------------------------------------------
-- Update existing characters/creatures with combat stats
-- ----------------------------------------------------------------
UPDATE public.characters SET
  combat_hp = CASE character_type
    WHEN 'god' THEN 200
    WHEN 'demigod' THEN 150
    WHEN 'hero' THEN 120
    WHEN 'spirit' THEN 100
    WHEN 'mortal' THEN 80
    ELSE 100
  END,
  combat_attack = CASE character_type
    WHEN 'god' THEN 25
    WHEN 'demigod' THEN 18
    WHEN 'hero' THEN 15
    WHEN 'spirit' THEN 12
    WHEN 'mortal' THEN 8
    ELSE 10
  END,
  combat_defense = CASE character_type
    WHEN 'god' THEN 20
    WHEN 'demigod' THEN 15
    WHEN 'hero' THEN 12
    WHEN 'spirit' THEN 8
    WHEN 'mortal' THEN 8
    ELSE 10
  END,
  combat_speed = CASE character_type
    WHEN 'god' THEN 15
    WHEN 'demigod' THEN 14
    WHEN 'hero' THEN 12
    WHEN 'spirit' THEN 18
    WHEN 'mortal' THEN 10
    ELSE 10
  END
WHERE combat_hp = 100 OR combat_hp IS NULL;

UPDATE public.creatures SET
  combat_hp = CASE danger_level
    WHEN 'harmless' THEN 50
    WHEN 'minor_threat' THEN 80
    WHEN 'dangerous' THEN 120
    WHEN 'deadly' THEN 160
    WHEN 'catastrophic' THEN 250
    ELSE 100
  END,
  combat_attack = CASE danger_level
    WHEN 'harmless' THEN 5
    WHEN 'minor_threat' THEN 10
    WHEN 'dangerous' THEN 15
    WHEN 'deadly' THEN 20
    WHEN 'catastrophic' THEN 30
    ELSE 10
  END,
  combat_defense = CASE danger_level
    WHEN 'harmless' THEN 5
    WHEN 'minor_threat' THEN 8
    WHEN 'dangerous' THEN 12
    WHEN 'deadly' THEN 16
    WHEN 'catastrophic' THEN 25
    ELSE 10
  END,
  combat_speed = CASE danger_level
    WHEN 'harmless' THEN 8
    WHEN 'minor_threat' THEN 10
    WHEN 'dangerous' THEN 12
    WHEN 'deadly' THEN 14
    WHEN 'catastrophic' THEN 12
    ELSE 10
  END
WHERE combat_hp = 100 OR combat_hp IS NULL;
