# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Click "New Project"
5. Fill in:
   - Name: `aether-board`
   - Database Password: (generate a strong password)
   - Region: Choose closest to you
6. Click "Create new project"
7. Wait for project to be ready (~2 minutes)

## Step 2: Get API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Configure Environment Variables

1. In your local project, create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and paste your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click "Run" or press Ctrl+Enter
6. Verify success (should show "Success. No rows returned")

## Step 5: Configure Google OAuth (Optional)

1. Go to **Authentication** → **Providers** in Supabase Dashboard
2. Find "Google" and click the toggle to enable
3. You'll need:
   - Google OAuth Client ID
   - Google OAuth Client Secret

### Getting Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen if prompted
6. Choose **Web application**
7. Add authorized redirect URIs:
   ```
   https://your-project.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback (for development)
   ```
8. Copy Client ID and Client Secret
9. Paste into Supabase Google provider settings
10. Save

## Step 6: Verify Setup

1. Run `npm run dev` from your project directory
2. Open http://localhost:3000
3. Try to sign up with email or Google
4. Check Supabase Dashboard → **Authentication** → **Users** to see if user was created
5. Check **Table Editor** → **users** to verify profile was created

## Step 7: Test Real-Time Features

1. Sign in with two different accounts (use two browsers or incognito)
2. Start a match from one account
3. The matchmaking should connect both players
4. Test making moves - they should sync instantly

## Troubleshooting

### "Failed to fetch" errors
- Check that your Supabase URL and key are correct in `.env.local`
- Restart the dev server after changing environment variables

### "RLS policy violation" errors
- Verify all migrations ran successfully
- Check that RLS policies were created

### Google OAuth not working
- Verify redirect URIs match exactly
- Check that Google provider is enabled in Supabase
- Clear browser cache and cookies

### Real-time not syncing
- Check browser console for WebSocket errors
- Verify Supabase Realtime is enabled (it should be by default)
- Check network tab for Realtime connection

## Database Backup

To backup your data:
1. Go to **Database** → **Backups** in Supabase Dashboard
2. Backups are automatic for Pro plan
3. For manual export, use **Database** → **Postgres** and download SQL

## Need Help?

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Project Issues: Open a GitHub issue
