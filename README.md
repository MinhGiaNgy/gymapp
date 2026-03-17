# NovaFitness Gym App

Full-stack gym tracking app with:
- Guest-first browsing
- Email/password authentication
- Workout calendar planning
- Progress logging + ratings
- AI coach chat (Claude API) constrained to weightlifting/nutrition/health

## Features

- Home page is public (guest mode)
- Auth landing page for sign up / log in
- Workout Plan page:
  - Add exercise blocks to a calendar
  - Export to Excel-compatible CSV
  - Requires login to save or export
- Progress page:
  - Search exercises
  - Log weight entries
  - View stats and rating (`noob`, `novice`, `average`, `pro`, `monster`)
  - Requires login to persist logs
- Statistics page:
  - Redirects users to Progress insights
  - Guest prompt to sign in
- Settings page:
  - Update email/password (authenticated users)
- AI Chat tab:
  - Uses Claude API through backend
  - Refuses unrelated topics, jailbreak attempts, security/internal data requests, and code-generation requests
  - Personalization limited to user workout + progress data

## Tech Stack

- Frontend: React 19 + TypeScript + Vite + React Router
- Backend: Node.js + Express
- Database: PostgreSQL (`pg`)
- Auth: JWT in HttpOnly cookie
- AI: Anthropic Claude Messages API

## Environment Variables

Copy `.env.example` to `.env` and fill values:

```env
CLIENT_ORIGIN=http://localhost:5173
VITE_API_BASE_URL=
PORT=4000
JWT_SECRET=replace-with-a-long-random-secret
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME
DATABASE_SSL=true
CLAUDE_API_KEY=your-claude-api-key
CLAUDE_MODEL=claude-3-5-sonnet-latest
CLAUDE_API_URL=https://api.anthropic.com/v1/messages
CLAUDE_API_VERSION=2023-06-01
```

Notes:
- `VITE_API_BASE_URL`:
  - Local dev with Vite proxy: leave blank
  - Separate frontend/backend hosts: set to backend URL ending in `/api`
- `JWT_SECRET` should be long and random.

## Local Development

From `novafitness/`:

```bash
npm install
npm run dev
```

This starts:
- Frontend: `http://localhost:5173`
- API: `http://localhost:4000`

Health check:

```bash
curl http://localhost:4000/api/health
```

## Build

```bash
npm run lint
npm run build
npm run preview
```

## Database Schema

Tables are initialized automatically on server startup:
- `users` (email primary key)
- `workout_plans` (FK: `user_email -> users.email`)
- `progress_logs` (FK: `user_email -> users.email`)

## Security Notes

- SQL injection resistance: all queries are parameterized
- Passwords are hashed (`bcryptjs`)
- JWT stored in HttpOnly cookie (not in localStorage/sessionStorage)
- API responses set `Cache-Control: no-store`
- AI endpoint gets only user-specific workout/progress context
- `.env` is gitignored; do not commit secrets

## API Overview

- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `GET /api/auth/me`
- Workout Plans:
  - `GET /api/workout-plans?month=YYYY-MM`
  - `POST /api/workout-plans`
  - `DELETE /api/workout-plans/:id`
- Progress:
  - `GET /api/progress?search=...`
  - `POST /api/progress`
  - `DELETE /api/progress/:id`
- Settings:
  - `PATCH /api/settings/email`
  - `PATCH /api/settings/password`
- AI:
  - `POST /api/ai/chat`


- For managed Postgres providers (Neon/Supabase/etc.), `DATABASE_SSL=true` is usually required.
