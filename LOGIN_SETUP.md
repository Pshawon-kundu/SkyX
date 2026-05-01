# 🚀 Quick Login Setup Guide

## The Issue

If you're seeing **"Firebase: Error (auth/invalid-credential)"** error when trying to sign in, it means:

- The account doesn't exist yet in Firebase, OR
- You need to create a new account first

## ✅ How to Test Login

### Option 1: Create a New Account (Recommended)

1. Go to the **Login page**
2. Click **"Create account"** button
3. Enter your email and password (min 8 characters)
4. Enter your full name
5. Click **"Create account"**
6. You'll be automatically logged in and redirected to your profile

### Option 2: Use Google Sign-In

1. Click **"Continue with Google"** button
2. Select your Google account
3. Your profile will be created automatically

### Option 3: Test with Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select the **"skyx-74710"** project
3. Navigate to **Authentication > Users**
4. Click **"Add user"**
5. Enter test email and password
6. Return to the app and sign in

## 📝 Current Setup

- ✅ Firebase is configured (check `.env.local`)
- ✅ Error messages are now clearer
- ✅ UI suggests creating account when needed
- ✅ Google OAuth is ready to use

## 🔧 If Issues Persist

1. Check that `.env.local` has correct Firebase credentials
2. Restart the dev server: `npm run dev`
3. Clear browser localStorage: Press F12 > Application > Clear All
4. Try creating account first before signing in

## 📚 Next Steps

Once logged in, you'll see:

- User profile page with all your details
- Points and achievements
- Referral tracking
- Game activity
- Leaderboard

Enjoy! 🎮
