# 📚 All SQL Queries Created for SkyX Supabase Setup

## Files Created

### 1. **[`/backend/sql/001_create_skyx_schema.sql`](/backend/sql/001_create_skyx_schema.sql)** ⭐ START HERE

- **Purpose**: Complete PostgreSQL schema migration for Supabase
- **Sections** (apply in order 1-20):
  - Section 1: Enable extensions (UUID, pgcrypto)
  - Section 2: Create enum types for PostgreSQL safety
  - Section 3: Users table (linked to Supabase Auth)
  - Section 4: Referrals table
  - Section 5: Tasks table
  - Section 6: Task completions table
  - Section 7: Game sessions table
  - Section 8: Reward transactions table
  - Section 9: Materialized view for leaderboard
  - Section 10: Stored functions for business logic
  - Section 11-18: Row Level Security (RLS) policies
  - Section 19: Sample data (optional)
  - Section 20: Helper functions
- **Total Tables**: 6 (users, referrals, tasks, task_completions, game_sessions, reward_transactions)
- **Indexes**: 20+ for performance optimization
- **Functions**: 3 (calculate_tier_level, get_tier_multiplier, award_points)

### 2. **[`/backend/sql/002_queries_reference.sql`](/backend/sql/002_queries_reference.sql)** - Query Cheatsheet

- **Purpose**: All SQL operations for common tasks
- **Sections** (A-M):
  - A: Create new user (from Supabase Auth)
  - B: Query user profile
  - C: Award points & create transactions
  - D: Task management
  - E: Game session tracking
  - F: Referral management
  - G: Reward transactions & history
  - H: Leaderboard queries
  - I: User statistics & analytics
  - J: Maintenance & cleanup
  - K: Performance optimization
  - L: Disaster recovery & backups
  - M: Debugging & troubleshooting

### 3. **[`/SQL_CHEATSHEET.md`](/SQL_CHEATSHEET.md)** - Easy Reference

- **Purpose**: Markdown cheatsheet with organized SQL examples
- **Sections**: 9 main categories with copy-paste SQL blocks
- **Includes**: Quick setup guide, verification steps, all CRUD operations

---

## SQL Query Categories

### 👤 User Management

- `INSERT INTO users` - Create new user after Supabase signup
- `SELECT * FROM users WHERE email = ?` - Get user profile
- `UPDATE users SET ...` - Update profile info
- `SELECT public.calculate_tier_level()` - Get tier based on points
- `UPDATE users SET is_active = false` - Deactivate account

### 💰 Points & Rewards (Most Important!)

```sql
SELECT public.award_points(
  'user-uuid'::uuid,
  100,                        -- points (base)
  'task_completion'::reward_type,
  'Description',
  'source-id'::uuid
);
```

- Automatically applies tier multiplier
- Creates transaction record
- Updates user tier if needed
- Supports all reward types

### ✅ Task Management

- Create tasks with different types
- Record task completions
- Verify/reject completions (admin)
- Get task statistics
- Track completion history

### 🎮 Game Sessions

- Create game sessions with scores
- Track game history per user
- Get game statistics and high scores
- Query by difficulty level

### 🤝 Referrals

- Create referral links
- Record referral signups
- Track investment progress
- Query referral statistics

### 🏆 Leaderboard

- Get top 100 users
- Find user's position and ranking
- Get context (user + neighbors)
- Filter by tier
- Get weekly top earners

### 📊 Analytics

- User registration trends
- Active users count
- Points distribution by tier
- Engagement metrics
- Revenue from referrals

---

## Reward Types (Use in award_points)

```sql
'task_completion'::reward_type           -- User completed task
'game_winnings'::reward_type            -- User won game
'referral_sign_up'::reward_type         -- Referral signed up
'referral_investment'::reward_type      -- Referral reached investment
'milestone_bonus'::reward_type          -- Reached tier/milestone
'leaderboard_bonus'::reward_type        -- Top 10/50/100 bonus
'adjustment'::reward_type               -- Admin adjustment
```

---

## Task Types (Use in tasks table)

```sql
'survey'::task_type                  -- Survey completion
'verification'::task_type           -- Verify email/KYC
'content_creation'::task_type       -- Create content
'social_share'::task_type           -- Share on social media
'referral_milestone'::task_type     -- Referral milestones
'staking'::task_type                -- Staking requirements
```

---

## Key Functions

### 1. `calculate_tier_level(total_points)`

Returns tier (1-5) based on total points earned

```sql
SELECT public.calculate_tier_level(10000);  -- Returns 4
```

### 2. `get_tier_multiplier(tier)`

Returns points multiplier for tier

```sql
SELECT public.get_tier_multiplier(3);  -- Returns 1.25
```

### 3. `award_points()` ⭐ MAIN FUNCTION

Awards points with automatic tier multiplier, updates user, creates transaction

```sql
SELECT public.award_points(
  'user-id'::uuid,
  100,
  'task_completion'::reward_type,
  'Task completed',
  'task-id'::uuid
);
-- Returns: (transaction_id, new_points, new_tier)
```

### 4. `generate_referral_code(supabase_id)`

Generates unique referral code from Supabase ID

```sql
SELECT public.generate_referral_code('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'::uuid);
```

---

## Tier System

