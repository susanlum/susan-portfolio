# susan-portfolio

Susan's AI-powered portfolio: project cards with live demos, full case studies
(problem → approach → outcome), and reviewable AI-suggested skill tags —
demoable by a recruiter in 30 seconds, no login required.

**Live:** https://susan-portfolio-alpha.vercel.app

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) + Tailwind CSS v4 |
| Database | Supabase (Postgres + RLS) |
| Auth | Supabase Auth (email/password, admin only) |
| AI | OpenAI (skill-tag suggestions, optional) |
| Deploy | Vercel (auto-deploys from `main`) |

## How it works

- `/` — public grid of project cards (title, tagline, accepted skill badges,
  live demo + GitHub links), sorted by `sort_order`.
- `/projects/[id]` — public case study: recruiter headline, problem,
  approach, outcome, key decisions, time to build.
- `/admin` — login-required dashboard to create/edit/delete projects, edit
  case studies, and review AI-suggested tags. Every write is audit-logged.
- `/login` — email + password (Supabase Auth).

Reads are public; writes require a session both at the API layer (403) and at
the database layer (RLS: `auth.uid() = user_id`).

## Add a project

1. Log in at `/login`, then `/admin` → **+ Add Project**.
2. Fill in title + tagline (required), the case-study fields (problem /
   approach / outcome), links, status, and sort order → **Create project**.
   It appears on `/` immediately.
3. If a description is present and `OPENAI_API_KEY` is set, skill tags are
   suggested automatically. Review them under **Tags** — only *accepted* tags
   show publicly. Without the key, the project still saves; add tags via the
   Tags page's re-suggest button later or manage them in Supabase.
4. Add the recruiter headline / key decisions / time-to-build under
   **Case study**.

## Develop locally

```bash
npm install
npx vercel link && npx vercel env pull .env.local   # Supabase keys
npm run dev
```

## Deploy

Deploy by git only — Vercel auto-deploys every push to `main`:

```bash
git add -A && git commit -m "…" && git push
```

Do **not** use `vercel deploy` with local files; it desyncs from git.

## Database

Schema lives in `supabase/migrations/` (`0001_init.sql` applied at
provisioning; `0002_lockdown.sql` adds owner-scoped RLS). To change the
schema, add a new numbered migration and run it in the Supabase SQL editor —
never edit an applied migration.

## Environment variables (Vercel)

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public, RLS-guarded) |
| `NEXT_PUBLIC_APP_URL` | Canonical site URL (OG tags) |
| `OPENAI_API_KEY` | Optional — enables AI tag suggestions |
