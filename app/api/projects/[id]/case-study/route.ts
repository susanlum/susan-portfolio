import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: projectId } = await params;
  const body = await request.json();

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("case_studies")
    .select("*")
    .eq("project_id", projectId)
    .maybeSingle();

  const fields = {
    project_id: projectId,
    summary: body.summary || null,
    summary_source: "manual" as const,
    summary_confidence: existing ? existing.summary_confidence : null,
    summary_review_status: "accepted" as const,
    recruiter_headline: body.recruiter_headline || null,
    time_to_build: body.time_to_build || null,
    key_decisions: body.key_decisions || null,
  };

  if (existing) {
    const { data, error } = await supabase
      .from("case_studies")
      .update(fields)
      .eq("id", existing.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { errors: { _form: error?.message || "Failed to update case study" } },
        { status: 500 },
      );
    }

    await writeAuditLog(supabase, {
      action: "update",
      object_type: "case_studies",
      object_id: data.id,
      payload: { before: existing, after: data },
    });

    return NextResponse.json({ caseStudy: data });
  }

  const { data, error } = await supabase
    .from("case_studies")
    .insert(fields)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { errors: { _form: error?.message || "Failed to create case study" } },
      { status: 500 },
    );
  }

  await writeAuditLog(supabase, {
    action: "create",
    object_type: "case_studies",
    object_id: data.id,
    payload: { after: data },
  });

  return NextResponse.json({ caseStudy: data });
}
