-- =====================================================
-- MIGRATION: Teacher Review Features
-- Adds support for teacher grading and comments
-- =====================================================

-- Add grading fields to mythologies if they don't exist
DO $$ 
BEGIN
  -- teacher_grade
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mythologies' AND column_name = 'teacher_grade'
  ) THEN
    ALTER TABLE mythologies ADD COLUMN teacher_grade TEXT;
  END IF;

  -- teacher_feedback
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mythologies' AND column_name = 'teacher_feedback'
  ) THEN
    ALTER TABLE mythologies ADD COLUMN teacher_feedback TEXT;
  END IF;

  -- graded_at
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mythologies' AND column_name = 'graded_at'
  ) THEN
    ALTER TABLE mythologies ADD COLUMN graded_at TIMESTAMPTZ;
  END IF;

  -- graded_by
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mythologies' AND column_name = 'graded_by'
  ) THEN
    ALTER TABLE mythologies ADD COLUMN graded_by UUID REFERENCES profiles(id);
  END IF;
END $$;

-- Create mythology_comments table for teacher notes
CREATE TABLE IF NOT EXISTS mythology_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mythology_id UUID NOT NULL REFERENCES mythologies(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mythology_comments_mythology ON mythology_comments(mythology_id);
CREATE INDEX IF NOT EXISTS idx_mythology_comments_teacher ON mythology_comments(teacher_id);

-- Enable RLS on comments
ALTER TABLE mythology_comments ENABLE ROW LEVEL SECURITY;

-- Teachers can view comments on mythologies in their classroom
CREATE POLICY "Teachers view comments in their classroom"
  ON mythology_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mythologies m
      JOIN classrooms c ON m.classroom_id = c.id
      WHERE m.id = mythology_comments.mythology_id
      AND c.teacher_id = auth.uid()
    )
  );

-- Teachers can create comments on mythologies in their classroom
CREATE POLICY "Teachers create comments in their classroom"
  ON mythology_comments FOR INSERT
  WITH CHECK (
    teacher_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM mythologies m
      JOIN classrooms c ON m.classroom_id = c.id
      WHERE m.id = mythology_id
      AND c.teacher_id = auth.uid()
    )
  );

-- Teachers can update their own comments
CREATE POLICY "Teachers update own comments"
  ON mythology_comments FOR UPDATE
  USING (teacher_id = auth.uid());

-- Teachers can delete their own comments
CREATE POLICY "Teachers delete own comments"
  ON mythology_comments FOR DELETE
  USING (teacher_id = auth.uid());

-- Allow teachers to update mythologies in their classroom (for grading)
-- Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Teachers update mythologies in their classroom" ON mythologies;

CREATE POLICY "Teachers update mythologies in their classroom"
  ON mythologies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM classrooms c
      WHERE c.id = mythologies.classroom_id
      AND c.teacher_id = auth.uid()
    )
  );

-- Allow teachers to view all mythologies in their classroom
DROP POLICY IF EXISTS "Teachers view mythologies in their classroom" ON mythologies;

CREATE POLICY "Teachers view mythologies in their classroom"
  ON mythologies FOR SELECT
  USING (
    -- Own mythology
    created_by = auth.uid()
    OR
    -- Teacher viewing their classroom
    EXISTS (
      SELECT 1 FROM classrooms c
      WHERE c.id = mythologies.classroom_id
      AND c.teacher_id = auth.uid()
    )
    OR
    -- Public visibility
    visibility = 'public'
  );
