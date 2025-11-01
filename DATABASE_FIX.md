# 🚨 CRITICAL: Fix Database Connection for Vercel

## Problem
- Login fails: "Can't reach database server at port 5432"
- Signup might work sometimes but unstable

## Root Cause
Your `DATABASE_URL` in Vercel is using **direct connection (port 5432)** which doesn't work on serverless.

## ✅ Solution: Use Connection Pooling

### Step 1: Get Connection Pooling URL from Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. **Settings** → **Database**
4. Scroll to **"Connection Pooling"** section
5. Select **"Transaction"** mode (recommended)
6. Copy the connection string

### Step 2: Update DATABASE_URL in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Your project → **Settings** → **Environment Variables**
3. Find `DATABASE_URL`
4. Replace with the **Connection Pooling URL** (port 6543)

### What to Look For:

✅ **Correct (Connection Pooling):**
```
postgresql://postgres.cidxoxkeyhuvhzydmnwn:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```
- Has `pooler.supabase.com`
- Port is `6543`
- Username format: `postgres.cidxoxkeyhuvhzydmnwn`

❌ **Wrong (Direct Connection):**
```
postgresql://postgres:[PASSWORD]@db.cidxoxkeyhuvhzydmnwn.supabase.co:5432/postgres
```
- Has `db.supabase.co`
- Port is `5432`
- Won't work on Vercel!

### Step 3: Redeploy

After updating `DATABASE_URL`:
1. Go to **Deployments** tab
2. Click **⋯** → **Redeploy**
3. Wait for deployment

## Why Connection Pooling?

- Vercel serverless functions have connection limits
- Direct connections (5432) often timeout/fail
- Connection pooling (6543) manages connections efficiently
- Required for production serverless apps
