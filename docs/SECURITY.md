# Security

## Secret Handling
- `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` live only in Vercel environment variables and Next.js API routes — never in client-side code or `.env` committed to the repo
- Frontend uses only the `SUPABASE_ANON_KEY` (public, safe to expose)
- All AI calls go through a Next.js API route (`/api/suggest-tags`), not directly from the browser

## Permission Model
| Phase | Reads | Writes |
|---|---|---|
| v1 (demo) | Public — anyone can read | Public — permissive RLS for demo |
| Sprint 5 (lock-down) | Public — anyone can read | `auth.uid() = user_id` only |

Susan is the only write user. No multi-tenant, no team roles in v1.

## Approved-Tools Rule
AI actions use only the named tools listed in AGENTIC_LAYER.md. No `run_any`, no `exec_sql`, no raw API calls from the client. Every tool call is server-side and logged.

## Audit Principle
Every create / update / delete / AI action writes a row to `audit_logs` before the operation completes. If the operation fails, the log entry records the failure. Logs are append-only (no delete policy on `audit_logs`).

## Pre-Launch Checklist (Sprint 5)
- [ ] Confirm no secrets in browser network tab
- [ ] RLS policies updated — anon cannot write
- [ ] `/admin` returns 401 for unauthenticated requests
- [ ] Audit log has an entry for every test action