| Tier | Points Range    | Multiplier | Badge       |
| ---- | --------------- | ---------- | ----------- |
| 1    | 0 - 999         | 1.0x       | 🔰 Starter  |
| 2    | 1,000 - 4,999   | 1.1x       | 🥈 Silver   |
| 3    | 5,000 - 14,999  | 1.25x      | 🥇 Gold     |
| 4    | 15,000 - 49,999 | 1.5x       | 💎 Diamond  |
| 5    | 50,000+         | 2.0x       | 👑 Platinum |

---

## Row Level Security (RLS) Policies

All tables have RLS enabled:

- **Users table**: Public profiles, users can update own profile
- **Tasks table**: Public for active tasks, admins can manage
- **Task Completions**: Users see own, admins see all
- **Game Sessions**: Users see own, can create/update own
- **Reward Transactions**: Users see own, backend can insert
- **Referrals**: Users see own referrals

To verify RLS is working:

```sql
SELECT tablename FROM pg_tables
WHERE schemaname = 'public';

SELECT * FROM pg_policies WHERE schemaname = 'public';
```

---

## Quick Copy-Paste Examples

### Award Points for Task Completion

```sql
SELECT public.award_points(
  'user-uuid'::uuid,
  (SELECT points_reward FROM public.tasks WHERE id = 'task-uuid'::uuid),
  'task_completion'::reward_type,
  'Task completed: ' || (SELECT title FROM public.tasks WHERE id = 'task-uuid'::uuid),
  'task-uuid'::uuid
);
```

### Award Referral Bonus

```sql
SELECT public.award_points(
  'referrer-id'::uuid,
  500,
  'referral_sign_up'::reward_type,
  'New signup: ' || 'new-user-email',
  'referral-id'::uuid
);
```

### Award Game Winnings

```sql
SELECT public.award_points(
  'user-id'::uuid,
  250,
  'game_winnings'::reward_type,
  'Won trivia game - score 950/1000',
  'game-session-id'::uuid
);
```

### Get Top 100 Leaderboard

```sql
SELECT rank, user_id, full_name, points, tier_level, referral_count
FROM public.leaderboard_view
WHERE rank <= 100
ORDER BY rank;
```

### Get Monthly Points

```sql
SELECT
  SUM(points_amount) as total_this_month,
  COUNT(*) as transactions
FROM public.reward_transactions
WHERE user_id = 'user-uuid'::uuid
  AND is_processed = true
  AND created_at >= DATE_TRUNC('month', now());
```

---

## Setup Instructions

### Step 1: Apply Schema Migration

```sql
-- Go to Supabase Dashboard > SQL Editor
-- Copy entire content from: /backend/sql/001_create_skyx_schema.sql
-- Execute sections 1-20 in order
```

### Step 2: Get Environment Variables

```bash
# Go to Supabase Dashboard > Settings > API

# Copy to root .env:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Copy to backend/.env:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Start Services

```bash
# Terminal 1: Start MongoDB
cd backend && docker compose up -d mongodb

# Terminal 2: Start Backend
cd backend && npm run dev  # http://localhost:5000

# Terminal 3: Start Frontend
npm run dev  # http://localhost:5173
```

### Step 4: Test Login

- Go to http://localhost:5173
- Try email/password signup or OAuth login
- User should appear in Supabase Auth
- Check if user created in PostgreSQL: `SELECT * FROM public.users;`

---

## Common Issues & Fixes

### ❌ "Supabase is not configured"

**Fix**: Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in root .env

### ❌ "RLS policy missing"

**Fix**: Run schema migration section 11-18 to enable policies

### ❌ "Referral code not unique"

**Fix**: Run: `SELECT public.generate_referral_code('user-supabase-id'::uuid);`

### ❌ "Points not awarding"

**Fix**: Check if user tier > 1, verify award_points() function exists

### ❌ Leaderboard empty

**Fix**: Run: `REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_view;`

---

## Files Reference

| File                                                                  | Purpose               | When to Use             |
| --------------------------------------------------------------------- | --------------------- | ----------------------- |
| [001_create_skyx_schema.sql](/backend/sql/001_create_skyx_schema.sql) | Complete schema       | Setup (one-time)        |
| [002_queries_reference.sql](/backend/sql/002_queries_reference.sql)   | SQL examples          | Development & debugging |
| [SQL_CHEATSHEET.md](/SQL_CHEATSHEET.md)                               | Easy reference        | Quick lookup            |
| [SUPABASE_AUTH_SETUP.md](/SUPABASE_AUTH_SETUP.md)                     | Authentication guide  | Setup Supabase Auth     |
| [.env.example](/.env.example)                                         | Frontend env template | Copy to .env            |
| [backend/.env.example](/backend/.env.example)                         | Backend env template  | Copy to .env            |

---

## Next Steps

1. ✅ Run schema migration (001_create_skyx_schema.sql)
2. ✅ Set up environment variables
3. ✅ Start MongoDB, backend, and frontend
4. ✅ Test user signup/login
5. ✅ Test point awards with `award_points()` function
6. ✅ Verify leaderboard shows users
7. 📌 Monitor database with queries from 002_queries_reference.sql
8. 📌 Set up automated backups in Supabase
9. 📌 Configure RLS policies for production

---

**Created**: May 1, 2026
**Status**: Ready for production deployment
**Support**: See SQL_CHEATSHEET.md or 002_queries_reference.sql section M for debugging
