-- Assignment System for Revolutionary Teaching
-- Supports multi-age differentiation, narrative feedback, unlimited revisions

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  
  -- Timing
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ,
  available_from TIMESTAMPTZ DEFAULT NOW(),
  available_until TIMESTAMPTZ,
  
  -- Grading
  points_possible INTEGER DEFAULT 100,
  rubric JSONB, -- Structured rubric data (optional - homeschoolers may skip)
  teacher_feedback_template TEXT, -- Narrative feedback prompts
  
  -- Differentiation (CRITICAL for multi-age homeschool)
  min_grade_level INTEGER, -- e.g., 3
  max_grade_level INTEGER, -- e.g., 8
  difficulty_levels JSONB, -- Different versions: beginner, intermediate, advanced
  scaffolding_hints TEXT[], -- Progressive hints for struggling students
  extension_challenges TEXT[], -- For advanced/gifted students
  
  -- Standards
  standards TEXT[], -- Array of standard codes (e.g., ['CCSS.ELA-LITERACY.W.6.3'])
  learning_objectives TEXT[],
  
  -- Subject Area (for AI accuracy checking)
  subject_area TEXT, -- 'mythology', 'science', 'history', 'civics', 'math', 'ela'
  cross_curricular_connections TEXT[], -- Links to other subjects
  
  -- Settings
  allow_late BOOLEAN DEFAULT true,
  late_penalty_percent INTEGER DEFAULT 0, -- Usually 0 for homeschool - focus on mastery
  requires_submission BOOLEAN DEFAULT true,
  submission_type TEXT DEFAULT 'mythology', -- 'mythology', 'text', 'file', 'link'
  allow_revisions BOOLEAN DEFAULT true, -- ALWAYS true - growth mindset
  max_revisions INTEGER, -- NULL = unlimited
  collaboration_mode TEXT DEFAULT 'optional', -- 'required', 'optional', 'individual_only'
  
  -- AI Assistance
  ai_feedback_enabled BOOLEAN DEFAULT true, -- AI can give gentle first-pass feedback
  ai_accuracy_check BOOLEAN DEFAULT false, -- For science/history - verify facts
  
  -- Status
  is_published BOOLEAN DEFAULT false,
  is_template BOOLEAN DEFAULT false,
  template_category TEXT -- 'mythology_basics', 'science_conversion', 'civics', etc.
);

-- Assignment submissions table
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Submission
  submitted_at TIMESTAMPTZ,
  submission_data JSONB, -- Flexible data structure
  mythology_id UUID REFERENCES mythologies(id),
  revision_number INTEGER DEFAULT 1, -- Track which revision this is
  
  -- Feedback (NARRATIVE, not just grades)
  narrative_feedback TEXT, -- Main teacher feedback
  strength_comments TEXT[], -- What student did well
  growth_comments TEXT[], -- Areas for improvement
  next_steps TEXT[], -- Specific suggestions for revision
  parent_feedback TEXT, -- Parent can also provide feedback
  
  -- Grading (delayed until teacher releases)
  grade NUMERIC,
  grade_released BOOLEAN DEFAULT false, -- Teacher must explicitly release
  grade_released_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  graded_by UUID REFERENCES profiles(id),
  
  -- Standards mastery tracking
  standards_mastery JSONB, -- {standard_code: mastery_level}
  
  -- AI Assistance
  ai_feedback TEXT, -- Gentle AI suggestions (never released to student without teacher review)
  ai_accuracy_issues JSONB, -- Flagged factual errors (for science/history)
  ai_suggestions_reviewed BOOLEAN DEFAULT false, -- Has teacher looked at AI suggestions?
  
  -- Status
  status TEXT DEFAULT 'not_started', -- 'not_started', 'in_progress', 'submitted', 'needs_revision', 'graded', 'released'
  is_late BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(assignment_id, student_id, revision_number)
);

-- Submission history (track all revisions)
CREATE TABLE IF NOT EXISTS submission_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES assignment_submissions(id) ON DELETE CASCADE NOT NULL,
  revision_number INTEGER NOT NULL,
  submission_data JSONB,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  feedback_at_time TEXT, -- Snapshot of feedback when this revision was submitted
  
  UNIQUE(submission_id, revision_number)
);

