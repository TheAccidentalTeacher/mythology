-- Add moderation_flags table for content safety tracking

CREATE TABLE IF NOT EXISTS public.moderation_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content reference
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('mythology', 'character', 'creature', 'story')),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Moderation results
  flagged_categories TEXT[] DEFAULT '{}',
  scores JSONB DEFAULT '{}',
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  action TEXT CHECK (action IN ('allow', 'review', 'block')),
  
  -- Review status
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  review_action TEXT CHECK (review_action IN ('approved', 'rejected', 'edited')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_moderation_flags_content ON public.moderation_flags(content_id, content_type);
CREATE INDEX idx_moderation_flags_user ON public.moderation_flags(user_id);
CREATE INDEX idx_moderation_flags_reviewed ON public.moderation_flags(reviewed);
CREATE INDEX idx_moderation_flags_severity ON public.moderation_flags(severity);

-- RLS Policies
ALTER TABLE public.moderation_flags ENABLE ROW LEVEL SECURITY;

-- Teachers can view all flags in their classroom
CREATE POLICY "Teachers can view classroom moderation flags"
  ON public.moderation_flags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles teacher
      JOIN public.profiles student ON student.classroom_id = teacher.classroom_id
      WHERE teacher.id = auth.uid()
      AND teacher.role = 'teacher'
      AND student.id = moderation_flags.user_id
    )
  );

-- Teachers can update review status
CREATE POLICY "Teachers can review flags"
  ON public.moderation_flags FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles teacher
      JOIN public.profiles student ON student.classroom_id = teacher.classroom_id
      WHERE teacher.id = auth.uid()
      AND teacher.role = 'teacher'
      AND student.id = moderation_flags.user_id
    )
  );

-- System can insert flags (via service role)
-- No INSERT policy - only backend can create flags

-- Add updated_at trigger
CREATE TRIGGER update_moderation_flags_updated_at
  BEFORE UPDATE ON public.moderation_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add locked_by_teacher column to content tables if not exists
ALTER TABLE public.mythologies 
  ADD COLUMN IF NOT EXISTS locked_by_teacher BOOLEAN DEFAULT FALSE;

ALTER TABLE public.characters 
  ADD COLUMN IF NOT EXISTS locked_by_teacher BOOLEAN DEFAULT FALSE;

ALTER TABLE public.creatures 
  ADD COLUMN IF NOT EXISTS locked_by_teacher BOOLEAN DEFAULT FALSE;

COMMENT ON TABLE public.moderation_flags IS 'Tracks content flagged by OpenAI moderation for teacher review';
COMMENT ON COLUMN public.moderation_flags.severity IS 'low: minor concern, medium: needs review, high: serious issue, critical: immediate block';
COMMENT ON COLUMN public.moderation_flags.action IS 'allow: passed but logged, review: needs teacher review, block: auto-hidden';
