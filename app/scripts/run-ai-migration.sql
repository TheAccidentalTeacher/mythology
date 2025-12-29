-- Run this in Supabase SQL Editor to enable the AI Assistance features

-- 1. WIZARD PROGRESS TABLE
CREATE TABLE IF NOT EXISTS wizard_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    wizard_type VARCHAR(50) DEFAULT 'mythology_creation',
    current_step VARCHAR(50) DEFAULT 'category',
    step_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    is_complete BOOLEAN DEFAULT FALSE,
    result_id UUID
);

-- 2. ROW LEVEL SECURITY
ALTER TABLE wizard_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wizard progress" ON wizard_progress 
    FOR ALL USING (auth.uid() = user_id);

-- 3. INDEX
CREATE INDEX IF NOT EXISTS idx_wizard_progress_user ON wizard_progress(user_id);

-- 4. ADD COLUMNS TO PROFILES (if not exists)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS wizard_completed BOOLEAN DEFAULT FALSE;

SELECT 'Migration complete! Wizard progress table created.' as status;
