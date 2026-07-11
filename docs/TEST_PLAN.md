# Test Plan

## v1 Success Scenario (manual, run on deployed URL)

### Recruiter Journey
1. Open the live Vercel URL as an anonymous visitor (incognito)
2. **Expect:** Project card grid loads within 2 seconds; 3+ cards visible
3. Verify each card shows: title, tagline, tech badges, live link, GitHub link
4. Click a project card
5. **Expect:** Case study detail page loads; all sections visible (headline, problem, approach, outcome)
6. Click the live demo CTA button
7. **Expect:** External URL opens in new tab; no 404
8. Press browser back; click a second project card
9. **Expect:** Different case study content renders correctly

### Susan Adds a Project
10. Navigate to `/admin` (Sprint 5: log in first)
11. Click "Add Project"; fill all required fields; submit
12. **Expect:** Redirected to admin list; new project appears
13. Open `/` in another tab — **Expect:** new card visible
14. Check Supabase `projects` table — **Expect:** new row present
15. Check `audit_logs` — **Expect:** one `create` entry for the new project

### Edit & Delete
16. Click edit on the new project; change the tagline; save
17. **Expect:** Card on `/` shows updated tagline; `audit_logs` has `update` entry
18. Click delete; confirm in modal
19. **Expect:** Card removed from `/`; row gone from Supabase; `audit_logs` has `delete` entry

## Empty & Error Cases
| Scenario | Expected UI |
|---|---|
| No projects in DB | Landing page shows "No projects yet" empty state, not a blank screen |
| Supabase fetch fails | Landing page shows "Couldn't load projects — try again" error state |
| `/projects/[bad-id]` | 404 page with link back to home |
| Admin form submitted with missing title | Inline validation error; no DB write |
| OpenAI call fails during tag suggestion | Project saves; admin shows "AI unavailable — add tags manually" |
| Unauthenticated DELETE to `/api/projects/[id]` (Sprint 5) | Returns 403; no row deleted |

## AI Tag Flow
1. Create project with description "Built a chatbot using LangChain and Pinecone for semantic search"
2. **Expect:** 2–4 unreviewed tag suggestions appear in admin (e.g. LangChain, Pinecone, Semantic Search)
3. Accept "LangChain"; reject "Semantic Search"
4. Open `/` — **Expect:** only "LangChain" badge visible; rejected tag absent
5. Check `skills` table — accepted row has `tag_review_status = accepted`
6. Check `audit_logs` — entries for `tag_accepted` and `tag_rejected`
