# PRD — Susan's Portfolio

## Problem
Susan needs a live, working app she can show recruiters in 30 seconds that proves she can ship real products — not just slides or GitHub repos.

## Target User
**Primary:** Recruiters and hiring managers evaluating Susan for engineering / AI product roles.  
**Secondary:** Susan, adding new projects and case studies after each build.

## Core Objects
| Object | Purpose |
|---|---|
| **Project** | One shipped app — title, tagline, links, cover image, status |
| **Skill Tag** | Tech/skill badge on a project (AI-suggested or manual) |
| **Case Study** | Problem → Approach → Outcome write-up for a project |
| **Audit Log** | Record of every create / update / delete action |

## MVP Must-Haves (v1)
- [ ] Landing page: grid of project cards — no login required for visitors
- [ ] Each card shows title, tagline, tech badges, live link, GitHub link
- [ ] Project detail page with full case study (problem / approach / outcome)
- [ ] Admin form: create, edit, delete a project
- [ ] AI skill-tag suggestions (reviewable before shown publicly)
- [ ] All writes persist to Supabase; UI reflects changes without refresh

## Non-Goals (v1)
- Multi-user / team access
- Contact / enquiry form
- Analytics or view tracking
- Resume PDF export

## Success Criteria
> A recruiter opens the live URL, browses three project cards, clicks into one case study, reads the problem/outcome, and clicks the live demo link — all within 30 seconds, with no login prompt. Susan adds a fourth project via /admin and it appears on the landing page immediately.

**Definition of Done:** The above scenario passes on the deployed Vercel URL against real Supabase data. Every button persists to the database. No dead buttons, no seed-only screens.
