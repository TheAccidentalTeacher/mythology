-- Bulk create student accounts
-- Run this in Supabase SQL Editor to create all student accounts at once

-- This script will:
-- 1. Create auth users (bypassing normal signup flow)
-- 2. Trigger will auto-create profiles
-- 3. Link all students to the classroom

-- First, let's create the users in auth.users (this requires service role)
-- Note: You'll need to run this with elevated permissions or use the admin API

-- For each student, we need to:
-- INSERT INTO auth.users with proper password hash
-- The trigger will create the profile automatically

-- However, since we can't directly manipulate auth.users via SQL,
-- we need to use a different approach: Create via the Supabase Admin API

-- Instead, let's create a script file that can be run with Node.js
-- See: bulk-create-students.ts

-- Alternatively, if you want to create them manually via SQL,
-- you can insert directly into profiles table (after creating auth users through the dashboard)

-- Get your classroom ID first:
SELECT id, invite_code FROM classrooms WHERE teacher_id = (
  SELECT id FROM profiles WHERE email = 'scosom@gmail.com'
);

-- Once you have the classroom ID (should be f84c3dc5-3ac2-4a63-a18b-c7c93b5b19c1),
-- students can sign up normally or we can bulk create them via API script.
