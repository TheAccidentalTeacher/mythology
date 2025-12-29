-- =====================================================
-- PHASE 4: AI ASSISTANCE SYSTEM
-- Tracking AI usage, preferences, and wizard progress
-- =====================================================

-- =====================================================
-- 1. AI USAGE LOG
-- Tracks all AI assistance interactions
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_usage_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    mythology_id UUID REFERENCES mythologies(id) ON DELETE SET NULL,
    
    -- What kind of help
    assistance_type VARCHAR(50) NOT NULL,
    -- Types: give_ideas, improve, ask_questions, check_fit, show_examples,
    --        grammar_check, name_brainstorm, wizard_help
    
    -- Context
    field_name VARCHAR(100),           -- Which field was being edited
    entity_type VARCHAR(50),           -- character, creature, story, mythology, etc.
    entity_id UUID,                    -- ID of entity being edited
    
    -- The interaction
    user_input TEXT,                   -- What user typed/asked
    ai_response TEXT,                  -- What AI responded
    response_used BOOLEAN DEFAULT FALSE, -- Did user use the suggestion?
    
    -- Metadata
    assistance_level VARCHAR(20),      -- guide_me, support_me, challenge_me
    tokens_used INTEGER DEFAULT 0,     -- For cost tracking
    response_time_ms INTEGER,          -- How long AI took to respond
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. AI PREFERENCES
-- Student preferences for AI assistance
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Main assistance level
    assistance_level VARCHAR(20) DEFAULT 'support_me',
    -- Values: guide_me, support_me, challenge_me
    
    -- Feature toggles
    grammar_enabled BOOLEAN DEFAULT TRUE,
    proactive_hints BOOLEAN DEFAULT TRUE,
    show_name_suggestions BOOLEAN DEFAULT TRUE,
    show_geography_prompts BOOLEAN DEFAULT TRUE,
    show_examples BOOLEAN DEFAULT TRUE,
    sound_effects BOOLEAN DEFAULT TRUE,
    
    -- Usage tracking
    daily_usage_count INTEGER DEFAULT 0,
    last_usage_date DATE,
    total_usage_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- =====================================================
-- 3. CLASSROOM AI SETTINGS
-- Teacher controls for AI in their classroom
-- =====================================================
CREATE TABLE IF NOT EXISTS classroom_ai_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID NOT NULL REFERENCES classrooms(id) ON DELETE CASCADE,
    
    -- Main controls
    ai_enabled BOOLEAN DEFAULT TRUE,
    default_assistance_level VARCHAR(20) DEFAULT 'support_me',
    max_daily_ai_uses INTEGER DEFAULT 100,
    grammar_required BOOLEAN DEFAULT FALSE,
    
    -- Assessment mode (disable AI during tests)
    assessment_mode BOOLEAN DEFAULT FALSE,
    assessment_start TIMESTAMPTZ,
    assessment_end TIMESTAMPTZ,
    
    -- Notifications
    notify_high_usage BOOLEAN DEFAULT TRUE,
    high_usage_threshold INTEGER DEFAULT 50,
    notify_no_usage BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(classroom_id)
);

-- =====================================================
-- 4. WIZARD PROGRESS
-- Track multi-step mythology creation wizard
-- =====================================================
CREATE TABLE IF NOT EXISTS wizard_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- What wizard is this for
    wizard_type VARCHAR(50) DEFAULT 'mythology_creation',
    
    -- Progress tracking
    current_step VARCHAR(50) DEFAULT 'category',
    -- Steps: category, geography, five_themes, name, preview, complete
    
    -- Store all wizard answers as JSON
    step_data JSONB DEFAULT '{}'::jsonb,
    -- Contains: {
    --   category: string,
    --   subcategory: string,
    --   geography: { environment, climate, features },
    --   five_themes: { location, place, interaction, movement, regions },
    --   name_options: string[],
    --   selected_name: string,
    --   description: string
    -- }
    
    -- Timing
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    
    -- Status
    is_complete BOOLEAN DEFAULT FALSE,
    
    -- Result
    result_id UUID -- The created mythology ID
);

-- =====================================================
-- 5. ADD AI COLUMNS TO PROFILES
-- =====================================================
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS ai_usage_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS ai_usage_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_ai_use TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS preferred_ai_level VARCHAR(20) DEFAULT 'support_me',
ADD COLUMN IF NOT EXISTS wizard_completed BOOLEAN DEFAULT FALSE;

-- =====================================================
-- 6. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON ai_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_mythology ON ai_usage_log(mythology_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created ON ai_usage_log(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_type ON ai_usage_log(assistance_type);
CREATE INDEX IF NOT EXISTS idx_ai_preferences_user ON ai_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_classroom_ai_settings ON classroom_ai_settings(classroom_id);
CREATE INDEX IF NOT EXISTS idx_wizard_progress_user ON wizard_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_wizard_progress_mythology ON wizard_progress(mythology_id);

-- =====================================================
-- 7. ROW LEVEL SECURITY
-- =====================================================

-- AI Usage Log - users see their own, teachers see classroom
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own AI usage" ON ai_usage_log 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Teachers view classroom AI usage" ON ai_usage_log 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN mythologies m ON m.created_by = ai_usage_log.user_id
            WHERE p.id = auth.uid() 
            AND p.role = 'teacher'
            AND m.classroom_id IN (
                SELECT id FROM classrooms WHERE teacher_id = auth.uid()
            )
        )
    );

CREATE POLICY "System inserts AI usage" ON ai_usage_log 
    FOR INSERT WITH CHECK (true);

