-- =====================================================
-- PHASE 3: GAMIFICATION SYSTEM
-- Points, Badges, Levels, Streaks, Leaderboards
-- =====================================================

-- =====================================================
-- 1. BADGES TABLE
-- Defines all available badges/achievements
-- =====================================================
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL DEFAULT '🏅',
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    -- Categories: creation, quality, collaboration, streak, battle, special
    points_reward INTEGER NOT NULL DEFAULT 0,
    requirement_type VARCHAR(50) NOT NULL,
    -- Types: count, milestone, manual, streak, battle_wins, peer_votes
    requirement_target INTEGER DEFAULT 1,
    -- e.g., create 5 characters = requirement_target: 5
    requirement_entity VARCHAR(50),
    -- e.g., 'character', 'creature', 'story', 'map', 'battle', 'crossover'
    rarity VARCHAR(20) NOT NULL DEFAULT 'common',
    -- Rarities: common, uncommon, rare, epic, legendary
    is_hidden BOOLEAN DEFAULT FALSE,
    -- Hidden badges are surprises until earned
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. USER BADGES (Junction table)
-- Tracks which badges each user has earned
-- =====================================================
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    is_displayed BOOLEAN DEFAULT TRUE,
    -- User can choose which badges to show on profile
    UNIQUE(user_id, badge_id)
);

-- =====================================================
-- 3. POINTS LOG
-- Detailed history of all point transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS points_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    -- Types: character_created, story_completed, creature_created, map_created,
    --        battle_participated, battle_won, crossover_completed, daily_login,
    --        peer_review, teacher_bonus, badge_earned, streak_milestone
    description TEXT,
    reference_id UUID,
    -- Optional: ID of the character/story/etc that earned points
    reference_type VARCHAR(50),
    -- Optional: 'character', 'story', 'creature', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. STREAKS TABLE
-- Tracks login and creation streaks
-- =====================================================
CREATE TABLE IF NOT EXISTS user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    streak_type VARCHAR(50) NOT NULL,
    -- Types: login, creation
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    streak_frozen BOOLEAN DEFAULT FALSE,
    -- Teacher can freeze streaks during breaks
    frozen_until DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, streak_type)
);

-- =====================================================
-- 5. DAILY CHALLENGES
-- Teacher-created or system daily challenges
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    -- NULL = global challenge for all classrooms
    title VARCHAR(200) NOT NULL,
    description TEXT,
    challenge_type VARCHAR(50) NOT NULL,
    -- Types: create_character, write_words, add_creature, update_map, start_battle, peer_review
    target_count INTEGER DEFAULT 1,
    points_reward INTEGER NOT NULL DEFAULT 10,
    active_date DATE NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 6. DAILY CHALLENGE COMPLETIONS
-- Tracks who completed which challenges
-- =====================================================
CREATE TABLE IF NOT EXISTS challenge_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- =====================================================
-- 7. LEADERBOARD CACHE (for performance)
-- Updated periodically, not on every action
-- =====================================================
CREATE TABLE IF NOT EXISTS leaderboard_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    classroom_id UUID REFERENCES classrooms(id) ON DELETE CASCADE,
    leaderboard_type VARCHAR(50) NOT NULL,
    -- Types: total_points, stories_written, battles_won, creatures_created, 
    --        crossovers_completed, longest_streak, peer_favorites
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(classroom_id, leaderboard_type, user_id)
);

-- =====================================================
-- 8. ADD GAMIFICATION COLUMNS TO PROFILES
-- =====================================================
-- Note: profiles table already has points, level, streak columns
-- Let's add more gamification-specific columns

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS xp_to_next_level INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS title_prefix VARCHAR(100),
ADD COLUMN IF NOT EXISTS avatar_config JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_banner VARCHAR(100),
ADD COLUMN IF NOT EXISTS showcase_character_id UUID,
ADD COLUMN IF NOT EXISTS showcase_badge_ids UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_login_date DATE,
ADD COLUMN IF NOT EXISTS login_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS creation_streak INTEGER DEFAULT 0;

