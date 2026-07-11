export type SuggestedTag = { tag: string; confidence: number };

type RawTag = { tag?: unknown; confidence?: unknown };

export async function suggestSkillTags(
  description: string,
): Promise<SuggestedTag[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || !description.trim()) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'Extract technology/skill tags from a project description. Respond with strict JSON: {"tags":[{"tag":string,"confidence":number}]}. confidence is 0-1. Suggest 3-6 specific tags (frameworks, languages, APIs, techniques). No commentary.',
          },
          { role: "user", content: description },
        ],
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string") return null;

    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed.tags)) return null;

    return (parsed.tags as RawTag[])
      .filter((t): t is { tag: string; confidence?: number } => typeof t.tag === "string")
      .map((t) => ({
        tag: t.tag,
        confidence: typeof t.confidence === "number" ? t.confidence : 0.5,
      }));
  } catch {
    return null;
  }
}
