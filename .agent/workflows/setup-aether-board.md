---
description: Set up Aether-Board Development Environment
---
# Aether-Board Setup Workflow

This workflow sets up the development environment for Aether-Board, ensuring a clean install and proper configuration.

## 1. Environment Configuration

1. Create `.env.local` if it doesn't exist:
   ```powershell
   if (!(Test-Path .env.local)) {
       Copy-Item .env.local.example .env.local
       Write-Host "Created .env.local from example"
   }
   ```

2. Update `.env.local` with your Supabase credentials.

## 2. Clean Installation (Fixes Build Errors)

If you encounter "module not found" or "build error" issues, perform a clean install:

1. Stop any running dev servers (Ctrl+C).

// turbo
2. Clean project artifacts:
   ```powershell
   Remove-Item -Path .next -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path node_modules -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path package-lock.json -Force -ErrorAction SilentlyContinue
   Write-Host "Project cleaned."
   ```

// turbo
3. Install dependencies:
   ```powershell
   npm install
   ```

## 3. Database Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard).
2. Open the SQL Editor.
3. Run the migration script located at `supabase/migrations/001_initial_schema.sql`.

## 4. specific Fixes

If you see "Attempted import error: '../module/index.js'":
- Ensure you are using the precise versions in `package.json` (Supabase v2.38.4, Next.js v14.0.4).
- Run the "Clean Installation" steps above.

## 5. Start Development Server

// turbo
1. Start the server:
   ```powershell
   npm run dev
   ```
