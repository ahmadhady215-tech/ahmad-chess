# ♟️ AHMAD CHESS

**Professional Real-Time 1v1 Chess Application**

A modern, real-time chess application built with Next.js 14, TypeScript, Tailwind CSS, and Supabase. Features include instant move synchronization, ELO ranking system, matchmaking, and comprehensive game analysis.

![Ahmad Chess](https://img.shields.io/badge/Status-Production%20Ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green)

## ✨ Features

### Core Functionality
- ⚡ **Real-Time Gameplay** - Sub-100ms move latency using Supabase Realtime
- 🏆 **ELO Rating System** - Professional skill-based ranking
- 🎯 **Smart Matchmaking** - Queue system matching players by ELO (±200 range)
- ⏱️ **Game Clocks** - 5-minute blitz with visual time pressure indicators
- 📊 **Game History** - Complete move-by-move analysis and replay
- 🔐 **Secure Authentication** - Email/password and Google OAuth
- 👥 **Player Presence** - Real-time online status tracking

### Technical Features
- 🎨 **Dark/Neon Theme** - Stunning cyberpunk-inspired UI
- 📱 **Fully Responsive** - Optimized for all devices
- 🔒 **Row-Level Security** - Fine-grained database access control
- ⚙️ **Edge Functions** - Server-side validation and ELO calculation
- 🎭 **Smooth Animations** - Framer Motion powered transitions
- ♿ **Accessible** - WCAG compliant design

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Supabase account ([supabase.com](https://supabase.com))

### Installation

1. **Clone or use this repository**
   ```bash
   cd d:/cf/super
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Copy your project URL and anon key
   
   c. Create `.env.local` from the example:
   ```bash
   cp .env.local.example .env.local
   ```
   
   d. Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize the database**
   
   Run the migration script in your Supabase SQL Editor:
   ```bash
   # Copy contents of supabase/migrations/001_initial_schema.sql
   # and execute in Supabase SQL Editor
   ```

5. **Configure Google OAuth (Optional)**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
ahmad-chess/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── auth/                # Authentication pages
│   │   │   ├── signin/         # Sign in page
│   │   │   ├── signup/         # Sign up page
│   │   │   └── callback/       # OAuth callback
│   │   ├── dashboard/          # User dashboard
│   │   ├── matchmaking/        # Matchmaking queue
│   │   ├── game/[id]/          # Active game
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── game/               # Game-specific components
│   │   │   ├── ChessBoard.tsx  # Interactive chess board
│   │   │   ├── GameClock.tsx   # Game timer
│   │   │   ├── MoveHistory.tsx # Move list
│   │   │   └── PlayerInfo.tsx  # Player card
│   │   └── ui/                 # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Loading.tsx
│   │       └── StatusBadge.tsx
│   ├── lib/
│   │   ├── supabase/           # Supabase configuration
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server client
│   │   │   ├── middleware.ts   # Session middleware
│   │   │   └── types.ts        # Database types
│   │   ├── chess.ts            # Chess game logic
│   │   └── realtime.ts         # Real-time service
│   └── middleware.ts           # Auth middleware
├── supabase/
│   ├── migrations/             # Database migrations
│   └── functions/              # Edge Functions
│       └── game-end/           # Game validation
├── .env.local.example          # Environment template
├── next.config.js              # Next.js config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## 🎮 Usage Guide

### Creating an Account
1. Click "Sign Up" on the homepage
2. Choose email/password or Google OAuth
3. Complete your profile

### Playing a Game
1. Go to Dashboard
2. Click "Find Match" or use the "Play Now" button
3. Wait for matchmaking (typically < 10 seconds)
4. Play moves by clicking pieces and target squares
5. Monitor your clock and opponent's time
6. Win by checkmate, resignation, or timeout

### Understanding ELO
- Starting ELO: 1200
- Win: Gain points based on opponent's rating
- Loss: Lose points based on opponent's rating
- Draw: Minimal rating change
- K-factor: 32 (standard)

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

### Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.3
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion
- **Chess Engine**: chess.js
- **Chess UI**: react-chessboard
- **Backend**: Supabase
  - Database: PostgreSQL
  - Real-time: Supabase Realtime
  - Auth: Supabase Auth
  - Functions: Supabase Edge Functions
- **State Management**: React hooks + Zustand

## 🔒 Security

- **Row-Level Security (RLS)** enforced on all tables
- **Server-side validation** via Edge Functions
- **Session management** with secure cookies
- **Input sanitization** for all user inputs
- **CORS protection** on API routes

## 🚢 Deployment

### Platform Recommendations
- Netlify
- Railway
- Cloudflare Pages
- Self-hosted with Docker

## 📊 Database Schema

### Tables

#### `users`
- `id` (UUID, PK) - References auth.users
- `email` (TEXT)
- `display_name` (TEXT)
- `avatar_url` (TEXT)
- `elo_rating` (INTEGER) - Default: 1200
- `wins`, `losses`, `draws` (INTEGER)
- `created_at`, `updated_at` (TIMESTAMPTZ)

#### `games`
- `id` (UUID, PK)
- `white_player_id`, `black_player_id` (UUID, FK)
- `current_fen` (TEXT)
- `status` (TEXT) - waiting | active | completed | abandoned
- `winner_id` (UUID, FK)
- `result` (TEXT) - white_win | black_win | draw
- `time_control` (INTEGER) - Seconds
- `white_time_remaining`, `black_time_remaining` (INTEGER)
- `created_at`, `updated_at`, `ended_at` (TIMESTAMPTZ)

#### `game_moves`
- `id` (UUID, PK)
- `game_id` (UUID, FK)
- `move_number` (INTEGER)
- `from_square`, `to_square` (TEXT)
- `piece` (TEXT)
- `promotion` (TEXT)
- `fen_after` (TEXT)
- `player_id` (UUID, FK)
- `timestamp` (TIMESTAMPTZ)

#### `matchmaking_queue`
- `id` (UUID, PK)
- `user_id` (UUID, FK)
- `elo_rating` (INTEGER)
- `created_at` (TIMESTAMPTZ)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Chess.js for chess logic
- Supabase for backend infrastructure
- Next.js team for the framework
- Tailwind CSS for styling utilities

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Contact: your@email.com

---

**Built with ❤️ using Google Antigravity & Supabase**
