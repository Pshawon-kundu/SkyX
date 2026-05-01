# 🚀 Vercel Deployment Guide

## Quick Deploy Status Check

Your domain **skyx.finance** is showing blank because:

1. Environment variables are not set on Vercel
2. OR the deployment hasn't completed yet

## ✅ Fix: Set Environment Variables on Vercel

### Step 1: Go to Vercel Dashboard

1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your **SkyX** project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add These Variables

Copy these from `.env.local` and add to Vercel:

```
VITE_FIREBASE_API_KEY=AIzaSyDpZqyR2nzK2P6sXOdUHlQ2GBTZ2Kwi_Dc
VITE_FIREBASE_AUTH_DOMAIN=skyx-74710.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=skyx-74710
VITE_FIREBASE_STORAGE_BUCKET=skyx-74710.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=939772496272
VITE_FIREBASE_APP_ID=1:939772496272:web:af2dc2e03ecd430ca20b15
VITE_FIREBASE_MEASUREMENT_ID=G-7Y7G27LR25
VITE_SUPABASE_URL=https://iblmaweycrpqwozjurhv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlibG1hd2V5Y3JwcXdvemp1cmh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MjU0NjQsImV4cCI6MjA5MzIwMTQ2NH0.bCzbb8vLkx5Acoo4ZhZvYAT1tqhb25o4GI4GOQiAYvw
VITE_API_BASE_URL=https://your-backend-url.com
```

### Step 3: Trigger Redeploy

1. After adding variables, go to **Deployments**
2. Find the latest deployment
3. Click the **⋮** (three dots) → **Redeploy**

### Step 4: Check Domain DNS

If still blank after redeploy:

1. Go to **Settings** → **Domains**
2. Verify **skyx.finance** is connected
3. Check your domain registrar DNS settings point to Vercel:
   - Type: `ALIAS` or `ANAME`
   - Value: `cname.vercel-dns.com`

## 🔍 Verify Deployment

After redeploy, check:

```
✅ https://skyx.finance/ → Should show SkyX homepage
✅ https://skyx.finance/login → Should show login page
✅ https://skyx-prod.vercel.app/ → Direct Vercel URL (backup)
```

## 📋 What Changed

- ✅ Pushed all auth & profile code to GitHub
- ✅ `vercel.json` configured for Vite
- ✅ Build outputs to `dist/` directory
- ✅ All environment variables needed

## 🛠️ If Still Not Working

### Check Build Logs:

1. Vercel Dashboard → Deployments
2. Click the failed/building deployment
3. View **Build Logs** for errors

### Common Issues:

- **403 Forbidden** → DNS not updated yet (wait 5-10 mins)
- **Blank Page** → Missing env vars (add them above)
- **404 Not Found** → Deployment incomplete (redeploy)

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- Domain Help: https://vercel.com/docs/concepts/projects/domains
- Firebase: https://console.firebase.google.com

Done! Site should be live shortly. 🎉
