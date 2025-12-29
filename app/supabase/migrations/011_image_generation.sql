-- Migration: Image Generation System
-- Adds tables for math quizzes and AI image generation

-- ============================================
-- QUIZ ATTEMPTS TABLE
-- ============================================
-- Track all math quiz attempts for analytics and token awards

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    problem_type TEXT NOT NULL,
    problem_data JSONB NOT NULL, -- The problem that was presented
    user_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_ms INTEGER, -- How long it took to answer
    streak_at_time INTEGER DEFAULT 0, -- What their streak was when answering
    tokens_awarded INTEGER DEFAULT 0, -- Tokens earned from this answer
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying user's quiz history
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_type ON quiz_attempts(problem_type, is_correct);

-- ============================================
-- GENERATED IMAGES TABLE
-- ============================================
-- Store all AI-generated images

CREATE TABLE IF NOT EXISTS generated_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- 'character', 'creature', 'realm', 'story', 'mythology', 'map'
    entity_id UUID NOT NULL, -- The ID of the character/creature/etc being depicted
    prompt TEXT NOT NULL, -- The full prompt sent to the AI
    student_addition TEXT, -- Any custom text the student added
    style_preset TEXT DEFAULT 'illustrated-storybook',
    image_url TEXT NOT NULL,
    thumbnail_url TEXT, -- Smaller version for galleries
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    flagged_reason TEXT, -- Why it was auto-flagged (if applicable)
    is_featured BOOLEAN DEFAULT FALSE, -- Teacher can feature great images
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES profiles(id),
    metadata JSONB DEFAULT '{}', -- For additional data (provider, cost, etc.)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for image queries
CREATE INDEX IF NOT EXISTS idx_generated_images_user ON generated_images(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_images_entity ON generated_images(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_status ON generated_images(status);
CREATE INDEX IF NOT EXISTS idx_generated_images_featured ON generated_images(is_featured) WHERE is_featured = TRUE;

-- ============================================
-- CLASSROOM IMAGE SETTINGS TABLE
-- ============================================
-- Teacher settings for image generation per classroom

CREATE TABLE IF NOT EXISTS classroom_image_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    image_gen_enabled BOOLEAN DEFAULT TRUE,
    require_approval BOOLEAN DEFAULT TRUE,
    daily_limit_per_student INTEGER DEFAULT 3,
    free_image_count INTEGER DEFAULT 5, -- Free images before tokens required
    questions_per_token INTEGER DEFAULT 3, -- Math questions to earn 1 token
    allowed_styles TEXT[] DEFAULT ARRAY['illustrated-storybook', 'watercolor', 'stone-carving', 'comic-book', 'pixel-art', 'oil-painting', 'cave-painting', 'anime-manga'],
    blocked_entity_types TEXT[] DEFAULT ARRAY[]::TEXT[], -- Entity types that can't generate images
    custom_blocked_terms TEXT[] DEFAULT ARRAY[]::TEXT[], -- Additional blocked terms for this classroom
    max_student_addition_length INTEGER DEFAULT 100,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id),
    UNIQUE(classroom_id)
);

-- ============================================
-- MODERATION LOG TABLE
-- ============================================
-- Log all teacher moderation actions for accountability

CREATE TABLE IF NOT EXISTS moderation_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES profiles(id),
    image_id UUID, -- Can be NULL if image was deleted
    action TEXT NOT NULL, -- 'approve', 'reject', 'delete', 'feature', 'unfeature'
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_log_teacher ON moderation_log(teacher_id, created_at DESC);

-- ============================================
-- ADD COLUMNS TO PROFILES TABLE
-- ============================================
-- Add image generation related columns to existing profiles table

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS image_tokens INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_images_generated INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS images_generated_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_image_generation_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS quiz_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_quiz_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_quiz_questions_answered INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_quiz_correct INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS disabled_math_topics TEXT[] DEFAULT ARRAY[]::TEXT[];

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Quiz attempts: Users can see their own attempts
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz attempts"
    ON quiz_attempts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quiz attempts"
    ON quiz_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Teachers can view quiz attempts for their classroom
CREATE POLICY "Teachers can view classroom quiz attempts"
    ON quiz_attempts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p1
            JOIN profiles p2 ON p1.classroom_id = p2.classroom_id
            WHERE p1.id = auth.uid()
            AND p1.role = 'teacher'
            AND p2.id = quiz_attempts.user_id
        )
    );

-- Generated images: Users can see their own images
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own images"
    ON generated_images FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own images"
    ON generated_images FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pending images"
    ON generated_images FOR DELETE
    USING (auth.uid() = user_id AND status = 'pending');

