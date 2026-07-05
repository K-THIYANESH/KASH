<div align="center">

# 🔥 KA-SH
### Collaborative Productivity Platform
**Kavibala J × Thiyanesh K**

*Study together. Grow together. Win together.*

</div>

---

## Tech Stack (100% Free & Open Source)

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 15 + TypeScript | Production-grade, App Router, SSR |
| Styling | Tailwind CSS | No subscription, no limits |
| Animations | Framer Motion | MIT licensed |
| Backend | Next.js API Routes | Serverless, no separate server |
| Database | PostgreSQL via **Neon** | Free 3GB, no credit card |
| ORM | Prisma | Best-in-class, fully free |
| Auth | NextAuth.js (Credentials) | No Clerk/Auth0 fees, self-hosted |
| State | Zustand | 1KB, MIT |
| Charts | Recharts | Free, React-native |
| AI | Anthropic Claude API | Free $5 credits on signup |
| Deployment | **Vercel** | Free Hobby plan, automatic CI/CD |
| PWA | next-pwa / manifest | Installable on Android, iPhone, Desktop |

---

## Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/kash-app.git
cd kash-app
npm install
```

### 2. Database Setup (Neon — Free)
1. Go to [neon.tech](https://neon.tech) → Sign up (free, no credit card)
2. Create project → Copy the **Connection String**
3. Paste it as `DATABASE_URL` in your `.env.local`

### 3. Environment Variables
```bash
cp .env.example .env.local
# Fill in:
# DATABASE_URL=postgresql://...
# NEXTAUTH_SECRET=$(openssl rand -base64 32)
# NEXTAUTH_URL=http://localhost:3000
```

### 4. Database Migration & Seed
```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed users + achievements + sample data
```

### 5. Run Dev Server
```bash
npm run dev
# Open http://localhost:3000
```

**Login credentials after seeding:**
- `thiyanesh@kash.app` / `kash2025`
- `kavibala@kash.app` / `kash2025`

---

## Deploy to Vercel (Free)

### One-Command Deploy
```bash
npx vercel --prod
```

### Manual Steps
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add environment variables:
   ```
   DATABASE_URL        = (from Neon)
   NEXTAUTH_SECRET     = (run: openssl rand -base64 32)
   NEXTAUTH_URL        = https://your-app.vercel.app
   ANTHROPIC_API_KEY   = (optional, from console.anthropic.com)
   ```
4. Deploy → Done! 🎉

### After Deploying
```bash
# Run migrations on production DB
npx prisma migrate deploy
node prisma/seed.js
```

---

## Project Structure

```
kash-app/
├── prisma/
│   ├── schema.prisma          # Complete DB schema
│   └── seed.js                # Seed users + data
├── src/
│   ├── app/
│   │   ├── (app)/             # Protected routes (require login)
│   │   │   ├── dashboard/     # Home dashboard
│   │   │   ├── tasks/         # Task checklist
│   │   │   ├── create/        # Create task
│   │   │   ├── analytics/     # Charts + heatmap
│   │   │   ├── streaks/       # Streak milestones
│   │   │   ├── achievements/  # Achievement center
│   │   │   ├── timer/         # Pomodoro timer
│   │   │   ├── memory/        # Memory wall timeline
│   │   │   ├── appreciate/    # Partner appreciation + AI
│   │   │   └── layout.tsx     # Bottom navigation
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth endpoint
│   │   │   ├── tasks/         # CRUD + completion
│   │   │   ├── analytics/     # Stats aggregation
│   │   │   ├── streaks/       # Streak data
│   │   │   ├── achievements/  # Achievement list
│   │   │   ├── appreciations/ # Partner messages
│   │   │   ├── memories/      # Memory wall
│   │   │   ├── timer/         # Study sessions
│   │   │   └── users/         # User list
│   │   ├── login/             # Login page
│   │   ├── layout.tsx         # Root layout
│   │   └── providers.tsx      # SessionProvider
│   ├── components/ui/         # Reusable UI components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── auth.ts            # NextAuth config
│   │   ├── xp.ts              # XP/level system
│   │   └── utils.ts           # Utilities
│   ├── store/
│   │   └── useAppStore.ts     # Zustand global state
│   └── types/
│       └── next-auth.d.ts     # Type extensions
└── public/
    └── manifest.json          # PWA manifest
```

---

## Features

### ✅ Implemented
- 🏠 **Dashboard** — Progress ring, streak, partner status, XP bar, daily quote
- ✅ **Tasks** — Create, assign, filter, toggle completion with XP rewards
- 📊 **Analytics** — Bar charts, pie chart, activity heatmap (Recharts)
- 🔥 **Streaks** — Per-user streaks, milestone badges (Bronze → Diamond)
- 🏆 **Achievements** — 12 achievements with unlock tracking
- 🍅 **Timer** — Pomodoro (25/5, 50/10, 90/20), session logging, stats
- 📌 **Memory Wall** — Timeline of pinned memories by type
- 💜 **Appreciation** — Send messages, view history, AI chat assistant
- 🔐 **Auth** — JWT sessions, protected routes, credentials provider
- 📱 **PWA** — Installable on Android/iPhone/Desktop
- 🌙 **Dark Mode** — Glassmorphism, gradient backgrounds throughout

### 🔄 Easy Additions
- Push notifications via Web Push API
- Real-time updates via Supabase Realtime or Pusher free tier
- Image uploads via Cloudinary free tier (25GB)
- Email summaries via Resend free tier (3000 emails/month)

---

## Free Tier Summary

| Service | Free Limit | Enough? |
|---------|-----------|---------|
| Vercel Hobby | 100GB bandwidth/mo | ✅ Yes (2 users) |
| Neon Postgres | 3GB storage | ✅ Yes |
| Anthropic API | $5 credits on signup | ✅ Yes for months |
| GitHub | Unlimited repos | ✅ Yes |

**Total monthly cost: $0** 🎉

---

<div align="center">
Built with 💜 by Thiyanesh K & Kavibala J
</div>
