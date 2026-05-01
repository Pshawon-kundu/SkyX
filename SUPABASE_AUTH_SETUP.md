# SkyX Supabase Authentication Setup Guide

## Overview

The app now uses **Supabase** for authentication with email/password, Google, and X (Twitter) login. User profiles sync with MongoDB via the `/api/users/sync-profile` endpoint.

## Data Location

Supabase is currently used for auth only. New signups appear in the Supabase Auth users dashboard.

SkyX profile data, points, referrals, tasks, task completions, game sessions, and reward transactions are stored in MongoDB. These records will not appear as Supabase table rows unless the app is migrated from MongoDB to Supabase Postgres.

## Environment Variables

### Frontend (`.env`)

```env
VITE_SUPABASE_URL=https://iblmaweycrpqwozjurhv.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (`.env`)

```env
SUPABASE_URL=https://iblmaweycrpqwozjurhv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=dev_secret_key_skyx_2024
JWT_EXPIRES_IN=24h
MONGODB_URI=mongodb://localhost:27017/skyx
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Running the Application

### 1. Start MongoDB (if available locally)

```bash
cd backend
docker compose up -d mongodb
```

### 2. Start Backend Server

```bash
cd backend
npm run dev
```

- Backend runs on `http://localhost:5000`
- API endpoint: `/api/users/sync-profile` (POST)

### 3. Start Frontend Server (in a new terminal)

```bash
npm run dev
```

- Frontend runs on `http://localhost:5173`

## Authentication Flow

### Email/Password Signup

1. User fills in full name, email, password
2. Frontend calls `supabase.auth.signUp()` with Supabase
3. On successful signup, frontend calls `/api/users/sync-profile` with Supabase token
4. Backend verifies token, creates/updates user in MongoDB, returns JWT
5. Frontend stores JWT + user in localStorage, redirects to home

### Email/Password Login

1. User enters email and password
2. Frontend calls `supabase.auth.signInWithPassword()`
3. On success, frontend calls `/api/users/sync-profile` with Supabase token
4. Backend verifies token, syncs user, returns JWT
5. Frontend stores JWT + user in localStorage, redirects to home

### Google/X OAuth

1. User clicks "Continue with Google" or "Continue with X"
2. Frontend calls `supabase.auth.signInWithOAuth()` with provider
3. Supabase redirects to OAuth provider login
4. After user logs in, Supabase redirects back to `/login`
5. Auth state change listener triggers `syncProfile()` automatically
6. Backend syncs profile and returns JWT
7. Frontend redirects to home

## Key Endpoints

### POST `/api/users/sync-profile`

Syncs user profile from Supabase into MongoDB after OAuth/email signup.

**Request:**

```json
{
  "supabaseToken": "jwt_access_token_from_supabase",
  "fullName": "John Doe"
}
```

**Response:**

```json
{
  "token": "jwt_token_for_api",
  "user": {
    "id": "mongodb_user_id",
    "email": "john@example.com",
    "fullName": "John Doe",
    "referralCode": "SKYXXX",
    "points": 0,
    "tierLevel": 1,
    "createdAt": "2026-05-01T10:00:00Z",
    "lastLoginAt": "2026-05-01T10:00:00Z"
  }
}
```

## Database Schema Updates

### MongoDB Users Collection (Current Setup)

New field added:

```typescript
supabaseId?: string  // Unique Supabase user ID, indexed
```

This field links MongoDB users to Supabase auth accounts.

## Optional: Migrate to Supabase PostgreSQL

To move from MongoDB to Supabase Postgres for complete data management:

### 1. Apply PostgreSQL Schema Migration

1. Go to **Supabase Dashboard** > **SQL Editor**
2. Create a new query
3. Copy the complete schema from [`/backend/sql/001_create_skyx_schema.sql`](/backend/sql/001_create_skyx_schema.sql)
4. **Important**: Execute in sections (numbered 1-20) to avoid conflicts
5. Verify all tables created: `public.users`, `public.referrals`, `public.tasks`, `public.task_completions`, `public.game_sessions`, `public.reward_transactions`

**Schema includes:**

- All 7 core tables with proper relationships
- Indexes for performance
- Row Level Security (RLS) policies
- Stored functions for point calculations
- Materialized view for leaderboard

### 2. Reference All SQL Queries

For common operations (create user, award points, query leaderboard, etc.), see [`/backend/sql/002_queries_reference.sql`](/backend/sql/002_queries_reference.sql)

**Quick examples:**

```sql
-- Create new user (after Supabase signup)
INSERT INTO public.users (supabase_id, email, full_name, referral_code)
VALUES ('uuid', 'user@example.com', 'John Doe', 'SKYXYZ123');

-- Award points
SELECT public.award_points('user-uuid'::uuid, 100, 'task_completion'::reward_type, 'Task completed');

-- Get leaderboard
SELECT * FROM public.leaderboard_view WHERE rank <= 100;
```

### 3. Update Backend to Use PostgreSQL

Modify `backend/api/users.ts` and other endpoints to query PostgreSQL instead of MongoDB:

```typescript
// Instead of User.findById() (MongoDB)
// Use direct SQL queries via Supabase client
const { data, error } = await supabase
  .from("users")
  .select("*")
  .eq("supabase_id", supabaseId)
  .single();
```

### 4. Enable Row Level Security

All tables have RLS enabled. Users can only see/modify their own data by default. To test:

```sql
-- Verify RLS policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```

## Testing Checklist

- [ ] **Email/Password Signup**: Sign up with email, verify account created in MongoDB
- [ ] **Email/Password Login**: Log in with created account
- [ ] **Google Login**: Click "Continue with Google", verify OAuth flow completes and user syncs
- [ ] **X (Twitter) Login**: Click "Continue with X", verify OAuth flow completes and user syncs
- [ ] **Session Persistence**: Verify JWT stored in localStorage, survives page refresh
- [ ] **Profile Access**: After login, check `/api/users/profile` endpoint returns user data
- [ ] **Referral Code**: Verify each new user gets a unique referral code
- [ ] **Error Handling**: Test invalid credentials, verify error messages display

## Troubleshooting

### "Invalid or expired Supabase token"

- Ensure `SUPABASE_SERVICE_ROLE_KEY` is correctly set in backend `.env`
- Check Supabase project keys are valid

### "Sync failed"

- Verify MongoDB is running
- Check backend logs for sync endpoint errors
- Ensure JWT_SECRET is set

### OAuth redirect loop

- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check Supabase project OAuth settings (Redirect URLs)
- Ensure frontend URL is whitelisted in Supabase

### User not persisting

- Check MongoDB connection string
- Verify supabaseId field exists in User model
- Check backend logs for create/update errors

## Security Notes

- **Service Role Key**: Only used on backend, never exposed to frontend
- **Anon Key**: Used on frontend for Supabase client operations
- **JWT Token**: Returned from backend after sync, used for API authentication
- **Password Hashing**: Old email/password users still have bcrypt hashes; Supabase handles new OAuth users

## Next Steps

- [ ] Configure Supabase OAuth providers (Google/X API credentials)
- [ ] Set up Supabase email confirmation (if needed)
- [ ] Add password reset flow
- [ ] Implement profile picture upload to Supabase storage
- [ ] Set up Supabase RLS policies for frontend access
