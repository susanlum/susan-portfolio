# Data Model

## projects
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | gen_random_uuid() |
| user_id | uuid nullable | owner (set at lock-down sprint) |
| created_at | timestamptz | default now() |
| title | text | required |
| tagline | text | one-line recruiter hook, required |
| description | text | internal notes |
| problem | text | case study section |
| approach | text | case study section |
| outcome | text | case study section |
| live_url | text | external demo link |
| github_url | text | repo link |
| cover_image_url | text | card thumbnail |
| status | text | shipped / in-progress / concept |
| sort_order | integer | controls card order on landing |

## skills
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| created_at | timestamptz | |
| project_id | uuid FK → projects | cascade delete |
| tag | text | e.g. "Next.js", "OpenAI" |
| tag_source | text | "manual" or "openai" |
| tag_confidence | numeric | 0–1 (AI fields only) |
| tag_review_status | text | unreviewed / accepted / rejected |

## case_studies
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| created_at | timestamptz | |
| project_id | uuid FK → projects | cascade delete |
| summary | text | AI-generated or manual |
| summary_source | text | "manual" or "openai" |
| summary_confidence | numeric | 0–1 |
| summary_review_status | text | unreviewed / accepted / rejected |
| recruiter_headline | text | bold hook at top of case study |
| time_to_build | text | e.g. "5 days" |
| key_decisions | text | trade-offs Susan made |

## audit_logs
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| created_at | timestamptz | |
| action | text | create / update / delete / tag_accepted |
| object_type | text | projects / skills / case_studies |
| object_id | uuid | the affected row |
| payload | jsonb | before/after diff |

## RLS
- v1: all tables public read + write (demo-first)
- Sprint 5: reads stay public; writes scoped to `auth.uid() = user_id`