-- =====================================================
-- 9. INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON user_badges(badge_id);
CREATE INDEX IF NOT EXISTS idx_points_log_user ON points_log(user_id);
CREATE INDEX IF NOT EXISTS idx_points_log_created ON points_log(created_at);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user ON user_streaks(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_classroom ON leaderboard_cache(classroom_id, leaderboard_type);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(active_date);
CREATE INDEX IF NOT EXISTS idx_challenge_completions_user ON challenge_completions(user_id);

-- =====================================================
-- 10. SEED INITIAL BADGES
-- =====================================================
INSERT INTO badges (name, description, icon, category, points_reward, requirement_type, requirement_target, requirement_entity, rarity) VALUES
-- Creation Milestones
('First Steps', 'Create your first character', '👶', 'creation', 50, 'count', 1, 'character', 'common'),
('Pantheon Builder', 'Create 5 characters', '🏛️', 'creation', 100, 'count', 5, 'character', 'common'),
('Divine Assembly', 'Create 10 characters', '⚡', 'creation', 200, 'count', 10, 'character', 'uncommon'),
('Legendary Pantheon', 'Create 25 characters', '👑', 'creation', 500, 'count', 25, 'character', 'rare'),

('Beast Tamer', 'Create your first creature', '🐉', 'creation', 50, 'count', 1, 'creature', 'common'),
('Bestiary Keeper', 'Create 5 creatures', '📖', 'creation', 100, 'count', 5, 'creature', 'common'),
('Monster Master', 'Create 10 creatures', '🦎', 'creation', 200, 'count', 10, 'creature', 'uncommon'),
('Legendary Bestiary', 'Create 25 creatures', '🐲', 'creation', 500, 'count', 25, 'creature', 'rare'),

('Epic Chronicler', 'Write your first story', '📜', 'creation', 75, 'count', 1, 'story', 'common'),
('Saga Weaver', 'Write 5 stories', '📚', 'creation', 150, 'count', 5, 'story', 'common'),
('Lore Master', 'Write 10 stories', '🎭', 'creation', 300, 'count', 10, 'story', 'uncommon'),
('Epic Anthology', 'Write 25 stories', '📕', 'creation', 750, 'count', 25, 'story', 'rare'),

('Cartographer', 'Create your first map', '🗺️', 'creation', 75, 'count', 1, 'map', 'common'),
('Atlas Maker', 'Create 3 maps', '🌍', 'creation', 150, 'count', 3, 'map', 'common'),
('World Builder', 'Create 5 maps', '🌐', 'creation', 300, 'count', 5, 'map', 'uncommon'),

('Realm Creator', 'Create your first realm', '🏰', 'creation', 75, 'count', 1, 'realm', 'common'),
('Dimension Weaver', 'Create 5 realms', '✨', 'creation', 200, 'count', 5, 'realm', 'uncommon'),

-- Battle Achievements
('First Blood', 'Win your first battle', '⚔️', 'battle', 50, 'battle_wins', 1, 'battle', 'common'),
('Warrior', 'Win 5 battles', '🗡️', 'battle', 100, 'battle_wins', 5, 'battle', 'common'),
('War Veteran', 'Participate in 10 battles', '🛡️', 'battle', 150, 'battle_wins', 10, 'battle', 'uncommon'),
('Battle Legend', 'Win 25 battles', '🏆', 'battle', 400, 'battle_wins', 25, 'battle', 'rare'),
('God of War', 'Win 50 battles', '⚡', 'battle', 1000, 'battle_wins', 50, 'battle', 'epic'),

-- Collaboration Achievements
('Crossover Pioneer', 'Complete your first crossover', '🤝', 'collaboration', 100, 'count', 1, 'crossover', 'common'),
('Multiverse Traveler', 'Complete 5 crossovers', '🌌', 'collaboration', 250, 'count', 5, 'crossover', 'uncommon'),
('Alliance Forger', 'Form a mythology alliance', '🤜🤛', 'collaboration', 150, 'count', 1, 'alliance', 'common'),
('Diplomatic Master', 'Form 5 alliances', '🕊️', 'collaboration', 400, 'count', 5, 'alliance', 'rare'),

-- Streak Achievements
('Getting Started', '3-day login streak', '🔥', 'streak', 50, 'streak', 3, 'login', 'common'),
('Committed Creator', '7-day login streak', '💪', 'streak', 100, 'streak', 7, 'login', 'common'),
('Dedicated Mythmaker', '14-day login streak', '🌟', 'streak', 200, 'streak', 14, 'login', 'uncommon'),
('Streak Champion', '30-day login streak', '👑', 'streak', 500, 'streak', 30, 'login', 'rare'),
('Unstoppable', '60-day login streak', '🚀', 'streak', 1000, 'streak', 60, 'login', 'epic'),
('Legendary Dedication', '100-day login streak', '💎', 'streak', 2000, 'streak', 100, 'login', 'legendary'),

-- Quality Achievements
('Peer Favorite', 'Get 10 favorites from classmates', '❤️', 'quality', 200, 'peer_votes', 10, 'favorite', 'uncommon'),
('Class Legend', 'Get 25 favorites from classmates', '🌟', 'quality', 500, 'peer_votes', 25, 'favorite', 'rare'),

-- Special Achievements
('Worldbuilder Supreme', 'Create a complete mythology (10+ chars, 5+ creatures, 3+ stories, 2+ maps)', '🏛️', 'special', 1000, 'milestone', 1, 'complete_mythology', 'epic'),
('First of Many', 'Be first to complete an assignment', '🥇', 'special', 100, 'manual', 1, 'first_complete', 'uncommon'),
('Helping Hand', 'Help 5 classmates (teacher awarded)', '🙌', 'special', 250, 'manual', 5, 'help', 'uncommon'),
('Teachers Choice', 'Receive teacher highlight', '⭐', 'special', 300, 'manual', 1, 'teacher_choice', 'rare')

ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 11. ROW LEVEL SECURITY
-- =====================================================

-- Badges are public (everyone can see available badges)
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are viewable by all" ON badges FOR SELECT USING (true);

-- User badges - users see their own, others can see displayed badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all earned badges" ON user_badges FOR SELECT USING (true);
CREATE POLICY "System inserts badges" ON user_badges FOR INSERT WITH CHECK (true);

-- Points log - users see their own
ALTER TABLE points_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own points" ON points_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System inserts points" ON points_log FOR INSERT WITH CHECK (true);

-- Streaks - public (for leaderboards)
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Streaks are viewable" ON user_streaks FOR SELECT USING (true);
CREATE POLICY "System manages streaks" ON user_streaks FOR ALL USING (true);

-- Daily challenges - classroom members can view
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View classroom challenges" ON daily_challenges FOR SELECT USING (true);
CREATE POLICY "Teachers create challenges" ON daily_challenges FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'teacher'));

