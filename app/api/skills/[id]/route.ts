import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit";

const VALID_STATUSES = ["accepted", "rejected"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { tag_review_status } = await request.json();

  if (!VALID_STATUSES.includes(tag_review_status)) {
    return NextResponse.json({ error: "invalid tag_review_status" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: before } = await supabase
    .from("skills")
    .select("*")
    .eq("id", id)
    .single();

  const { data, error } = await supabase
    .from("skills")
    .update({ tag_review_status })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Failed to update tag" },
      { status: 500 },
    );
  }

  await writeAuditLog(supabase, {
    action: tag_review_status === "accepted" ? "tag_accepted" : "tag_rejected",
    object_type: "skills",
    object_id: id,
    payload: { before, after: data },
  });

  return NextResponse.json({ skill: data });
}
