-- Add stories table for narrative content

CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Ownership
  mythology_id UUID NOT NULL REFERENCES public.mythologies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Content
  title TEXT NOT NULL,
  content JSONB NOT NULL, -- TipTap JSON document
  content_text TEXT, -- Plain text version for search
  excerpt TEXT, -- First 200 chars for previews
  
  -- Story metadata
  story_type TEXT CHECK (story_type IN ('origin', 'legend', 'battle', 'quest', 'relationship', 'prophecy', 'other')),
  featured_characters UUID[], -- Array of character IDs
  featured_creatures UUID[], -- Array of creature IDs
  
  -- Status
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'teacher_only', 'hidden')),
  locked_by_teacher BOOLEAN DEFAULT FALSE,
  is_complete BOOLEAN DEFAULT FALSE,
  
  -- Collaboration
  is_group_story BOOLEAN DEFAULT FALSE,
  collaborators UUID[], -- Array of user IDs
  
  -- Stats
  word_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_stories_mythology ON public.stories(mythology_id);
CREATE INDEX idx_stories_created_by ON public.stories(created_by);
CREATE INDEX idx_stories_visibility ON public.stories(visibility);
CREATE INDEX idx_stories_type ON public.stories(story_type);

-- Full text search on content
CREATE INDEX idx_stories_content_text ON public.stories USING gin(to_tsvector('english', content_text));

-- RLS Policies
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Stories are visible based on visibility setting
CREATE POLICY "Stories are visible based on visibility setting"
  ON public.stories FOR SELECT
  USING (
    visibility = 'public'
    OR (visibility = 'teacher_only' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    ))
    OR created_by = auth.uid()
    OR auth.uid() = ANY(collaborators)
  );

-- Students can create stories
CREATE POLICY "Students can create stories"
  ON public.stories FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Students can update own stories
CREATE POLICY "Students can update own stories"
  ON public.stories FOR UPDATE
  USING (
    created_by = auth.uid()
    OR auth.uid() = ANY(collaborators)
  );

-- Teachers can update classroom stories
CREATE POLICY "Teachers can update classroom stories"
  ON public.stories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'teacher'
      AND stories.mythology_id IN (
        SELECT id FROM public.mythologies
        WHERE classroom_id IN (
          SELECT id FROM public.classrooms WHERE teacher_id = auth.uid()
        )
      )
    )
  );

-- Updated at trigger
CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to extract plain text from TipTap JSON
CREATE OR REPLACE FUNCTION extract_text_from_tiptap(content JSONB)
RETURNS TEXT AS $$
DECLARE
  result TEXT := '';
BEGIN
  -- Simple extraction - in production you'd parse the JSON structure
  result := content::TEXT;
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON TABLE public.stories IS 'Story/narrative content within mythologies';
COMMENT ON COLUMN public.stories.content IS 'TipTap editor JSON document';
COMMENT ON COLUMN public.stories.story_type IS 'Categorizes the type of narrative';
