# Architecture

## Stack
| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Database | Supabase (Postgres + RLS) |
| Auth (Sprint 5) | Supabase Auth (email/password) |
| AI | OpenAI API (skill-tag suggestions) |
| Hosting | Vercel |

## Now vs Later (in feature terms)
**Now:** project cards, case study pages, admin CRUD, AI skill tags (reviewable)  
**Later:** contact form, view counters, AI case-study drafts, analytics

## Key User Action — Recruiter Browses a Project
1. Browser hits `/` → Next.js fetches `projects` + accepted `skills` from Supabase
2. Project grid renders (cards sorted by `sort_order`)
3. Recruiter clicks a card → navigates to `/projects/[id]`
4. Page fetches `project` + `case_study` rows → renders problem / approach / outcome
5. Recruiter clicks live demo link → opens external URL

## Key User Action — Susan Adds a Project
1. Susan opens `/admin` → fills project form → submits
2. Next.js API route validates input → inserts row into `projects`
3. API calls OpenAI → stores suggested skill tags with `review_status = 'unreviewed'`
4. Susan reviews tags in admin → accepts/rejects → accepted tags become public
5. Audit log row written for every state change

## Why It Works Without AI
All project data is stored directly in Postgres. If the OpenAI call fails, the project saves anyway; Susan enters tags manually. AI is an accelerator, not a dependency.