-- Challenge completions
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own completions" ON challenge_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System inserts completions" ON challenge_completions FOR INSERT WITH CHECK (true);

-- Leaderboard cache - public
ALTER TABLE leaderboard_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leaderboards are public" ON leaderboard_cache FOR SELECT USING (true);
CREATE POLICY "System updates leaderboards" ON leaderboard_cache FOR ALL USING (true);

-- =====================================================
-- 12. HELPER FUNCTION: Award Points
-- =====================================================
CREATE OR REPLACE FUNCTION award_points(
    p_user_id UUID,
    p_points INTEGER,
    p_action_type VARCHAR(50),
    p_description TEXT DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_reference_type VARCHAR(50) DEFAULT NULL
) RETURNS void AS $$
BEGIN
    -- Insert into points log
    INSERT INTO points_log (user_id, points, action_type, description, reference_id, reference_type)
    VALUES (p_user_id, p_points, p_action_type, p_description, p_reference_id, p_reference_type);
    
    -- Update profile total points
    UPDATE profiles 
    SET total_points = COALESCE(total_points, 0) + p_points,
        points = COALESCE(points, 0) + p_points
    WHERE id = p_user_id;
    
    -- Check for level up (every 500 points = new level)
    UPDATE profiles
    SET current_level = GREATEST(1, FLOOR(COALESCE(total_points, 0) / 500) + 1),
        xp_to_next_level = 500 - (COALESCE(total_points, 0) % 500)
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 13. HELPER FUNCTION: Check and Award Badge
-- =====================================================
CREATE OR REPLACE FUNCTION check_and_award_badge(
    p_user_id UUID,
    p_badge_name VARCHAR(100)
) RETURNS BOOLEAN AS $$
DECLARE
    v_badge_id UUID;
    v_already_has BOOLEAN;
    v_points_reward INTEGER;
