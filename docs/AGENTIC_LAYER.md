# Agentic Layer

## Risk Levels & Actions

### Low — Auto-execute (no approval needed)
| Action | Trigger | Tool |
|---|---|---|
| Suggest skill tags | Project saved | `suggest_skill_tags(project_id)` |
| Generate one-line summary | Project saved | `generate_summary(project_id)` |

### Medium — Susan reviews before applying
| Action | Trigger | Tool |
|---|---|---|
| Accept/reject tag | Susan clicks in admin | `update_tag_status(skill_id, status)` |
| Publish suggested summary | Susan approves | `accept_summary(case_study_id)` |

### High — Explicit confirmation required
| Action | Tool |
|---|---|
| Delete a project (cascades to skills + case study) | `delete_project(project_id)` — confirmation modal required |

### Critical — Human only, no agent
- Changing RLS policies
- Modifying auth settings
- Any bulk delete

## Approved Named Tools (v1)
- `suggest_skill_tags` — calls OpenAI, writes to `skills`
- `generate_summary` — calls OpenAI, writes to `case_studies`
- `update_tag_status` — updates `tag_review_status` in `skills`
- `accept_summary` — sets `summary_review_status = accepted` in `case_studies`
- `delete_project` — hard delete with audit log entry

## Audit Log Fields (every action)
`action`, `object_type`, `object_id`, `user_id`, `payload (before/after)`, `created_at`

## v1 vs Later
- **v1:** tag suggestion + summary generation + review UI
- **Later:** auto-draft full case study; suggest sort order; email Susan when a new tag pattern appears
