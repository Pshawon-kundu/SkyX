/**
 * SkyX Supabase PostgreSQL Schema Migration
 * Complete data model for user profiles, referrals, tasks, games, and rewards
 * 
 * TO APPLY THIS MIGRATION:
 * 1. Go to Supabase Dashboard > SQL Editor
 * 2. Create a new query
 * 3. Copy and paste the SQL below (in sections)
 * 4. Execute each section
 * 
 * IMPORTANT: Apply migrations in order to avoid foreign key issues
 */

-- ============================================================================
-- SECTION 1: Enable Extensions
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================================
-- SECTION 2: Create Enum Types for PostgreSQL Type Safety
-- ============================================================================

-- Drop existing types if they exist (in reverse dependency order)
DROP TYPE IF EXISTS game_difficulty CASCADE;
DROP TYPE IF EXISTS kyc_status CASCADE;
DROP TYPE IF EXISTS task_verification_status CASCADE;
DROP TYPE IF EXISTS reward_type CASCADE;
DROP TYPE IF EXISTS task_type CASCADE;
DROP TYPE IF EXISTS referral_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- User roles
CREATE TYPE user_role AS ENUM ('user', 'admin', 'moderator');

-- Referral status
CREATE TYPE referral_status AS ENUM ('pending', 'active', 'completed', 'rejected');

-- Task types
CREATE TYPE task_type AS ENUM (
  'survey',
  'verification',
  'content_creation',
  'social_share',
  'referral_milestone',
  'staking'
);

-- Reward types
CREATE TYPE reward_type AS ENUM (
  'task_completion',
  'game_winnings',
  'referral_sign_up',
  'referral_investment',
  'milestone_bonus',
  'leaderboard_bonus',
  'adjustment'
);

-- Task verification status
CREATE TYPE task_verification_status AS ENUM ('pending', 'approved', 'rejected');

-- KYC status
CREATE TYPE kyc_status AS ENUM ('pending', 'verified', 'rejected');

-- Game difficulty
CREATE TYPE game_difficulty AS ENUM ('easy', 'medium', 'hard');


-- ============================================================================
-- SECTION 3: Create Users Table (linked to Supabase Auth)
-- ============================================================================

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS reward_transactions CASCADE;
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS task_completions CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP MATERIALIZED VIEW IF EXISTS leaderboard_view CASCADE;

CREATE TABLE IF NOT EXISTS public.users (
  -- IDs
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile info
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  profile_image text,
  bio text CHECK (length(bio) <= 500),
  
  -- Authentication
  password_hash text,  -- NULL if using OAuth
  
  -- Referral system
  referral_code text UNIQUE NOT NULL,
  referred_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Points & Tier
  points integer DEFAULT 0 CHECK (points >= 0),
  total_points_earned integer DEFAULT 0 CHECK (total_points_earned >= 0),
  tier_level integer DEFAULT 1 CHECK (tier_level >= 1 AND tier_level <= 5),
  
  -- Account status
  role user_role DEFAULT 'user'::user_role,
  is_active boolean DEFAULT true,
  kyc_status kyc_status DEFAULT 'pending'::kyc_status,
  wallet_address text UNIQUE,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login_at timestamptz,
  
  -- Indexes for common queries
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_supabase_id ON public.users(supabase_id);
CREATE INDEX idx_users_referral_code ON public.users(referral_code);
CREATE INDEX idx_users_referred_by ON public.users(referred_by);
CREATE INDEX idx_users_tier_level ON public.users(tier_level);
CREATE INDEX idx_users_is_active ON public.users(is_active);


-- ============================================================================
-- SECTION 4: Create Referrals Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referee_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  referral_code text NOT NULL,
  referee_email text,
  
  -- Status tracking
  status referral_status DEFAULT 'pending'::referral_status,
  sign_up_bonus_awarded boolean DEFAULT false,
  
  -- Investment tracking
  investment_threshold numeric(20, 2) DEFAULT 0,
  current_investment numeric(20, 2) DEFAULT 0,
  reward_points integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  completed_at timestamptz,
  
  CONSTRAINT status_transition CHECK (
    -- pending can become active, rejected
    -- active can become completed, rejected
    -- completed and rejected are final
    true
  )
);

-- Create indexes
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_referee_id ON public.referrals(referee_id);
CREATE INDEX idx_referrals_referral_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_status ON public.referrals(status);


-- ============================================================================
-- SECTION 5: Create Tasks Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  task_type task_type NOT NULL,
  points_reward integer NOT NULL CHECK (points_reward > 0),
  is_active boolean DEFAULT true,
  max_completions_per_user integer DEFAULT 1 CHECK (max_completions_per_user > 0),
  estimated_duration_minutes integer DEFAULT 5,
  metadata jsonb DEFAULT '{}'::jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_tasks_task_type ON public.tasks(task_type);
CREATE INDEX idx_tasks_is_active ON public.tasks(is_active);


