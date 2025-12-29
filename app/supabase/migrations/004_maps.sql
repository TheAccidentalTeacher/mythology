-- Add maps table for world/geography visualization

CREATE TABLE IF NOT EXISTS public.maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  mythology_id UUID NOT NULL REFERENCES public.mythologies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Map metadata
  title TEXT NOT NULL,
  description TEXT,
  map_type TEXT CHECK (map_type IN ('world', 'region', 'city', 'realm', 'other')),
  
  -- Canvas data
  canvas_data JSONB NOT NULL, -- Konva stage JSON
  background_image TEXT, -- URL to background image (optional)
  background_color TEXT DEFAULT '#1a1a2e',
  width INTEGER DEFAULT 1200,
  height INTEGER DEFAULT 800,
  
  -- Locations on map
  locations JSONB DEFAULT '[]'::jsonb, -- Array of {id, name, x, y, icon, linked_character_id, linked_creature_id}
  
  -- Status
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'teacher_only', 'hidden')),
  locked_by_teacher BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_maps_mythology ON public.maps(mythology_id);
CREATE INDEX idx_maps_created_by ON public.maps(created_by);
CREATE INDEX idx_maps_visibility ON public.maps(visibility);
CREATE INDEX idx_maps_type ON public.maps(map_type);

-- RLS Policies
ALTER TABLE public.maps ENABLE ROW LEVEL SECURITY;

-- Maps are visible based on visibility setting
CREATE POLICY "Maps are visible based on visibility setting"
  ON public.maps FOR SELECT
  USING (
    visibility = 'public'
    OR (visibility = 'teacher_only' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    ))
    OR created_by = auth.uid()
  );

-- Students can create maps
CREATE POLICY "Students can create maps"
  ON public.maps FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Students can update own maps
CREATE POLICY "Students can update own maps"
  ON public.maps FOR UPDATE
  USING (created_by = auth.uid());

-- Teachers can update classroom maps
CREATE POLICY "Teachers can update classroom maps"
  ON public.maps FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
      AND maps.mythology_id IN (
        SELECT id FROM public.mythologies
        WHERE classroom_id IN (
          SELECT id FROM public.classrooms WHERE teacher_id = auth.uid()
        )
      )
    )
  );

-- Updated at trigger
CREATE TRIGGER update_maps_updated_at
  BEFORE UPDATE ON public.maps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE public.maps IS 'Visual world maps/geography for mythologies';
COMMENT ON COLUMN public.maps.canvas_data IS 'Konva stage serialization (shapes, lines, text)';
COMMENT ON COLUMN public.maps.locations IS 'Named locations with coordinates and entity links';
