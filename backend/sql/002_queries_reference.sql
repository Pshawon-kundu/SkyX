/**
 * SkyX Supabase PostgreSQL - Query Reference Guide
 * 
 * ⚠️  IMPORTANT: This file contains PostgreSQL 13+ syntax for Supabase ONLY
 * 
 * LINTER WARNING: VS Code may show red squiggles because the default SQL linter
 * is set to T-SQL (SQL Server). These are FALSE POSITIVES.
 * All syntax below is valid PostgreSQL for Supabase PostgreSQL Editor.
 * 
 * PostgreSQL Features Used:
 *   - public.schema prefix
 *   - :: type casting (PostreSQL syntax, NOT T-SQL)
 *   - ON CONFLICT (upsert, PostgreSQL 9.5+)
 *   - INTERVAL for date math
 *   - now(), DATE_TRUNC() functions
 * 
 * WHERE TO USE: Supabase Dashboard > SQL Editor
 * DO NOT: Run locally via sqlcmd or SQL Server
 * 
 * Reference: https://www.postgresql.org/docs/13/
 */

-- ============================================================================
-- QUICK SETUP - FOLLOW THESE STEPS
-- ============================================================================

/*
Step 1: Create Schema
  → Go to Supabase Dashboard > SQL Editor
  → Copy from: /backend/sql/001_create_skyx_schema.sql
  → Execute sections 1-20 in order

Step 2: Configure Supabase Auth
  → Go to Supabase > Authentication > Providers
  → Enable: Email, Google, X (Twitter)

Step 3: Set Redirect URLs
  → Supabase > Authentication > URL Configuration
  → Add: http://localhost:5173 (local)
  → Add: https://yourdomain.com (production)

Step 4: Save Credentials to .env
  Root .env:
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
  
  backend/.env:
    SUPABASE_URL=your_url
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

Step 5: Test Connection
  Terminal 1: cd backend && npm run dev
  Terminal 2: npm run dev
  Browser: http://localhost:5173
  Try signup/login
*/


-- ============================================================================
-- REFERENCE: SECTION A - Create New User (from Supabase Auth)
-- ============================================================================

-- Template: Insert user after Supabase signup
-- Usage: Backend calls this after receiving Supabase auth token
-- Syntax: PostgreSQL 13+ (Supabase)

/*
INSERT INTO public.users (
  supabase_id,
  email,
  full_name,
  referral_code,
  points,
  total_points_earned,
  tier_level,
  role,
  is_active,
  created_at,
  updated_at
)
VALUES (
  'supabase-user-uuid-here',
  'user@example.com',
  'John Doe',
  public.generate_referral_code('supabase-user-uuid-here'::uuid),
  0,
  0,
  1,
  'user'::user_role,
  true,
  now(),
  now()
)
ON CONFLICT(supabase_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  updated_at = now();
*/


-- ============================================================================
-- REFERENCE: SECTION B - Query User Profile
-- ============================================================================

-- Template: Get complete user profile
-- Replace 'user@example.com' with actual email

/*
SELECT 
  id,
  email,
  full_name,
  referral_code,
  points,
  total_points_earned,
  tier_level,
  role,
  profile_image,
  bio,
  kyc_status,
  wallet_address,
  is_active,
  created_at,
  last_login_at
FROM public.users
WHERE email = 'user@example.com';

-- OR get by Supabase ID
SELECT * FROM public.users 
WHERE supabase_id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid;
*/


-- ============================================================================
-- REFERENCE: SECTION C - Award Points (Main Function)
-- ============================================================================

-- Template: Award points with tier multiplier (PostgreSQL syntax)
-- Replace 'user-uuid' with actual UUID
-- This is the CORE function - use for all point rewards

/*
SELECT public.award_points(
  'user-uuid'::uuid,                    -- user_id (PostgreSQL UUID type)
  100,                                  -- base points (before tier multiplier)
  'task_completion'::reward_type,       -- reward type (PostgreSQL enum)
  'Completed task: Follow Twitter',     -- description
  'task-uuid'::uuid                     -- source_id (optional)
);

-- Returns: (transaction_id, new_points, new_tier)
-- Points are auto-multiplied by tier: Tier 3 gets 1.25x multiplier
*/

