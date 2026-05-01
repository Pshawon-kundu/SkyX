# SkyX Supabase SQL Cheatsheet

## Complete SQL Reference for All Operations

---

## 📋 Table of Contents

1. [Setup & Installation](#setup--installation)
2. [User Management](#user-management)
3. [Points & Rewards](#points--rewards)
4. [Tasks & Completions](#tasks--completions)
5. [Game Sessions](#game-sessions)
6. [Referrals](#referrals)
7. [Leaderboard](#leaderboard)
8. [Analytics & Reporting](#analytics--reporting)
9. [Maintenance](#maintenance)

---

## 🚀 Setup & Installation

### Quick Start

```bash
# 1. Go to Supabase Dashboard > SQL Editor
# 2. Paste the migration file: /backend/sql/001_create_skyx_schema.sql
# 3. Execute sections 1-20 in order
# 4. Copy env vars from Supabase > Settings > API

# 5. Start the services
cd backend && docker compose up -d mongodb
npm run dev   # backend on :5000

# In new terminal
npm run dev   # frontend on :5173
```

### Verify Installation

```sql
-- Check all tables created
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should show: users, referrals, tasks, task_completions, game_sessions, reward_transactions

-- Check RLS enabled
SELECT tablename FROM pg_tables
WHERE schemaname = 'public' AND tablename = ANY(ARRAY[
  'users', 'referrals', 'tasks', 'task_completions',
  'game_sessions', 'reward_transactions'
]);
```

---

## 👤 User Management

### Create User (After Supabase Signup)

```sql
INSERT INTO public.users (
  supabase_id,
  email,
  full_name,
  referral_code,
  points,
  total_points_earned,
  tier_level,
  role,
  is_active
)
VALUES (
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,
  'user@example.com',
  'John Doe',
  public.generate_referral_code('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid),
  0,
  0,
  1,
  'user'::user_role,
  true
)
ON CONFLICT(supabase_id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  updated_at = now();
```

### Get User Profile

```sql
-- By email
SELECT id, email, full_name, points, tier_level, referral_code,
       created_at, last_login_at, kyc_status, wallet_address
FROM public.users
WHERE email = 'user@example.com';

-- By Supabase ID
SELECT * FROM public.users WHERE supabase_id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid;

-- By referral code
SELECT * FROM public.users WHERE referral_code = 'SKYXYZ123ABC';
```

### Update User Profile

```sql
UPDATE public.users
SET
  full_name = 'Jane Doe',
  bio = 'New bio here',
  profile_image = 'https://example.com/photo.jpg',
  wallet_address = '0x1234...',
  kyc_status = 'verified'::kyc_status,
  last_login_at = now(),
  updated_at = now()
WHERE email = 'user@example.com';
```

### Get User Tier and Multiplier

```sql
SELECT
  id,
  full_name,
  total_points_earned,
  tier_level,
  public.get_tier_multiplier(tier_level) as points_multiplier
FROM public.users
WHERE email = 'user@example.com';

-- Tier multipliers:
-- Tier 1 (0-999 points): 1.0x
-- Tier 2 (1000-4999 points): 1.1x
-- Tier 3 (5000-14999 points): 1.25x
-- Tier 4 (15000-49999 points): 1.5x
-- Tier 5 (50000+ points): 2.0x
```

### Deactivate User Account

```sql
UPDATE public.users
SET is_active = false, updated_at = now()
WHERE email = 'user@example.com'
RETURNING id, email, is_active;
```

---

## 💰 Points & Rewards

### Award Points (Main Function)

```sql
-- Award points with tier multiplier automatically applied
SELECT public.award_points(
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid,  -- user_id
  100,                                              -- points (base)
  'task_completion'::reward_type,                   -- reward type
  'Completed social share task',                    -- description
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid      -- source_id (optional)
);

-- Returns: transaction_id, new_points, new_tier
-- Points are automatically multiplied by tier multiplier
-- Example: Tier 3 user gets 100 points → 125 points awarded
```

### Award Points Examples by Type

```sql
-- Task completion
SELECT public.award_points(
  'user-id'::uuid, 50, 'task_completion'::reward_type,
  'Verified email'
);

-- Referral signup
SELECT public.award_points(
  'referrer-id'::uuid, 500, 'referral_sign_up'::reward_type,
  'New signup from referral',
  'referral-id'::uuid
);

-- Game winning
SELECT public.award_points(
  'user-id'::uuid, 250, 'game_winnings'::reward_type,
  'Won trivia game - score 950/1000'
);

-- Referral investment reached
SELECT public.award_points(
  'referrer-id'::uuid, 1000, 'referral_investment'::reward_type,
  'Referral investment threshold reached ($100)'
);

-- Milestone bonus
SELECT public.award_points(
  'user-id'::uuid, 2000, 'milestone_bonus'::reward_type,
  'Reached 50,000 total points - Tier 5'
);

-- Leaderboard bonus
SELECT public.award_points(
  'user-id'::uuid, 100, 'leaderboard_bonus'::reward_type,
  'Top 10 leaderboard this week'
);

-- Manual adjustment (admin only)
SELECT public.award_points(
  'user-id'::uuid, -50, 'adjustment'::reward_type,
  'Admin correction for duplicate reward'
);
```

### Get User's Point History

```sql
SELECT
  id,
  reward_type,
  points_amount,
  description,
  created_at,
  is_processed,
  processed_at
FROM public.reward_transactions
WHERE user_id = 'user-id'::uuid AND is_processed = true
ORDER BY created_at DESC
LIMIT 50;
```

### Get Points Earned This Month

```sql
SELECT
  SUM(points_amount) as total_points_this_month,
  COUNT(*) as total_transactions,
  COUNT(DISTINCT reward_type) as reward_types_earned
FROM public.reward_transactions
WHERE
  user_id = 'user-id'::uuid
  AND is_processed = true
  AND created_at >= DATE_TRUNC('month', now());
```

### Get Points Breakdown by Category

```sql
SELECT
  reward_type,
  COUNT(*) as transactions,
  SUM(points_amount) as total_points,
  AVG(points_amount) as avg_per_transaction
FROM public.reward_transactions
WHERE user_id = 'user-id'::uuid AND is_processed = true
GROUP BY reward_type
ORDER BY total_points DESC;
```

### Get Current Points vs Tier

```sql
SELECT
  id,
  email,
  full_name,
  points as current_points,
  total_points_earned,
  tier_level,
  public.calculate_tier_level(total_points_earned) as calculated_tier,
  CASE
    WHEN tier_level = 1 THEN '0 - 999 points'
    WHEN tier_level = 2 THEN '1000 - 4999 points'
    WHEN tier_level = 3 THEN '5000 - 14999 points'
    WHEN tier_level = 4 THEN '15000 - 49999 points'
    WHEN tier_level = 5 THEN '50000+ points'
  END as tier_range
FROM public.users
WHERE email = 'user@example.com';
```

---

## ✅ Tasks & Completions

### Create Task

```sql
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
  'Follow Twitter',
  'Follow @SkyXVentures on X (formerly Twitter)',
  'social_share'::task_type,
  100,
  true,
  1,
  2,
  '{"url": "https://x.com/SkyXVentures", "requires_proof": true}'::jsonb
)
RETURNING id, title, points_reward;
```

### Get All Active Tasks

```sql
SELECT
  id,
  title,
  description,
  task_type,
  points_reward,
  max_completions_per_user,
  estimated_duration_minutes,
  metadata
FROM public.tasks
WHERE is_active = true
ORDER BY created_at DESC;
```

### Get Tasks by Type

```sql
SELECT
  id, title, points_reward, estimated_duration_minutes
FROM public.tasks
WHERE task_type = 'social_share'::task_type AND is_active = true
ORDER BY points_reward DESC;

-- Task types: survey, verification, content_creation, social_share, referral_milestone, staking
```

### Record Task Completion

```sql
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
  'user-id'::uuid,
  'task-id'::uuid,
  now(),
  'https://example.com/screenshot.png',
  'pending'::task_verification_status,
  100,
  'Screenshot submitted for verification'
)
ON CONFLICT (user_id, task_id) DO NOTHING;  -- Prevent duplicates
```

### Get User's Completed Tasks

```sql
SELECT
  tc.id,
  t.title,
  t.task_type,
  tc.completed_at,
  tc.points_awarded,
  tc.verification_status,
  tc.verified_at
FROM public.task_completions tc
JOIN public.tasks t ON t.id = tc.task_id
WHERE tc.user_id = 'user-id'::uuid
ORDER BY tc.completed_at DESC;
```

### Verify Task Completion (Admin)

```sql
UPDATE public.task_completions
SET
  verification_status = 'approved'::task_verification_status,
  verified_by = 'admin-user-id'::uuid,
  verified_at = now()
WHERE id = 'completion-id'::uuid
RETURNING id, verification_status, points_awarded;

-- Then award points to user
SELECT public.award_points(
  'user-id'::uuid,
  (SELECT points_awarded FROM public.task_completions WHERE id = 'completion-id'::uuid),
  'task_completion'::reward_type,
  'Task verified and approved',
  'completion-id'::uuid
);
```

### Reject Task Completion (Admin)

```sql
UPDATE public.task_completions
SET
  verification_status = 'rejected'::task_verification_status,
  verified_by = 'admin-user-id'::uuid,
  verified_at = now(),
  notes = 'Proof does not meet requirements'
WHERE id = 'completion-id'::uuid;
```

### Get Task Statistics

```sql
SELECT
  t.id,
  t.title,
  COUNT(tc.id) as total_completions,
  COUNT(CASE WHEN tc.verification_status = 'approved' THEN 1 END) as approved,
  COUNT(CASE WHEN tc.verification_status = 'pending' THEN 1 END) as pending,
  COUNT(CASE WHEN tc.verification_status = 'rejected' THEN 1 END) as rejected
FROM public.tasks t
LEFT JOIN public.task_completions tc ON t.id = tc.task_id
WHERE t.is_active = true
GROUP BY t.id, t.title
ORDER BY total_completions DESC;
```

---

## 🎮 Game Sessions

### Create Game Session

```sql
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
  'user-id'::uuid,
  'trivia_quiz',
  'hard'::game_difficulty,
  now() - INTERVAL '15 minutes',
  now(),
  950,
  250,
  '{"questions_correct": 19, "total_questions": 20, "duration_seconds": 900}'::jsonb
)
RETURNING id, score, points_earned;
```

### Get User's Game History

```sql
SELECT
  id,
  game_type,
  difficulty,
  score,
  points_earned,
  started_at,
  completed_at,
  (EXTRACT(EPOCH FROM (completed_at - started_at))::int / 60) as duration_minutes
FROM public.game_sessions
WHERE user_id = 'user-id'::uuid AND completed_at IS NOT NULL
ORDER BY started_at DESC
LIMIT 20;
```

### Get Game Statistics

```sql
SELECT
  game_type,
  COUNT(*) as total_games,
  COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completed,
  AVG(score) as avg_score,
  MAX(score) as high_score,
  MIN(score) as low_score,
  SUM(points_earned) as total_points_earned
FROM public.game_sessions
WHERE user_id = 'user-id'::uuid
GROUP BY game_type
ORDER BY total_points_earned DESC;
```

### Get Top Scores by Difficulty

```sql
SELECT
  game_type,
  difficulty,
  MAX(score) as high_score,
  AVG(score) as avg_score,
  COUNT(*) as games_played
FROM public.game_sessions
WHERE user_id = 'user-id'::uuid AND completed_at IS NOT NULL
GROUP BY game_type, difficulty
ORDER BY high_score DESC;
```

---

## 🤝 Referrals

### Create Referral Link

```sql
-- When a user wants to refer someone
INSERT INTO public.referrals (
  referrer_id,
  referral_code,
  status,
  sign_up_bonus_awarded,
  investment_threshold,
  current_investment,
  reward_points
)
VALUES (
  'referrer-id'::uuid,
  (SELECT referral_code FROM public.users WHERE id = 'referrer-id'::uuid),
  'pending'::referral_status,
  false,
  100.00,
  0.00,
  0
)
RETURNING id, referral_code;
```

### Record Referral Signup

```sql
-- When referred user signs up
UPDATE public.referrals
SET
  referee_id = 'referee-id'::uuid,
  referee_email = 'referee@example.com',
  status = 'active'::referral_status,
  accepted_at = now(),
  sign_up_bonus_awarded = true
WHERE referral_code = 'SKYXYZ123ABC'
RETURNING id, referrer_id, referee_id;

-- Award signup bonus to referrer
SELECT public.award_points(
  'referrer-id'::uuid,
  500,
  'referral_sign_up'::reward_type,
  'Referral signup bonus',
  'referral-id'::uuid
);
```

### Get User's Referrals

```sql
SELECT
  id,
  referee_email,
  status,
  current_investment,
  reward_points,
  accepted_at,
  completed_at
FROM public.referrals
WHERE referrer_id = 'user-id'::uuid
ORDER BY created_at DESC;
```

### Get Referral Statistics

```sql
SELECT
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_referrals,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_referrals,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
  SUM(CASE WHEN status IN ('active', 'completed') THEN reward_points ELSE 0 END) as total_reward_points,
  SUM(current_investment) as total_investment_tracked
FROM public.referrals
WHERE referrer_id = 'user-id'::uuid;
```

### Update Investment Progress

```sql
UPDATE public.referrals
SET current_investment = 50.00
WHERE id = 'referral-id'::uuid;

-- Complete referral if investment reached threshold
UPDATE public.referrals
SET
  status = 'completed'::referral_status,
  completed_at = now()
WHERE
  id = 'referral-id'::uuid
  AND current_investment >= investment_threshold;

-- Award investment bonus
SELECT public.award_points(
  'referrer-id'::uuid,
  1000,
  'referral_investment'::reward_type,
  'Referral investment threshold reached ($100)',
  'referral-id'::uuid
);
```

---

## 🏆 Leaderboard

### Refresh Leaderboard (Run Weekly)

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_view;
```

### Get Top 100 Users

```sql
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
```

### Get User's Leaderboard Position

```sql
SELECT
  rank,
  user_id,
  full_name,
  profile_image,
  points,
  tier_level,
  referral_count
FROM public.leaderboard_view
WHERE user_id = 'user-id'::uuid;
```

### Get Leaderboard Context (User + Neighbors)

```sql
WITH user_rank AS (
  SELECT rank FROM public.leaderboard_view WHERE user_id = 'user-id'::uuid
)
SELECT
  lv.rank,
  lv.user_id,
  lv.full_name,
  lv.points,
  lv.tier_level,
  CASE
    WHEN lv.rank <= 10 THEN '🥇 Top 10'
    WHEN lv.rank <= 50 THEN '🥈 Top 50'
    WHEN lv.rank <= 100 THEN '🥉 Top 100'
    ELSE 'Outside Top 100'
  END as badge,
  (SELECT rank FROM user_rank) as your_rank
FROM public.leaderboard_view lv, user_rank
WHERE lv.rank BETWEEN GREATEST(1, (user_rank.rank - 5)) AND (user_rank.rank + 5)
ORDER BY lv.rank;
```

### Get Leaderboard by Tier

```sql
SELECT
  rank,
  full_name,
  points,
  referral_count
FROM public.leaderboard_view
WHERE tier_level = 3
ORDER BY rank
LIMIT 50;
```

### Get Weekly Leaderboard (Top Earners)

```sql
SELECT
  u.id as user_id,
  u.full_name,
  SUM(rt.points_amount) as points_earned_this_week,
  COUNT(DISTINCT rt.reward_type) as reward_types,
  ROW_NUMBER() OVER (ORDER BY SUM(rt.points_amount) DESC) as weekly_rank
FROM public.users u
JOIN public.reward_transactions rt ON u.id = rt.user_id
WHERE
  rt.created_at >= now() - INTERVAL '7 days'
  AND rt.is_processed = true
GROUP BY u.id, u.full_name
ORDER BY points_earned_this_week DESC
LIMIT 20;
```

---

## 📊 Analytics & Reporting

### User Registration Trends

```sql
SELECT
  DATE(created_at) as signup_date,
  COUNT(*) as new_users,
  SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as cumulative_users
FROM public.users
WHERE created_at >= now() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY signup_date DESC;
```

### Active Users

```sql
-- Daily active users
SELECT
  DATE(last_login_at) as active_date,
  COUNT(DISTINCT id) as active_users
FROM public.users
WHERE last_login_at >= now() - INTERVAL '30 days'
GROUP BY DATE(last_login_at)
ORDER BY active_date DESC;

-- This month's active users
SELECT COUNT(DISTINCT id) as active_users_this_month
FROM public.users
WHERE last_login_at >= DATE_TRUNC('month', now());
```

### Points Distribution

```sql
SELECT
  tier_level,
  COUNT(*) as user_count,
  AVG(points) as avg_current_points,
  AVG(total_points_earned) as avg_lifetime_points,
  MIN(points) as min_points,
  MAX(points) as max_points
FROM public.users
WHERE is_active = true
GROUP BY tier_level
ORDER BY tier_level;
```

### Engagement Metrics

```sql
SELECT
  COUNT(DISTINCT u.id) as total_users,
  COUNT(DISTINCT CASE WHEN u.last_login_at > now() - INTERVAL '7 days' THEN u.id END) as active_this_week,
  COUNT(DISTINCT tc.user_id) as users_completed_tasks,
  COUNT(DISTINCT gs.user_id) as users_played_games,
  COUNT(DISTINCT r.referrer_id) as users_with_referrals
FROM public.users u
LEFT JOIN public.task_completions tc ON u.id = tc.user_id AND tc.verification_status = 'approved'
LEFT JOIN public.game_sessions gs ON u.id = gs.user_id
LEFT JOIN public.referrals r ON u.id = r.referrer_id AND r.status = 'active';
```

### Revenue from Referrals

```sql
SELECT
  SUM(r.reward_points) as total_referral_rewards_paid,
  COUNT(CASE WHEN r.status = 'active' THEN 1 END) as active_referrals,
  COUNT(CASE WHEN r.status = 'completed' THEN 1 END) as completed_referrals,
  AVG(r.current_investment) as avg_investment_per_referral
FROM public.referrals r;
```

### Top Tasks by Engagement

```sql
SELECT
  t.id,
  t.title,
  t.points_reward,
  COUNT(tc.id) as total_completions,
  COUNT(CASE WHEN tc.verification_status = 'approved' THEN 1 END) as approved,
  ROUND(100.0 * COUNT(CASE WHEN tc.verification_status = 'approved' THEN 1 END) /
        NULLIF(COUNT(tc.id), 0), 2) as approval_rate
FROM public.tasks t
LEFT JOIN public.task_completions tc ON t.id = tc.task_id
WHERE t.is_active = true
GROUP BY t.id, t.title, t.points_reward
ORDER BY total_completions DESC
LIMIT 20;
```

---

## 🔧 Maintenance

### Find Inactive Users (3+ months)

```sql
SELECT id, email, full_name, last_login_at
FROM public.users
WHERE last_login_at < now() - INTERVAL '3 months' OR last_login_at IS NULL
LIMIT 50;
```

### Deactivate Inactive Users (6+ months)

```sql
UPDATE public.users
SET is_active = false, updated_at = now()
WHERE last_login_at < now() - INTERVAL '6 months'
RETURNING email, is_active;
```

### Find Duplicate Referral Codes

```sql
SELECT referral_code, COUNT(*) as count
FROM public.users
GROUP BY referral_code
HAVING COUNT(*) > 1;
```

### Find Orphaned Records

```sql
-- Orphaned task completions
SELECT tc.id, tc.user_id, tc.task_id
FROM public.task_completions tc
LEFT JOIN public.users u ON tc.user_id = u.id
LEFT JOIN public.tasks t ON tc.task_id = t.id
WHERE u.id IS NULL OR t.id IS NULL;
```

### Database Health Check

```sql
-- Table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT
  indexrelname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Vacuum & Analyze

```sql
-- Run maintenance on tables
VACUUM ANALYZE public.users;
VACUUM ANALYZE public.reward_transactions;
VACUUM ANALYZE public.task_completions;
VACUUM ANALYZE public.game_sessions;
```

---

## 🔐 Security Notes

- **Anon Key**: Used on frontend for public operations
- **Service Role Key**: Backend only, never expose to client
- **RLS Enabled**: All tables enforce Row Level Security
- **User isolation**: Users can only see/modify their own data
- **Audit Trail**: All reward transactions logged with timestamp

---

## 📞 Support

For issues:

1. Check [`/backend/sql/002_queries_reference.sql`](/backend/sql/002_queries_reference.sql) for debugging queries
2. Verify RLS policies: `SELECT * FROM pg_policies WHERE schemaname = 'public';`
3. Check function execution: `SELECT * FROM pg_proc WHERE proname LIKE '%award%';`
4. Monitor connections: `SELECT * FROM pg_stat_activity;`