BEGIN
    -- Get badge ID
    SELECT id, points_reward INTO v_badge_id, v_points_reward
    FROM badges WHERE name = p_badge_name;
    
    IF v_badge_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user already has badge
    SELECT EXISTS(SELECT 1 FROM user_badges WHERE user_id = p_user_id AND badge_id = v_badge_id)
    INTO v_already_has;
    
    IF v_already_has THEN
        RETURN FALSE;
    END IF;
    
    -- Award the badge
    INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, v_badge_id);
    
    -- Award bonus points for earning the badge
    IF v_points_reward > 0 THEN
        PERFORM award_points(p_user_id, v_points_reward, 'badge_earned', 'Earned badge: ' || p_badge_name);
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 14. TRIGGER: Update Streak on Login
-- =====================================================
CREATE OR REPLACE FUNCTION update_login_streak() RETURNS TRIGGER AS $$
DECLARE
    v_last_login DATE;
    v_today DATE := CURRENT_DATE;
    v_new_streak INTEGER;
BEGIN
    -- Get last login date
    SELECT last_login_date INTO v_last_login FROM profiles WHERE id = NEW.id;
    
    -- If same day, no update needed
    IF v_last_login = v_today THEN
        RETURN NEW;
    END IF;
    
    -- Calculate new streak
    IF v_last_login = v_today - INTERVAL '1 day' THEN
        -- Consecutive day - increment streak
        v_new_streak := COALESCE(NEW.login_streak, 0) + 1;
    ELSIF v_last_login IS NULL OR v_last_login < v_today - INTERVAL '1 day' THEN
        -- Streak broken - reset to 1
        v_new_streak := 1;
    ELSE
        v_new_streak := COALESCE(NEW.login_streak, 0);
    END IF;
    
    -- Update the values
    NEW.last_login_date := v_today;
    NEW.login_streak := v_new_streak;
    
    -- Award points for daily login
    PERFORM award_points(NEW.id, 5, 'daily_login', 'Daily login bonus');
    
    -- Check streak badges
    IF v_new_streak >= 3 THEN PERFORM check_and_award_badge(NEW.id, 'Getting Started'); END IF;
    IF v_new_streak >= 7 THEN PERFORM check_and_award_badge(NEW.id, 'Committed Creator'); END IF;
    IF v_new_streak >= 14 THEN PERFORM check_and_award_badge(NEW.id, 'Dedicated Mythmaker'); END IF;
    IF v_new_streak >= 30 THEN PERFORM check_and_award_badge(NEW.id, 'Streak Champion'); END IF;
    IF v_new_streak >= 60 THEN PERFORM check_and_award_badge(NEW.id, 'Unstoppable'); END IF;
    IF v_new_streak >= 100 THEN PERFORM check_and_award_badge(NEW.id, 'Legendary Dedication'); END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: The trigger should be created on the profiles table updates
-- CREATE TRIGGER trigger_update_login_streak
-- BEFORE UPDATE ON profiles
-- FOR EACH ROW
-- EXECUTE FUNCTION update_login_streak();

-- =====================================================
-- 15. LEVEL TITLES
-- =====================================================
-- These are the title prefixes students can earn
-- Level 1-5: Novice Mythmaker
-- Level 6-10: Apprentice Creator  
-- Level 11-15: Skilled Storyteller
-- Level 16-20: Master Worldbuilder
-- Level 21-30: Legendary Architect
-- Level 31+: God of Gods

COMMENT ON TABLE badges IS 'Achievement badges that users can earn through various activities';
COMMENT ON TABLE user_badges IS 'Junction table tracking which badges each user has earned';
COMMENT ON TABLE points_log IS 'Detailed history of all point transactions for auditing and display';
COMMENT ON TABLE user_streaks IS 'Tracks login and creation streaks for each user';
COMMENT ON TABLE daily_challenges IS 'Teacher or system-created daily challenges';
COMMENT ON TABLE challenge_completions IS 'Tracks which users completed which challenges';
COMMENT ON TABLE leaderboard_cache IS 'Cached leaderboard data for performance';