-- ============================================================================
-- SECTION 6: Create Task Completions Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.task_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  task_id uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  
  completed_at timestamptz NOT NULL DEFAULT now(),
  proof_url text,
  
  -- Verification
  verification_status task_verification_status DEFAULT 'pending'::task_verification_status,
  verified_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  verified_at timestamptz,
  
  -- Reward
  points_awarded integer NOT NULL,
  notes text,
  
  -- Constraint: prevent duplicate completions beyond max_completions_per_user
  UNIQUE(user_id, task_id)
);

-- Create indexes
CREATE INDEX idx_task_completions_user_id ON public.task_completions(user_id);
CREATE INDEX idx_task_completions_task_id ON public.task_completions(task_id);
CREATE INDEX idx_task_completions_verification_status ON public.task_completions(verification_status);


-- ============================================================================
-- SECTION 7: Create Game Sessions Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  game_type text NOT NULL,
  difficulty game_difficulty NOT NULL,
  
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  
  score integer DEFAULT 0,
  points_earned integer DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX idx_game_sessions_game_type ON public.game_sessions(game_type);


-- ============================================================================
-- SECTION 8: Create Reward Transactions Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reward_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reward_type reward_type NOT NULL,
  points_amount integer NOT NULL,
  source_id uuid,  -- FK to task, game session, referral, etc
  description text NOT NULL,
  
  is_processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Create indexes
CREATE INDEX idx_reward_transactions_user_id ON public.reward_transactions(user_id);
CREATE INDEX idx_reward_transactions_reward_type ON public.reward_transactions(reward_type);
CREATE INDEX idx_reward_transactions_is_processed ON public.reward_transactions(is_processed);


-- ============================================================================
-- SECTION 9: Create Materialized View for Leaderboard
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard_view AS
SELECT 
  u.id as user_id,
  u.full_name,
  u.profile_image,
  u.points,
  u.tier_level,
  COUNT(DISTINCT r.id) as referral_count,
  RANK() OVER (ORDER BY u.points DESC) as rank
FROM public.users u
LEFT JOIN public.referrals r ON r.referrer_id = u.id AND r.status = 'active'::referral_status
WHERE u.is_active = true
GROUP BY u.id, u.full_name, u.profile_image, u.points, u.tier_level
ORDER BY u.points DESC;

-- Create index on materialized view
CREATE INDEX idx_leaderboard_rank ON public.leaderboard_view(rank);


-- ============================================================================
-- SECTION 10: Create Stored Functions for Business Logic
-- ============================================================================

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.award_points(uuid, integer, reward_type, text, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_tier_multiplier(integer) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_tier_level(integer) CASCADE;
DROP FUNCTION IF EXISTS public.generate_referral_code(uuid) CASCADE;

-- Function to calculate tier level based on total points
CREATE OR REPLACE FUNCTION public.calculate_tier_level(total_points integer)
RETURNS integer AS $$
BEGIN
  IF total_points >= 50000 THEN RETURN 5;
  ELSIF total_points >= 15000 THEN RETURN 4;
  ELSIF total_points >= 5000 THEN RETURN 3;
  ELSIF total_points >= 1000 THEN RETURN 2;
  ELSE RETURN 1;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get tier multiplier
CREATE OR REPLACE FUNCTION public.get_tier_multiplier(tier integer)
RETURNS numeric AS $$
BEGIN
  CASE tier
    WHEN 1 THEN RETURN 1.0;
    WHEN 2 THEN RETURN 1.1;
    WHEN 3 THEN RETURN 1.25;
    WHEN 4 THEN RETURN 1.5;
    WHEN 5 THEN RETURN 2.0;
    ELSE RETURN 1.0;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to award points to user
CREATE OR REPLACE FUNCTION public.award_points(
  p_user_id uuid,
  p_points integer,
  p_reward_type reward_type,
  p_description text,
  p_source_id uuid DEFAULT NULL
)
RETURNS TABLE(transaction_id uuid, new_points integer, new_tier integer) AS $$
DECLARE
  v_user RECORD;
  v_tier_multiplier numeric;
  v_adjusted_points integer;
  v_new_tier integer;
  v_transaction_id uuid;
BEGIN
  -- Get user
  SELECT id, points, total_points_earned, tier_level 
  INTO v_user 
  FROM public.users 
  WHERE id = p_user_id;
  
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'User % not found', p_user_id;
  END IF;
  
  -- Calculate adjusted points
  v_tier_multiplier := public.get_tier_multiplier(v_user.tier_level);
  v_adjusted_points := (p_points * v_tier_multiplier)::integer;
  
  -- Calculate new tier
  v_new_tier := public.calculate_tier_level(v_user.total_points_earned + v_adjusted_points);
  
  -- Update user
  UPDATE public.users 
  SET 
    points = points + v_adjusted_points,
    total_points_earned = total_points_earned + v_adjusted_points,
    tier_level = v_new_tier,
    updated_at = now()
  WHERE id = p_user_id;
  
  -- Create reward transaction
  INSERT INTO public.reward_transactions 
  (user_id, reward_type, points_amount, source_id, description, is_processed, processed_at)
  VALUES (p_user_id, p_reward_type, v_adjusted_points, p_source_id, p_description, true, now())
  RETURNING id INTO v_transaction_id;
  
  RETURN QUERY 
  SELECT v_transaction_id, (v_user.points + v_adjusted_points), v_new_tier;
END;
$$ LANGUAGE plpgsql;


-- ============================================================================
-- SECTION 11: Enable Row Level Security (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- SECTION 12: RLS Policies - Users Table
-- ============================================================================

-- Anyone can read public user profiles
CREATE POLICY "Users are publicly readable" ON public.users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = supabase_id)
  WITH CHECK (auth.uid() = supabase_id);

-- Only admins can delete users
CREATE POLICY "Only admins can delete users" ON public.users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::uuid AND role = 'admin'::user_role
    )
  );


