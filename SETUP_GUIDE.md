# Setup Guide

This guide covers the exact setup required to run and deploy the current codebase.

## 1. Prerequisites

- Node.js 18 or newer
- npm
- A Supabase project
- A Vercel account if you want to deploy

## 2. Supabase Setup

Create a Supabase project, then run these SQL migrations in the SQL editor:

- `supabase/migrations/20240101000000_initial_schema.sql`
- `supabase/migrations/20240101000001_rls_policies.sql`

These migrations create the `categories` and `transactions` tables and enable Row-Level Security.

## 3. Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Only these two variables are required by the current app.

## 4. Install And Run

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## 5. Build Verification

Use the production build locally before deploying:

```bash
npm run build
```

If the build passes locally, the app is generally ready for Vercel.

## 6. Vercel Deployment

Add the same environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then redeploy the project.

The app does not need `SUPABASE_SERVICE_ROLE_KEY` for the current frontend/server routes.

## 7. Auth Flow

- Public routes: `/`, `/login`, `/register`
- Protected routes: `/dashboard`, `/transactions`, `/categories`
- Auth state is handled by Supabase SSR, `proxy.ts`, and server-side protected layouts
- Logout clears the session and returns the user to `/`

## 8. What Is Implemented

- Login, register, logout
- Category CRUD
- Transaction CRUD
- Dashboard stats and chart
- CSV export
- Responsive navigation and header
- Protected routes

## 9. What Is Not Implemented Yet

- Transaction filter UI
- Property-based tests
- Some advanced error-handling and refinement tasks from `.kiro/specs`

## 10. Quick Checklist

- Supabase migrations applied
- `.env.local` created
- `npm run dev` works locally
- `npm run build` passes
- Vercel env vars configured

