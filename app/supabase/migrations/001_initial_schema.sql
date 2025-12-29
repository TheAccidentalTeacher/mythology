-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- PROFILES TABLE (extends Supabase Auth users)
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
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  primary_image_url TEXT,
  appearance_description TEXT,
  
  -- Visibility
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'teacher_only', 'hidden')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
  primary_image_url TEXT,
  
  -- Visibility
  visibility TEXT DEFAULT 'public',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_classroom ON public.profiles(classroom_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_mythologies_created_by ON public.mythologies(created_by);
CREATE INDEX idx_mythologies_classroom ON public.mythologies(classroom_id);
CREATE INDEX idx_mythologies_visibility ON public.mythologies(visibility);
CREATE INDEX idx_characters_mythology ON public.characters(mythology_id);
CREATE INDEX idx_creatures_mythology ON public.creatures(mythology_id);

-- ROW LEVEL SECURITY POLICIES

-- Profiles: Users can read all, update own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile on signup"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Classrooms: Teachers can manage their classrooms
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Classrooms are viewable by members"
  ON public.classrooms FOR SELECT
  USING (
    teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.classroom_id = classrooms.id
    )
  );

CREATE POLICY "Teachers can create classrooms"
  ON public.classrooms FOR INSERT
  WITH CHECK (
    teacher_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher')
  );

CREATE POLICY "Teachers can update own classrooms"
  ON public.classrooms FOR UPDATE
  USING (teacher_id = auth.uid());

-- Mythologies: Students can create, read based on visibility, update own
ALTER TABLE public.mythologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mythologies are visible based on visibility setting"
  ON public.mythologies FOR SELECT
  USING (
    visibility = 'public' 
    OR (visibility = 'teacher_only' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    ))
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

CREATE POLICY "Teachers can update classroom mythologies"
  ON public.mythologies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'teacher'
      AND mythologies.classroom_id IN (
        SELECT id FROM public.classrooms WHERE teacher_id = auth.uid()
      )
    )
  );

-- Characters: Similar RLS policies
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Characters are visible based on mythology visibility"
  ON public.characters FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.mythologies
      WHERE mythologies.id = characters.mythology_id
      AND (
        mythologies.visibility = 'public'
        OR (mythologies.visibility = 'teacher_only' AND EXISTS (
          SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
        ))
        OR mythologies.created_by = auth.uid()
        OR auth.uid() = ANY(mythologies.group_members)
      )
    )
  );

CREATE POLICY "Students can create characters in own mythologies"
  ON public.characters FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.mythologies
      WHERE mythologies.id = characters.mythology_id
      AND (mythologies.created_by = auth.uid() OR auth.uid() = ANY(mythologies.group_members))
    )
  );

CREATE POLICY "Students can update own characters"
  ON public.characters FOR UPDATE
  USING (created_by = auth.uid());

-- Creatures: Similar RLS policies
ALTER TABLE public.creatures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creatures are visible based on mythology visibility"
  ON public.creatures FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.mythologies
      WHERE mythologies.id = creatures.mythology_id
      AND (
        mythologies.visibility = 'public'
        OR (mythologies.visibility = 'teacher_only' AND EXISTS (
          SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
        ))
        OR mythologies.created_by = auth.uid()
        OR auth.uid() = ANY(mythologies.group_members)
      )
    )
  );

CREATE POLICY "Students can create creatures in own mythologies"
  ON public.creatures FOR INSERT
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.mythologies
      WHERE mythologies.id = creatures.mythology_id
      AND (mythologies.created_by = auth.uid() OR auth.uid() = ANY(mythologies.group_members))
    )
  );

CREATE POLICY "Students can update own creatures"
  ON public.creatures FOR UPDATE
  USING (created_by = auth.uid());

-- Function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classrooms_updated_at BEFORE UPDATE ON public.classrooms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mythologies_updated_at BEFORE UPDATE ON public.mythologies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON public.characters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creatures_updated_at BEFORE UPDATE ON public.creatures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