-- AI Preferences - users manage their own
ALTER TABLE ai_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own preferences" ON ai_preferences 
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users update own preferences" ON ai_preferences 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users insert own preferences" ON ai_preferences 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Classroom AI Settings - teachers only
ALTER TABLE classroom_ai_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers manage classroom AI settings" ON classroom_ai_settings 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM classrooms 
            WHERE id = classroom_ai_settings.classroom_id 
            AND teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students view classroom AI settings" ON classroom_ai_settings 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND classroom_id = classroom_ai_settings.classroom_id
        )
    );

-- Wizard Progress - users manage their own
ALTER TABLE wizard_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wizard progress" ON wizard_progress 
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 8. HELPER FUNCTION: Log AI Usage
-- =====================================================
CREATE OR REPLACE FUNCTION log_ai_usage(
    p_user_id UUID,
    p_assistance_type VARCHAR(50),
    p_mythology_id UUID DEFAULT NULL,
    p_field_name VARCHAR(100) DEFAULT NULL,
    p_entity_type VARCHAR(50) DEFAULT NULL,
    p_entity_id UUID DEFAULT NULL,
    p_user_input TEXT DEFAULT NULL,
    p_ai_response TEXT DEFAULT NULL,
    p_tokens_used INTEGER DEFAULT 0,
    p_response_time_ms INTEGER DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
    v_assistance_level VARCHAR(20);
BEGIN
    -- Get user's assistance level
    SELECT COALESCE(preferred_ai_level, 'support_me') INTO v_assistance_level
    FROM profiles WHERE id = p_user_id;
    
    -- Insert log entry
    INSERT INTO ai_usage_log (
        user_id, mythology_id, assistance_type, field_name, 
        entity_type, entity_id, user_input, ai_response,
        assistance_level, tokens_used, response_time_ms
    ) VALUES (
        p_user_id, p_mythology_id, p_assistance_type, p_field_name,
        p_entity_type, p_entity_id, p_user_input, p_ai_response,
        v_assistance_level, p_tokens_used, p_response_time_ms
    ) RETURNING id INTO v_log_id;
    
    -- Update user's usage counts
    UPDATE profiles 
    SET ai_usage_today = CASE 
            WHEN DATE(last_ai_use) = CURRENT_DATE THEN ai_usage_today + 1
            ELSE 1
        END,
        ai_usage_total = COALESCE(ai_usage_total, 0) + 1,
        last_ai_use = NOW()
    WHERE id = p_user_id;
    
    -- Update preferences usage count
    UPDATE ai_preferences
    SET daily_usage_count = CASE 
            WHEN last_usage_date = CURRENT_DATE THEN daily_usage_count + 1
            ELSE 1
        END,
        last_usage_date = CURRENT_DATE,
        total_usage_count = COALESCE(total_usage_count, 0) + 1,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. HELPER FUNCTION: Check AI Availability
-- =====================================================
CREATE OR REPLACE FUNCTION check_ai_available(p_user_id UUID)
RETURNS TABLE (
    available BOOLEAN,
    reason TEXT,
    usage_today INTEGER,
    daily_limit INTEGER,
    assistance_level VARCHAR(20)
) AS $$
DECLARE
    v_classroom_id UUID;
    v_settings RECORD;
    v_usage INTEGER;
    v_level VARCHAR(20);
BEGIN
    -- Get user's classroom
    SELECT classroom_id, COALESCE(preferred_ai_level, 'support_me')
    INTO v_classroom_id, v_level
    FROM profiles WHERE id = p_user_id;
    
    -- Get today's usage
    SELECT COALESCE(ai_usage_today, 0) INTO v_usage
    FROM profiles WHERE id = p_user_id;
    
    -- Check classroom settings
    IF v_classroom_id IS NOT NULL THEN
        SELECT * INTO v_settings
        FROM classroom_ai_settings
        WHERE classroom_id = v_classroom_id;
        
        IF v_settings IS NOT NULL THEN
            -- Check if AI is disabled
            IF NOT v_settings.ai_enabled THEN
                RETURN QUERY SELECT FALSE, 'AI assistance is disabled for your classroom'::TEXT, v_usage, 0, v_level;
                RETURN;
            END IF;
            
            -- Check assessment mode
            IF v_settings.assessment_mode AND 
               NOW() BETWEEN COALESCE(v_settings.assessment_start, NOW()) AND COALESCE(v_settings.assessment_end, NOW()) THEN
                RETURN QUERY SELECT FALSE, 'AI assistance is disabled during assessment'::TEXT, v_usage, 0, v_level;
                RETURN;
            END IF;
            
            -- Check daily limit
            IF v_usage >= v_settings.max_daily_ai_uses THEN
                RETURN QUERY SELECT FALSE, 'Daily AI usage limit reached'::TEXT, v_usage, v_settings.max_daily_ai_uses, v_level;
                RETURN;
            END IF;
            
            RETURN QUERY SELECT TRUE, NULL::TEXT, v_usage, v_settings.max_daily_ai_uses, v_level;
            RETURN;
        END IF;
    END IF;
    
    -- Default: AI available with high limit
    RETURN QUERY SELECT TRUE, NULL::TEXT, v_usage, 100, v_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 10. COMMENTS
-- =====================================================
COMMENT ON TABLE ai_usage_log IS 'Tracks all AI assistance interactions for analytics and teacher visibility';
COMMENT ON TABLE ai_preferences IS 'Student preferences for AI assistance levels and features';
COMMENT ON TABLE classroom_ai_settings IS 'Teacher controls for AI features in their classroom';
COMMENT ON TABLE wizard_progress IS 'Tracks progress through the mythology creation wizard';
COMMENT ON FUNCTION log_ai_usage IS 'Helper function to log AI usage and update counters';
COMMENT ON FUNCTION check_ai_available IS 'Checks if AI assistance is available for a user';