-- Assignment templates (pre-built curiosity-driven assignments)
CREATE TABLE IF NOT EXISTS assignment_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  category TEXT NOT NULL, -- 'mythology_basics', 'science', 'civics', 'math', 'ela'
  grade_level_range TEXT, -- 'elementary', 'middle', 'high', 'multi-age'
  difficulty TEXT, -- 'beginner', 'intermediate', 'advanced'
  template_data JSONB, -- Full assignment structure
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_assignments_classroom ON assignments(classroom_id);
CREATE INDEX IF NOT EXISTS idx_assignments_teacher ON assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_assignments_published ON assignments(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON assignment_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON assignment_submissions(status);

-- RLS Policies
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_templates ENABLE ROW LEVEL SECURITY;

-- Teachers can manage assignments in their classroom
CREATE POLICY "Teachers can manage classroom assignments"
  ON assignments FOR ALL
  USING (
    teacher_id = auth.uid() OR 
    classroom_id IN (
      SELECT classroom_id FROM profiles WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Students can view published assignments in their classroom
CREATE POLICY "Students can view published assignments"
  ON assignments FOR SELECT
  USING (
    is_published = true AND 
    classroom_id IN (
      SELECT classroom_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Students can manage their own submissions
CREATE POLICY "Students can manage own submissions"
  ON assignment_submissions FOR ALL
  USING (student_id = auth.uid());

-- Teachers can view all submissions in their classroom
CREATE POLICY "Teachers can view classroom submissions"
  ON assignment_submissions FOR SELECT
  USING (
    assignment_id IN (
      SELECT id FROM assignments WHERE teacher_id = auth.uid()
    )
  );

-- Teachers can update submissions (for grading/feedback)
CREATE POLICY "Teachers can grade submissions"
  ON assignment_submissions FOR UPDATE
  USING (
    assignment_id IN (
      SELECT id FROM assignments WHERE teacher_id = auth.uid()
    )
  );

-- Parents can view their children's submissions
CREATE POLICY "Parents can view child submissions"
  ON assignment_submissions FOR SELECT
  USING (
    student_id IN (
      SELECT id FROM profiles 
      WHERE classroom_id IN (
        SELECT classroom_id FROM profiles WHERE id = auth.uid()
      ) AND role = 'student'
    )
  );

-- Parents can add feedback to their children's submissions
CREATE POLICY "Parents can provide feedback"
  ON assignment_submissions FOR UPDATE
  USING (
    student_id IN (
      SELECT id FROM profiles 
      WHERE classroom_id IN (
        SELECT classroom_id FROM profiles WHERE id = auth.uid()
      ) AND role = 'student'
    )
  )
  WITH CHECK (
    student_id IN (
      SELECT id FROM profiles 
      WHERE classroom_id IN (
        SELECT classroom_id FROM profiles WHERE id = auth.uid()
      ) AND role = 'student'
    )
  );

-- Anyone can view assignment templates
CREATE POLICY "Anyone can view templates"
  ON assignment_templates FOR SELECT
  USING (is_active = true);

-- Submission history policies
CREATE POLICY "Students can view own history"
  ON submission_history FOR SELECT
  USING (
    submission_id IN (
      SELECT id FROM assignment_submissions WHERE student_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can view student history"
  ON submission_history FOR SELECT
  USING (
    submission_id IN (
      SELECT sub.id FROM assignment_submissions sub
      JOIN assignments a ON sub.assignment_id = a.id
      WHERE a.teacher_id = auth.uid()
    )
  );

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON assignment_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comments
COMMENT ON TABLE assignments IS 'Curiosity-driven assignments with multi-age differentiation and narrative feedback focus';
COMMENT ON COLUMN assignments.collaboration_mode IS 'Whether students must work alone, can optionally collaborate, or must collaborate';
COMMENT ON COLUMN assignments.ai_accuracy_check IS 'Enable AI fact-checking for science/history assignments';
COMMENT ON TABLE assignment_submissions IS 'Student submissions with support for unlimited revisions and narrative feedback';
COMMENT ON COLUMN assignment_submissions.grade_released IS 'Teacher must explicitly release grades - prevents students from seeing arbitrary numbers before meaningful feedback';
