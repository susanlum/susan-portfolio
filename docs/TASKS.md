# Tasks

## Sprint 1 — Database & Project Cards Live
**Goal:** Seed data visible on landing page. No login required.

- [ ] Run migration SQL in Supabase (projects, skills, case_studies, audit_logs)
- [ ] Confirm 3 seed projects + skills + case studies visible in Supabase table editor
- [ ] Scaffold Next.js 14 app with Tailwind
- [ ] Build `/` page: fetch projects + accepted skills, render card grid
- [ ] Card component: title, tagline, tech badges, live link, GitHub link, cover image
- [ ] Handle loading skeleton, empty state ("No projects yet"), and fetch error state
- [ ] Deploy to Vercel — confirm live URL shows seed cards

**Definition of Done:** Deployed URL shows 3 project cards from real Supabase data. Empty and error states render. No console errors.

---

## Sprint 2 — Core Engine: Add / Edit / Delete Projects
**Goal:** Susan can manage projects end-to-end from the browser.

- [ ] Build `/admin` page with project list + "Add Project" button
- [ ] Project form: title, tagline, description, problem, approach, outcome, live_url, github_url, status, sort_order
- [ ] POST `/api/projects` → insert into Supabase → redirect to admin list
- [ ] PATCH `/api/projects/[id]` → update row → confirm change reflected
- [ ] DELETE `/api/projects/[id]` → confirmation modal → delete row + cascade
- [ ] Write audit_log row for every create / update / delete
- [ ] Form validation: required fields, URL format check
- [ ] Error state if API call fails; success toast on completion

**Definition of Done:** Create a project → it appears on `/`. Edit it → card updates. Delete it → card gone. Audit log has 3 rows. Form rejects missing title.

---

## Sprint 3 — Case Study Detail Pages ✅ v1 functional milestone
**Goal:** Full recruiter journey works end-to-end.

- [ ] Build `/projects/[id]` page: fetch project + case_study row
- [ ] Render sections: recruiter headline, problem, approach, outcome, time_to_build, key_decisions
- [ ] Live demo CTA button + GitHub link
- [ ] Loading skeleton, empty state ("Case study coming soon"), error state
- [ ] Link from project card → detail page
- [ ] Admin form: add/edit case study fields for a project
- [ ] Confirm all 3 seed projects have browsable case study pages

**Definition of Done:** Recruiter opens `/`, clicks a card, reads the full case study, clicks live demo link — all without a login prompt. Susan can add a case study via admin. This is the v1 functional milestone.

---

## Sprint 4 — AI Skill Tag Suggestions
**Goal:** Description → auto-suggested tags → Susan reviews → public badges.

- [ ] POST `/api/suggest-tags`: call OpenAI, parse structured tag list, write to `skills` with `review_status = 'unreviewed'`
- [ ] Trigger tag suggestion on project create and on explicit "Re-suggest" button
- [ ] Admin tag review UI: list unreviewed tags with confidence score; Accept / Reject buttons
- [ ] PATCH `/api/skills/[id]` → update `tag_review_status`; write audit log
- [ ] Only `accepted` tags render on public card and detail page
- [ ] Graceful fallback: if OpenAI call fails, project saves normally; show "AI unavailable" notice in admin

**Definition of Done:** Create a project with a description → unreviewed tags appear in admin → accept 2, reject 1 → only 2 badges show publicly → audit log has accept/reject entries.

---

## Sprint 5 — Lock It Down
**Goal:** Writes are protected; reads remain public.

- [ ] Enable Supabase Auth; create Susan's account
- [ ] Replace permissive write RLS policies with `auth.uid() = user_id` on projects, skills, case_studies
- [ ] Set `user_id` on all existing rows to Susan's auth UID
- [ ] Add auth middleware: `/admin/*` routes require active session
- [ ] Login page at `/login` (email + password)
- [ ] Logout button in admin nav
- [ ] Confirm public `/` and `/projects/[id]` still load for anonymous visitors
- [ ] Confirm anonymous POST to `/api/projects` returns 403

**Definition of Done:** Unauthenticated user cannot create/edit/delete via API or UI. Public pages load without login. Susan can log in and manage projects.

---

## Sprint 6 — Polish & Deploy
**Goal:** Production-ready, shareable with recruiters.

- [ ] Responsive layout — mobile and desktop
- [ ] Open Graph meta tags per project (title, description, image)
- [ ] Favicon and site title
- [ ] Smooth hover states and transitions on cards
- [ ] Smoke test all actions on production Vercel URL
- [ ] README: how to add a project, how to deploy

**Definition of Done:** Site loads cleanly on mobile. Sharing a project URL in Slack shows correct OG preview. All sprint test steps pass on the live URL.

---

## Gantt (which sprint each feature lands)
```
Sprint 1  |---[DB + seed + landing page + deploy]---|
Sprint 2  |---[admin CRUD + audit log]--------------|
Sprint 3  |---[case study pages] ← v1 functional----|
Sprint 4  |---[AI tag suggestions + review]----------|
Sprint 5  |---[auth + RLS lock-down]----------------|
Sprint 6  |---[polish + OG + README]----------------|
```
