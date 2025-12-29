-- Create Realms/Locations Table
CREATE TABLE IF NOT EXISTS public.realms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID REFERENCES public.mythologies(id) ON DELETE CASCADE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Basic Info
  name TEXT NOT NULL,
  realm_type TEXT CHECK (realm_type IN ('underwater', 'surface', 'coastal', 'island', 'sky', 'underground', 'dimensional', 'spiritual', 'other')),
  
  -- Lore
  description TEXT,
  access_requirements TEXT,
  inhabitants TEXT,
  geography TEXT,
  cultural_significance TEXT,
  connected_to TEXT, -- Other realms/locations this connects to
  
  -- Relationships
  related_characters UUID[], -- Array of character IDs who dwell here
  related_creatures UUID[], -- Array of creature IDs found here
  
  -- Visuals
  primary_image_url TEXT,
  map_data JSONB, -- For storing custom map coordinates and visual data
  
  -- Visibility
  visibility TEXT DEFAULT 'public',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.realms ENABLE ROW LEVEL SECURITY;

-- Policies for Realms
CREATE POLICY "Public realms are viewable by everyone"
  ON public.realms FOR SELECT
  USING (visibility = 'public');

CREATE POLICY "Users can view their own realms"
  ON public.realms FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can view their classroom's realms"
  ON public.realms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p1
      WHERE p1.id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.profiles p2
        WHERE p2.id = realms.created_by
        AND p2.classroom_id = p1.classroom_id
      )
    )
  );

CREATE POLICY "Users can create realms for their mythologies"
  ON public.realms FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.mythologies m
      WHERE m.id = mythology_id
      AND m.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update their own realms"
  ON public.realms FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own realms"
  ON public.realms FOR DELETE
  USING (auth.uid() = created_by);

-- Create indexes for performance
CREATE INDEX idx_realms_mythology_id ON public.realms(mythology_id);
CREATE INDEX idx_realms_created_by ON public.realms(created_by);
CREATE INDEX idx_realms_realm_type ON public.realms(realm_type);
CREATE INDEX idx_realms_visibility ON public.realms(visibility);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_realms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_realms_updated_at
  BEFORE UPDATE ON public.realms
  FOR EACH ROW
  EXECUTE FUNCTION update_realms_updated_at();
