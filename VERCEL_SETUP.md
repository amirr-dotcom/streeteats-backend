# Vercel Environment Variables Setup

## Required Environment Variables

You **MUST** set these in Vercel Dashboard for the API to work:

### 1. DATABASE_URL

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add:
- **Key**: `DATABASE_URL`
- **Value**: Your Supabase connection string

#### For Supabase:
You have two options:

**Option A: Direct Connection (Simple)**
```
postgresql://postgres:[YOUR-PASSWORD]@db.cidxoxkeyhuvhzydmnwn.supabase.co:5432/postgres?sslmode=require
```

**Option B: Connection Pooling (Recommended for Serverless)**
- Go to Supabase Dashboard → Settings → Database
- Find "Connection Pooling" section
- Use the **Transaction** or **Session** mode connection string
- It will look like:
```
postgresql://postgres.cidxoxkeyhuvhzydmnwn:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require
```

**⚠️ Important**: Replace `[YOUR-PASSWORD]` with your actual Supabase database password!

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
