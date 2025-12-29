-- ===========================================
-- PART 1: CREATE TABLES
-- Run this first
-- ===========================================

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    problem_type TEXT NOT NULL,
    problem_data JSONB NOT NULL,
    user_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_ms INTEGER,
    streak_at_time INTEGER DEFAULT 0,
    tokens_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated images table
CREATE TABLE IF NOT EXISTS generated_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    prompt TEXT NOT NULL,
    student_addition TEXT,
    style_preset TEXT DEFAULT 'illustrated-storybook',
    image_url TEXT NOT NULL,
    thumbnail_url TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    flagged_reason TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES profiles(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classroom image settings table
CREATE TABLE IF NOT EXISTS classroom_image_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    image_gen_enabled BOOLEAN DEFAULT TRUE,
    require_approval BOOLEAN DEFAULT TRUE,
    daily_limit_per_student INTEGER DEFAULT 3,
    free_image_count INTEGER DEFAULT 5,
    questions_per_token INTEGER DEFAULT 3,
    allowed_styles TEXT[] DEFAULT ARRAY['illustrated-storybook', 'watercolor', 'stone-carving', 'comic-book', 'pixel-art', 'oil-painting', 'cave-painting', 'anime-manga'],
    blocked_entity_types TEXT[] DEFAULT ARRAY[]::TEXT[],
    custom_blocked_terms TEXT[] DEFAULT ARRAY[]::TEXT[],
    max_student_addition_length INTEGER DEFAULT 100,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    UNIQUE(classroom_id)
);

-- Moderation log table
CREATE TABLE IF NOT EXISTS moderation_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES profiles(id),
    image_id UUID,
    action TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_type ON quiz_attempts(problem_type, is_correct);
CREATE INDEX IF NOT EXISTS idx_generated_images_user ON generated_images(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_images_entity ON generated_images(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_status ON generated_images(status);
CREATE INDEX IF NOT EXISTS idx_generated_images_featured ON generated_images(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_moderation_log_teacher ON moderation_log(teacher_id, created_at DESC);