-- Award for referral signup
/*
SELECT public.award_points(
  'referrer-uuid'::uuid,
  500,
  'referral_sign_up'::reward_type,
  'Referral signup bonus',
  NULL
);
*/

-- Award for game win
/*
SELECT public.award_points(
  'user-uuid'::uuid,
  250,
  'game_winnings'::reward_type,
  'Won quiz game on difficulty: hard',
  'game-session-uuid'::uuid
);
*/


-- ============================================================================
-- REFERENCE: SECTION D - Task Management
-- ============================================================================

-- Template: Create task
/*
INSERT INTO public.tasks (
  title,
  description,
  task_type,
  points_reward,
  is_active,
  max_completions_per_user,
  estimated_duration_minutes,
  metadata
)
VALUES (
  'Verify Email',
  'Verify your email address to unlock rewards',
  'verification'::task_type,
  50,
  true,
  1,
  5,
  '{"requires_proof": false}'::jsonb
);
*/

-- Get all active tasks
/*
SELECT id, title, task_type, points_reward, estimated_duration_minutes
FROM public.tasks
WHERE is_active = true
ORDER BY created_at DESC;
*/

-- Record task completion
/*
INSERT INTO public.task_completions (
  user_id,
  task_id,
  completed_at,
  proof_url,
  verification_status,
  points_awarded,
  notes
)
VALUES (
  'user-uuid'::uuid,
  'task-uuid'::uuid,
  now(),
  'https://example.com/proof.png',
  'pending'::task_verification_status,
  100,
  'Screenshot provided'
)
ON CONFLICT (user_id, task_id) DO UPDATE SET
  verification_status = 'approved'::task_verification_status,
  verified_at = now()
WHERE task_completions.verification_status != 'approved'::task_verification_status;
*/


-- ============================================================================
-- REFERENCE: SECTION E - Game Session Tracking
-- ============================================================================

-- Template: Create game session
/*
INSERT INTO public.game_sessions (
  user_id,
  game_type,
  difficulty,
  started_at,
  completed_at,
  score,
  points_earned,
  metadata
)
VALUES (
  'user-uuid'::uuid,
  'trivia_quiz',
  'hard'::game_difficulty,
  now() - INTERVAL '15 minutes',  -- PostgreSQL interval syntax
  now(),
  950,
  250,
  '{"questions_correct": 19, "total_questions": 20}'::jsonb
);
*/

-- Get game history
/*
SELECT 
  id,
  game_type,
  difficulty,
  score,
  points_earned,
  started_at,
  completed_at
FROM public.game_sessions
WHERE user_id = 'user-uuid'::uuid
ORDER BY started_at DESC
LIMIT 20;
*/


-- ============================================================================
-- REFERENCE: SECTION F - Referral Management
-- ============================================================================

-- Template: Create referral
/*
INSERT INTO public.referrals (
  referrer_id,
  referee_id,
  referral_code,
  referee_email,
  status,
  sign_up_bonus_awarded,
  investment_threshold,
  current_investment,
  reward_points,
  created_at,
  accepted_at,
  completed_at
)
VALUES (
  'referrer-uuid'::uuid,
  'referee-uuid'::uuid,
  'SKYXYZ123ABC',
  'referee@example.com',
  'active'::referral_status,
  true,
  100.00,
  0.00,
  500,
  now(),
  now(),
  NULL
);
*/

-- Get referrer's active referrals
/*
SELECT 
  id,
  referee_email,
  status,
  current_investment,
  reward_points,
  created_at,
  accepted_at
FROM public.referrals
WHERE referrer_id = 'user-uuid'::uuid 
  AND status = 'active'::referral_status
ORDER BY created_at DESC;
*/


-- ============================================================================
-- REFERENCE: SECTION G - Reward Transactions & History
-- ============================================================================