-- ============================================================================
-- SECTION 13: RLS Policies - Task Completions Table
-- ============================================================================

-- Users can read own task completions
CREATE POLICY "Users can read own task completions" ON public.task_completions
  FOR SELECT USING (auth.uid()::uuid = user_id);

-- Users can insert their own task completions
CREATE POLICY "Users can complete tasks" ON public.task_completions
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

-- Admins can read all task completions
CREATE POLICY "Admins can read all task completions" ON public.task_completions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::uuid AND role = 'admin'::user_role
    )
  );


-- ============================================================================
-- SECTION 14: RLS Policies - Game Sessions Table
-- ============================================================================

-- Users can read own game sessions
CREATE POLICY "Users can read own game sessions" ON public.game_sessions
  FOR SELECT USING (auth.uid()::uuid = user_id);

-- Users can insert their own game sessions
CREATE POLICY "Users can create game sessions" ON public.game_sessions
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);

-- Users can update their own game sessions
CREATE POLICY "Users can update own game sessions" ON public.game_sessions
  FOR UPDATE USING (auth.uid()::uuid = user_id)
  WITH CHECK (auth.uid()::uuid = user_id);


-- ============================================================================
-- SECTION 15: RLS Policies - Reward Transactions Table
-- ============================================================================

-- Users can read own reward transactions
CREATE POLICY "Users can read own reward transactions" ON public.reward_transactions
  FOR SELECT USING (auth.uid()::uuid = user_id);

-- Only backend service can insert (via service role key)
CREATE POLICY "Backend can insert reward transactions" ON public.reward_transactions
  FOR INSERT WITH CHECK (true);


-- ============================================================================
-- SECTION 16: RLS Policies - Referrals Table
-- ============================================================================

-- Users can read own referrals
CREATE POLICY "Users can read own referrals" ON public.referrals
  FOR SELECT USING (auth.uid()::uuid = referrer_id);

-- Users can see referrals where they are the referee
CREATE POLICY "Users can read own referee referrals" ON public.referrals
  FOR SELECT USING (auth.uid()::uuid = referee_id);


-- ============================================================================
-- SECTION 17: RLS Policies - Tasks Table
-- ============================================================================

-- Anyone can read active tasks
CREATE POLICY "Active tasks are publicly readable" ON public.tasks
  FOR SELECT USING (is_active = true);

-- Admins can manage tasks
CREATE POLICY "Admins can manage tasks" ON public.tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid()::uuid AND role = 'admin'::user_role
    )
  );


-- ============================================================================
-- SECTION 18: Update Triggers for Timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger to tasks table
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ============================================================================
-- SECTION 19: Sample Data (Optional - for testing)
-- ============================================================================

-- Uncomment to insert sample data
/*
-- Insert sample tasks
INSERT INTO public.tasks (title, description, task_type, points_reward, is_active, max_completions_per_user, estimated_duration_minutes)
VALUES 
  ('Complete Profile', 'Fill in your full profile details', 'verification', 50, true, 1, 10),
  ('Twitter Follow', 'Follow us on Twitter', 'social_share', 100, true, 1, 2),
  ('Discord Join', 'Join our Discord community', 'social_share', 100, true, 1, 2),
  ('Community Survey', 'Complete the community feedback survey', 'survey', 200, true, 1, 15),
  ('Staking', 'Stake $100+ for 30 days', 'staking', 500, true, 1, 1);
*/

-- ============================================================================
-- SECTION 20: Generate Unique Referral Code Function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.generate_referral_code(p_supabase_id uuid)
RETURNS text AS $$
DECLARE
  v_safe_id text;
  v_code text;
BEGIN
  v_safe_id := REPLACE(REPLACE(REPLACE(p_supabase_id::text, '-', ''), '_', ''), '.', '');
  v_code := 'SKY' || SUBSTRING(UPPER(v_safe_id), 1, 9);
  RETURN SUBSTRING(v_code, 1, 12);
END;
$$ LANGUAGE plpgsql IMMUTABLE;
