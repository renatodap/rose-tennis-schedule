# Deployment Guide

This guide walks through deploying the Rose-Hulman Tennis Team Availability App to production.

## Prerequisites Checklist

- [ ] Supabase account created
- [ ] Vercel account created
- [ ] GitHub repository created
- [ ] Domain name (optional, Vercel provides a free .vercel.app domain)

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in project details:
   - **Name**: rose-hulman-tennis
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose the closest region (e.g., East US)
4. Click "Create new project" and wait for setup to complete

### 1.2 Run Database Migrations

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click "Run" to execute
5. Create another new query
6. Copy and paste the contents of `supabase/migrations/002_rls_policies.sql`
7. Click "Run" to execute

### 1.3 Configure Authentication

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add your production URL:
   - For now, use: `https://your-project.vercel.app` (we'll update this later)
3. Under **Redirect URLs**, add:
   ```
   https://your-project.vercel.app/auth/callback
   https://your-project.vercel.app/**
   ```
4. Scroll to **Email Auth** and ensure it's enabled
5. Customize email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize "Confirm signup", "Reset password", etc. with Rose-Hulman branding
   - Use maroon color (#800000) for buttons

### 1.4 Get API Credentials

1. Go to **Settings** → **API**
2. Copy and save these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`, keep this secret!)

## Step 2: Deploy to Vercel

### 2.1 Push Code to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Rose-Hulman Tennis App"

# Create main branch
git branch -M main

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/rose-hulman-tennis.git

# Push to GitHub
git push -u origin main
```

### 2.2 Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository:
   - Select "rose-hulman-tennis" from your repositories
   - Click "Import"

### 2.3 Configure Project Settings

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: Leave as `./`
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

### 2.4 Add Environment Variables

Click "Environment Variables" and add the following:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_APP_NAME=Rose-Hulman Tennis
```

**Important**: Replace the values with your actual Supabase credentials from Step 1.4

### 2.5 Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Once deployed, you'll get a URL like `https://rose-hulman-tennis.vercel.app`

## Step 3: Update Supabase URLs

Now that you have your Vercel URL, update Supabase:

1. Go back to Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Update **Site URL** to your actual Vercel URL:
   ```
   https://rose-hulman-tennis.vercel.app
   ```
4. Update **Redirect URLs** to include:
   ```
   https://rose-hulman-tennis.vercel.app/auth/callback
   https://rose-hulman-tennis.vercel.app/**
   ```

## Step 4: Set Up Initial Users

### 4.1 Create Coach and Captain Accounts

1. Open your deployed app: `https://rose-hulman-tennis.vercel.app`
2. Have each coach and captain sign up using their Rose-Hulman email:
   - Matt Wilson (matt.wilson@rose-hulman.edu)
   - Amanda Lubold (amanda.lubold@rose-hulman.edu)
   - Chris Lian (chris.lian@rose-hulman.edu)
   - Camille Clark (camille.clark@rose-hulman.edu)
   - Renato Prado (renato.prado@rose-hulman.edu)

### 4.2 Update User Roles in Database

After all coaches and captains have signed up:

1. Go to Supabase Dashboard → **SQL Editor**
2. Run the following query:

```sql
-- Set coaches
UPDATE users SET role = 'coach'
WHERE email IN ('matt.wilson@rose-hulman.edu', 'amanda.lubold@rose-hulman.edu');

-- Set captains
UPDATE users SET role = 'captain'
WHERE email IN (
  'chris.lian@rose-hulman.edu',
  'camille.clark@rose-hulman.edu',
  'renato.prado@rose-hulman.edu'
);

-- Verify changes
SELECT first_name, last_name, email, role FROM users WHERE role IN ('coach', 'captain');
```

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Domain in Vercel

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add your custom domain (e.g., `tennis.rose-hulman.edu`)
4. Follow Vercel's instructions to configure DNS

### 5.2 Update Environment Variables

1. In Vercel, go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` to your custom domain:
   ```
   NEXT_PUBLIC_APP_URL=https://tennis.rose-hulman.edu
   ```
3. Click "Save"

### 5.3 Redeploy

1. Go to **Deployments**
2. Click on the latest deployment
3. Click **...** → **Redeploy**

### 5.4 Update Supabase URLs Again

1. Go to Supabase Dashboard → **Authentication** → **Settings**
2. Update **Site URL** and **Redirect URLs** to use your custom domain

## Step 6: Testing

### 6.1 Test Authentication

- [ ] Sign up as a new player
- [ ] Sign in with existing account
- [ ] Test forgot password flow
- [ ] Sign out

### 6.2 Test Player Features

- [ ] View dashboard
- [ ] Navigate between pages
- [ ] View profile
- [ ] Test on mobile device

### 6.3 Test Coach/Captain Features

- [ ] Sign in as coach or captain
- [ ] Verify "Admin" link appears in navigation
- [ ] Access admin dashboard
- [ ] Verify team list is visible

## Step 7: Monitoring and Maintenance

### Vercel Monitoring

- Go to your project dashboard to view:
  - Deployment status
  - Build logs
  - Runtime errors
  - Performance analytics

### Supabase Monitoring

- Go to Supabase Dashboard to monitor:
  - Database usage
  - API requests
  - Active connections
  - Auth metrics

### Setting Up Alerts

1. **Vercel**: Configure deployment notifications in Settings → Notifications
2. **Supabase**: Set up database usage alerts in Settings → Billing

## Troubleshooting

### Build Fails on Vercel

**Issue**: TypeScript errors or missing environment variables

**Solution**:
1. Check build logs in Vercel dashboard
2. Ensure all environment variables are set correctly
3. Run `npm run build` locally to test
4. Check that all dependencies are in package.json

### Authentication Not Working

**Issue**: Users can't sign in/up

**Solution**:
1. Verify Supabase environment variables are correct
2. Check that Site URL and Redirect URLs are set in Supabase
3. Ensure email auth is enabled in Supabase
4. Check browser console for errors

### Users Can't Access Admin Pages

**Issue**: Coaches/captains see "Access Denied"

**Solution**:
1. Verify their role was updated in database (Step 4.2)
2. Have them sign out and sign back in
3. Check RLS policies are applied correctly

### Database Connection Issues

**Issue**: "Failed to connect to database"

**Solution**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
2. Check that Supabase project is active (not paused)
3. Verify API keys are valid (not expired)

## Rollback Procedure

If you need to rollback to a previous version:

1. Go to Vercel Dashboard → **Deployments**
2. Find the last working deployment
3. Click **...** → **Promote to Production**

## Continuous Deployment

After initial setup, deployments are automatic:

- **Push to `main` branch** → Automatic production deployment
- **Create Pull Request** → Automatic preview deployment
- **Merge PR** → Automatic production deployment

## Security Checklist

- [ ] Environment variables set correctly (no exposed secrets)
- [ ] RLS policies enabled on all tables
- [ ] Service role key kept secret (never exposed to client)
- [ ] HTTPS enforced (Vercel does this automatically)
- [ ] Email verification enabled in Supabase
- [ ] Strong password requirements configured
- [ ] Regular database backups enabled (Supabase automatic)

## Support

For deployment issues:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Contact the development team

---

**Deployment Complete!** 🎉

Your Rose-Hulman Tennis Team Availability App is now live and ready to use.