-- Get user's reward history
/*
SELECT 
  id,
  reward_type,
  points_amount,
  description,
  created_at,
  is_processed,
  processed_at
FROM public.reward_transactions
WHERE user_id = 'user-uuid'::uuid
ORDER BY created_at DESC
LIMIT 50;
*/

-- Get this month's earnings
/*
SELECT 
  SUM(points_amount) as total_points_this_month,
  COUNT(*) as total_transactions
FROM public.reward_transactions
WHERE 
  user_id = 'user-uuid'::uuid 
  AND is_processed = true
  AND created_at >= DATE_TRUNC('month', now());  -- PostgreSQL function
*/


-- ============================================================================
-- REFERENCE: SECTION H - Leaderboard Queries
-- ============================================================================

-- Get top 100 users
/*
SELECT 
  rank,
  user_id,
  full_name,
  profile_image,
  points,
  tier_level,
  referral_count
FROM public.leaderboard_view
WHERE rank <= 100
ORDER BY rank;
*/

-- Refresh materialized view (run weekly for performance)
/*
REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_view;
*/


-- ============================================================================
-- REFERENCE: SECTION I - User Statistics & Analytics
-- ============================================================================

-- Get complete user stats
/*
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.points as current_points,
  u.total_points_earned,
  u.tier_level,
  (SELECT COUNT(*) FROM public.task_completions 
   WHERE user_id = u.id AND verification_status = 'approved'::task_verification_status) as completed_tasks,
  (SELECT COUNT(*) FROM public.game_sessions WHERE user_id = u.id) as games_played,
  (SELECT COUNT(*) FROM public.referrals 
   WHERE referrer_id = u.id AND status = 'active'::referral_status) as active_referrals,
  u.created_at,
  u.last_login_at
FROM public.users u
WHERE u.id = 'user-uuid'::uuid;
*/

-- Top earners this month
/*
SELECT 
  u.id,
  u.full_name,
  SUM(rt.points_amount) as points_earned_this_month,
  COUNT(DISTINCT rt.reward_type) as reward_types
FROM public.users u
JOIN public.reward_transactions rt ON u.id = rt.user_id
WHERE rt.created_at >= DATE_TRUNC('month', now()) AND rt.is_processed = true
GROUP BY u.id, u.full_name
ORDER BY points_earned_this_month DESC
LIMIT 20;
*/


-- ============================================================================
-- REFERENCE: SECTION J - Maintenance & Cleanup
-- ============================================================================

-- Find inactive users
/*
SELECT id, email, full_name, last_login_at
FROM public.users
WHERE last_login_at < now() - INTERVAL '3 months' OR last_login_at IS NULL
LIMIT 50;
*/

-- Deactivate inactive users (6+ months)
/*
UPDATE public.users 
SET is_active = false
WHERE last_login_at < now() - INTERVAL '6 months'
RETURNING email, last_login_at;
*/


-- ============================================================================
-- REFERENCE: SECTION K - Performance & Debugging
-- ============================================================================

-- Check RLS policies
/*
SELECT 
  schemaname,
  tablename,
  policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
*/

-- Verify referral code uniqueness
/*
SELECT referral_code, COUNT(*) as count
FROM public.users
GROUP BY referral_code
HAVING COUNT(*) > 1;
*/

-- Monitor database connections
/*
SELECT 
  datname,
  count(*) as connections
FROM pg_stat_activity
GROUP BY datname;
*/


-- ============================================================================
-- END OF REFERENCE GUIDE
-- ============================================================================

/*
NOTES:
- All queries wrapped in /* */ comments to prevent linter errors
- Copy-paste only the SQL between /* and */ into Supabase SQL Editor
- Replace 'user-uuid' with actual UUIDs from your database
- PostgreSQL syntax is NOT compatible with SQL Server (T-SQL)
- For full schema, see: /backend/sql/001_create_skyx_schema.sql
- For detailed guide, see: /SQL_CHEATSHEET.md or /SUPABASE_AUTH_SETUP.md
*/

