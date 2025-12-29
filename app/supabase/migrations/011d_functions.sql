-- ===========================================
-- PART 4: HELPER FUNCTIONS
-- Run this fourth
-- ===========================================

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
