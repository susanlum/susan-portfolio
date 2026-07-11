# Intelligence Layer

## Messy Input
Susan writes a free-text project description ("I built a meal planner using GPT-4 and Supabase that generates a weekly plan from dietary prefs").

## Auto-Structure Output
On project save, call OpenAI and parse a structured response:
```json
{
  "suggested_tags": [
    { "tag": "Next.js", "confidence": 0.97 },
    { "tag": "OpenAI GPT-4", "confidence": 0.95 },
    { "tag": "Supabase", "confidence": 0.91 }
  ],
  "one_line_summary": "AI-powered weekly meal planner built with GPT-4 and Supabase."
}
```
Each tag stored as a `skills` row with `tag_source = 'openai'`, `tag_review_status = 'unreviewed'`.

## Events to Track
- Project created / edited
- Tag suggestion generated (log confidence scores)
- Tag accepted or rejected by Susan
- Case study viewed (future)

## Scoring Rules (v1 — rule-based)
- `confidence >= 0.85` → highlight as strong suggestion in admin UI
- `confidence < 0.6` → flag as uncertain, prompt Susan to verify
- Tags rejected by Susan are excluded from future prompts for that project

## What Gets Ranked
- Skill tags by confidence (high confidence shown first in review queue)
- Projects by `sort_order` (Susan controls manually)

## v1 vs Later
- **v1:** tag suggestion + review flow
- **Later:** AI drafts full case study from bullet points; ranks projects by likely recruiter interest
