import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuditAction, AuditObjectType } from "@/lib/types";

export async function writeAuditLog(
  supabase: SupabaseClient,
  entry: {
    action: AuditAction;
    object_type: AuditObjectType;
    object_id: string;
    payload?: unknown;
  },
) {
  const { error } = await supabase.from("audit_logs").insert({
    action: entry.action,
    object_type: entry.object_type,
    object_id: entry.object_id,
    payload: entry.payload ?? null,
  });

  if (error) {
    console.error("audit_log insert failed", error);
  }
}
