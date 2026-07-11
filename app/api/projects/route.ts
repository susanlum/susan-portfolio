import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit";
import { validateProjectInput } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const { valid, errors } = validateProjectInput(body);

  if (!valid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: body.title.trim(),
      tagline: body.tagline.trim(),
      description: body.description || null,
      problem: body.problem || null,
      approach: body.approach || null,
      outcome: body.outcome || null,
      live_url: body.live_url || null,
      github_url: body.github_url || null,
      cover_image_url: body.cover_image_url || null,
      status: body.status || "shipped",
      sort_order: Number.isFinite(body.sort_order) ? body.sort_order : 0,
    })
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { errors: { _form: error?.message || "Failed to create project" } },
      { status: 500 },
    );
  }

  await writeAuditLog(supabase, {
    action: "create",
    object_type: "projects",
    object_id: data.id,
    payload: { after: data },
  });

  return NextResponse.json({ project: data }, { status: 201 });
}
