# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18.x or higher installed
- ✅ npm or yarn package manager
- ✅ A Supabase account (free tier is fine)
- ✅ Git (optional, for version control)

## 5-Minute Setup

### Step 1: Install Dependencies (2 min)

**Windows:**
```bash
# Open PowerShell or Command Prompt in the project directory
.\setup.bat
```

**macOS/Linux:**
```bash
npm install
```

### Step 2: Configure Supabase (2 min)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (name it "aether-board")
3. Wait for project initialization (~2 minutes)
4. Copy your project credentials:
   - Go to Settings → API
   - Copy "Project URL" and "anon public" key

5. Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Initialize Database (1 min)

1. In Supabase Dashboard, go to SQL Editor
2. Copy entire contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and click "Run"
4. Verify "Success" message

### Step 4: Start Development Server

```bash
npm run dev
```

### Step 5: Test the Application

1. Open http://localhost:3000
2. Click "Sign Up"
3. Create an account with email/password
4. You should see the dashboard!

## Testing Multiplayer

To test matchmaking and real-time features:

1. **First Player:**
   - Sign in at http://localhost:3000
   - Go to Dashboard → Find Match
   - Wait in queue

2. **Second Player:**
   - Open incognito/private browser window
   - Go to http://localhost:3000
   - Sign up with different email
   - Go to Dashboard → Find Match
   - Should immediately match with first player!

3. **Play:**
   - Make moves on one browser
   - See them instantly appear on the other
   - Watch the clocks count down in real-time

## Common Issues

### "Module not found" errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Port 3000 already in use
```bash
# Change port in package.json scripts
"dev": "next dev -p 3001"
```

### Supabase connection errors
- Verify your `.env.local` has correct credentials
- Check that Supabase project is running (green status)
- Restart dev server after changing `.env.local`

### Real-time not working
- Check browser console for errors
- Verify database migration ran successfully
- Ensure Realtime is enabled in Supabase (default: on)

## Next Steps

✅ **You're ready!** Here's what to try next:

1. **Customize the theme** - Edit `tailwind.config.ts`
2. **Add more time controls** - 1 min, 3 min, 10 min options
3. **Implement chat** - Use Supabase Realtime
4. **Add friends system** - Challenge specific players
5. **Create tournaments** - Multi-round competition mode

## Getting Help

- 📚 Check the full README.md
- 🔧 See SUPABASE_SETUP.md for detailed Supabase guide
- 🐛 Open an

 issue on GitHub
- 💬 Ask in discussions

---

**Enjoy building your chess empire! ♟️**
