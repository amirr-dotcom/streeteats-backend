# Vercel Environment Variables Setup

## ⚠️ CRITICAL: Database Connection Issue

If you're getting `Can't reach database server` errors, you **MUST** use **Connection Pooling** (port 6543) instead of direct connection (port 5432).

### Why?
- Vercel serverless functions have connection limits
- Direct connections (5432) often fail on serverless
- Connection pooling (6543) is designed for serverless/edge functions

---

## Required Environment Variables

You **MUST** set these in Vercel Dashboard for the API to work:

### 1. DATABASE_URL (REQUIRED - Use Connection Pooling!)

**🚨 IMPORTANT: Use Connection Pooling URL (port 6543), NOT direct connection!**

#### Steps to Get Supabase Connection Pooling URL:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **Database**
4. Scroll to **Connection Pooling** section
5. Select **Transaction** mode (recommended) or **Session** mode
6. Copy the connection string - it will have:
   - `pooler.supabase.com` in the hostname (NOT `db.supabase.co`)
   - Port `6543` (NOT `5432`)
   - Format: `postgresql://postgres.cidxoxkeyhuvhzydmnwn:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require`

#### Add to Vercel:
- **Key**: `DATABASE_URL`
- **Value**: The connection pooling URL from Supabase (port 6543)

**Example:**
```
postgresql://postgres.cidxoxkeyhuvhzydmnwn:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require
```

**⚠️ Replace `[YOUR-PASSWORD]` with your actual Supabase database password!**

#### ❌ DO NOT USE (Direct Connection - Port 5432):
```
postgresql://postgres:[PASSWORD]@db.cidxoxkeyhuvhzydmnwn.supabase.co:5432/postgres
```
This will fail on Vercel serverless functions!

### 2. JWT_SECRET

- **Key**: `JWT_SECRET`
- **Value**: A strong random string (e.g., generate with `openssl rand -base64 32`)

### 3. JWT_EXPIRES_IN (Optional)

- **Key**: `JWT_EXPIRES_IN`
- **Value**: `7d` (or your preferred expiration)

## Steps to Add Environment Variables:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `streeteats-backend`
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - Click **Add New**
   - Enter the Key and Value
   - Select environments (Production, Preview, Development)
   - Click **Save**
5. **Redeploy** your project after adding variables

## After Adding Variables:

After setting environment variables, you need to:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

## Verify Variables are Set:

Check Vercel logs after redeploy to confirm `DATABASE_URL` is accessible.