-- Teachers can view and modify classroom images
CREATE POLICY "Teachers can view classroom images"
    ON generated_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles p1
            JOIN profiles p2 ON p1.classroom_id = p2.classroom_id
            WHERE p1.id = auth.uid()
            AND p1.role = 'teacher'
            AND p2.id = generated_images.user_id
        )
    );

CREATE POLICY "Teachers can update classroom images"
    ON generated_images FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p1
            JOIN profiles p2 ON p1.classroom_id = p2.classroom_id
            WHERE p1.id = auth.uid()
            AND p1.role = 'teacher'
            AND p2.id = generated_images.user_id
        )
    );

CREATE POLICY "Teachers can delete classroom images"
    ON generated_images FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles p1
            JOIN profiles p2 ON p1.classroom_id = p2.classroom_id
            WHERE p1.id = auth.uid()
            AND p1.role = 'teacher'
            AND p2.id = generated_images.user_id
        )
    );

-- Classroom image settings: Only teachers can manage
ALTER TABLE classroom_image_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view own classroom settings"
    ON classroom_image_settings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'teacher'
            AND classroom_id = classroom_image_settings.classroom_id
        )
    );

CREATE POLICY "Teachers can update own classroom settings"
    ON classroom_image_settings FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'teacher'
            AND classroom_id = classroom_image_settings.classroom_id
        )
    );

CREATE POLICY "Teachers can insert own classroom settings"
    ON classroom_image_settings FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'teacher'
            AND classroom_id = classroom_image_settings.classroom_id
        )
    );

-- Students can read their classroom settings (to know limits, etc.)
CREATE POLICY "Students can view classroom settings"
    ON classroom_image_settings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND classroom_id = classroom_image_settings.classroom_id
        )
    );

-- Moderation log: Only teachers can view
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can view moderation log"
    ON moderation_log FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'teacher'
        )
    );

CREATE POLICY "Teachers can insert moderation log"
    ON moderation_log FOR INSERT
    WITH CHECK (auth.uid() = teacher_id);

-- ============================================
-- FUNCTIONS FOR TOKEN MANAGEMENT
-- ============================================

-- Function to award tokens after quiz completion
CREATE OR REPLACE FUNCTION award_quiz_tokens(
    p_user_id UUID,
    p_tokens INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    new_total INTEGER;
BEGIN
    UPDATE profiles
    SET image_tokens = image_tokens + p_tokens,
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING image_tokens INTO new_total;
    
    RETURN new_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update quiz streak
CREATE OR REPLACE FUNCTION update_quiz_streak(
    p_user_id UUID,
    p_is_correct BOOLEAN
)
RETURNS TABLE(
    new_streak INTEGER,
    longest_streak INTEGER,
    total_answered INTEGER,
    total_correct INTEGER
) AS $$
DECLARE
    current_streak INTEGER;
    current_longest INTEGER;
    current_total INTEGER;
    current_correct INTEGER;
BEGIN
    SELECT 
        COALESCE(quiz_streak, 0),
        COALESCE(longest_quiz_streak, 0),
        COALESCE(total_quiz_questions_answered, 0),
        COALESCE(total_quiz_correct, 0)
    INTO current_streak, current_longest, current_total, current_correct
    FROM profiles
    WHERE id = p_user_id;

    IF p_is_correct THEN
        current_streak := current_streak + 1;
        current_correct := current_correct + 1;
        IF current_streak > current_longest THEN
            current_longest := current_streak;
        END IF;
    ELSE
        current_streak := 0;
    END IF;
    
    current_total := current_total + 1;

    UPDATE profiles
    SET 
        quiz_streak = current_streak,
        longest_quiz_streak = current_longest,
        total_quiz_questions_answered = current_total,
        total_quiz_correct = current_correct,
        updated_at = NOW()
    WHERE id = p_user_id;

    RETURN QUERY SELECT current_streak, current_longest, current_total, current_correct;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STORAGE BUCKET FOR IMAGES
-- ============================================
-- Note: This needs to be run manually or via Supabase dashboard

-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--     'mythology-images',
--     'mythology-images',
--     TRUE,
--     5242880, -- 5MB max
--     ARRAY['image/png', 'image/jpeg', 'image/webp']
-- )
-- ON CONFLICT (id) DO NOTHING;

-- Storage policies (also needs to be run via dashboard or separate migration)
-- CREATE POLICY "Users can upload own images"
--     ON storage.objects FOR INSERT
--     WITH CHECK (bucket_id = 'mythology-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- CREATE POLICY "Public read access"
--     ON storage.objects FOR SELECT
--     USING (bucket_id = 'mythology-images');

-- CREATE POLICY "Users can delete own images"
--     ON storage.objects FOR DELETE
--     USING (bucket_id = 'mythology-images' AND (storage.foldername(name))[1] = auth.uid()::text);
