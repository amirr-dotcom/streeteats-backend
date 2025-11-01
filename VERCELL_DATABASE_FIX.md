# 🔧 Step-by-Step: Fix Database Connection on Vercel

## The Problem
Error shows: `Can't reach database server at port 5432`
This means your DATABASE_URL in Vercel is using direct connection.

## ✅ Solution: Update DATABASE_URL to Use Connection Pooling

### Step 1: Get Connection Pooling URL from Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com
   - Login to your account

2. **Select Your Project**
   - Click on the project: `cidxoxkeyhuvhzydmnwn` (or your project name)

3. **Navigate to Database Settings**
   - Click **Settings** (gear icon in left sidebar)
   - Click **Database** (in the settings menu)

4. **Find Connection Pooling Section**
   - Scroll down to **"Connection Pooling"** section
   - You'll see different modes: Transaction, Session, Direct

5. **Copy Transaction Mode Connection String**
   - Select **"Transaction"** mode (recommended)
   - Click the **"Copy"** button next to the connection string
   - It should look like:
     ```
     postgresql://postgres.cidxoxkeyhuvhzydmnwn:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
     ```
   - ✅ Must have: `pooler.supabase.com` and port `6543`

### Step 2: Update DATABASE_URL in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Login to your account

2. **Select Your Project**
   - Click on project: `streeteats-backend`

3. **Go to Environment Variables**
   - Click **Settings** tab
   - Click **Environment Variables** (in left sidebar)

4. **Find or Add DATABASE_URL**
   - Look for existing `DATABASE_URL` variable
   - Or click **"Add New"** if it doesn't exist

5. **Update the Value**
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Connection Pooling URL you copied from Supabase
   - Make sure it has:
     - `pooler.supabase.com` (NOT `db.supabase.co`)
     - Port `6543` (NOT `5432`)
   - Select environments: **Production**, **Preview**, **Development** (all of them)
   - Click **Save**

6. **Verify It's Updated**
   - You should see `DATABASE_URL` in the list
   - Check that the URL contains `pooler.supabase.com:6543`

### Step 3: Redeploy

1. **Go to Deployments Tab**
   - Click **Deployments** in top navigation

2. **Redeploy Latest**
   - Click **⋯** (three dots) on the latest deployment
   - Click **Redeploy**
   - Select **"Use existing Build Cache"** (optional)
   - Click **Redeploy**

3. **Wait for Deployment**
   - Wait for build to complete (usually 1-2 minutes)

### Step 4: Test

After deployment completes:
- Test login endpoint: `POST /api/auth/login`
- Should work without connection errors now!

## ⚠️ Important Notes

### ✅ Correct DATABASE_URL Format:
```
postgresql://postgres.cidxoxkeyhuvhzydmnwn:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```
- Has `pooler.supabase.com`
- Port `6543`
- Username: `postgres.cidxoxkeyhuvhzydmnwn`

### ❌ Wrong DATABASE_URL Format:
```
postgresql://postgres:[PASSWORD]@db.cidxoxkeyhuvhzydmnwn.supabase.co:5432/postgres
```
- Has `db.supabase.co`
- Port `5432`
- **This won't work on Vercel!**

## Why Connection Pooling?

- Vercel serverless functions can't maintain persistent connections
- Direct connections (5432) timeout/fail
- Connection pooling (6543) manages connections efficiently
- Required for all serverless deployments

## Need Help?

If you can't find Connection Pooling in Supabase:
- Make sure you're on the correct project
- Check if your Supabase plan supports connection pooling (most plans do)
- Try "Session" mode if "Transaction" doesn't work
