import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { suggestSkillTags } from "@/lib/openai";

export async function POST(request: Request) {
  const { project_id } = await request.json();

  if (!project_id) {
    return NextResponse.json({ ok: false, reason: "missing_project_id" }, { status: 400 });
  }

  const supabase = await createClient();

  const user = await getSessionUser(supabase);
  if (!user) {
    return NextResponse.json(
      { ok: false, reason: "unauthorized" },
      { status: 403 },
    );
  }

  const { data: project } = await supabase
    .from("projects")
    .select("title, tagline, description")
    .eq("id", project_id)
    .single();

  if (!project) {
    return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
  }

  const descriptionText = [project.title, project.tagline, project.description]
    .filter(Boolean)
    .join(". ");

  const suggestions = await suggestSkillTags(descriptionText);

  if (!suggestions) {
    return NextResponse.json({ ok: false, reason: "ai_unavailable" });
  }

  const rows = suggestions.map((t) => ({
    user_id: user.id,
    project_id,
    tag: t.tag,
    tag_source: "openai" as const,
    tag_confidence: t.confidence,
    tag_review_status: "unreviewed" as const,
  }));

  const { data: inserted, error } = await supabase
    .from("skills")
    .insert(rows)
    .select();

  if (error) {
    return NextResponse.json({ ok: false, reason: "db_error" });
  }

  for (const skill of inserted ?? []) {
    await writeAuditLog(supabase, {
      action: "create",
      object_type: "skills",
      object_id: skill.id,
      payload: { after: skill },
    });
  }

  return NextResponse.json({ ok: true, tags: inserted });
}
