-- ===========================================
-- PART 3: ROW LEVEL SECURITY POLICIES
-- Run this third
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE classroom_image_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_log ENABLE ROW LEVEL SECURITY;

-- QUIZ ATTEMPTS POLICIES
CREATE POLICY "Users can view own quiz attempts"
    ON quiz_attempts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own quiz attempts"
    ON quiz_attempts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

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

-- GENERATED IMAGES POLICIES
CREATE POLICY "Users can view own images"
    ON generated_images FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own images"
    ON generated_images FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pending images"
    ON generated_images FOR DELETE
    USING (auth.uid() = user_id AND status = 'pending');

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

-- CLASSROOM IMAGE SETTINGS POLICIES
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

CREATE POLICY "Students can view classroom settings"
    ON classroom_image_settings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND classroom_id = classroom_image_settings.classroom_id
        )
    );

-- MODERATION LOG POLICIES
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
