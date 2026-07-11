import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { writeAuditLog } from "@/lib/audit";
import { validateProjectInput } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { valid, errors } = validateProjectInput(body);

  if (!valid) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const supabase = await createClient();

  const user = await getSessionUser(supabase);
  if (!user) {
    return NextResponse.json(
      { errors: { _form: "Log in to manage projects" } },
      { status: 403 },
    );
  }

  const { data: before } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("projects")
    .update({
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
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { errors: { _form: error?.message || "Failed to update project" } },
      { status: 500 },
    );
  }

  await writeAuditLog(supabase, {
    action: "update",
    object_type: "projects",
    object_id: id,
    payload: { before, after: data },
  });

  return NextResponse.json({ project: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createClient();

  const user = await getSessionUser(supabase);
  if (!user) {
    return NextResponse.json(
      { errors: { _form: "Log in to manage projects" } },
      { status: 403 },
    );
  }

  const { data: before } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { errors: { _form: error.message } },
      { status: 500 },
    );
  }

  await writeAuditLog(supabase, {
    action: "delete",
    object_type: "projects",
    object_id: id,
    payload: { before },
  });

  return NextResponse.json({ ok: true });
}
