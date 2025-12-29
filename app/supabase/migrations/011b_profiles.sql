-- ===========================================
-- PART 2: ALTER PROFILES TABLE
-- Run this second
-- ===========================================

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
