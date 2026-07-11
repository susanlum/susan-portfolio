"use client";

const MESSAGES: Record<string, string> = {
  created: "Project created.",
  updated: "Project updated.",
  deleted: "Project deleted.",
};

export function Toast({ msg }: { msg?: string }) {
  if (!msg || !MESSAGES[msg]) return null;

  return (
    <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {MESSAGES[msg]}
    </div>
  );
}
