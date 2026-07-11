"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CaseStudy } from "@/lib/types";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none";
const labelClass = "block text-sm font-medium text-neutral-800 mb-1";

export function CaseStudyForm({
  projectId,
  caseStudy,
}: {
  projectId: string;
  caseStudy: CaseStudy | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    recruiter_headline: caseStudy?.recruiter_headline ?? "",
    time_to_build: caseStudy?.time_to_build ?? "",
    key_decisions: caseStudy?.key_decisions ?? "",
    summary: caseStudy?.summary ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch(`/api/projects/${projectId}/case-study`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.errors?._form ?? "Something went wrong");
      setSubmitting(false);
      return;
    }

    router.push("/admin?msg=updated");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Recruiter headline</label>
        <input
          className={inputClass}
          placeholder="Bold one-line hook at the top of the case study"
          value={form.recruiter_headline}
          onChange={(e) =>
            setForm((f) => ({ ...f, recruiter_headline: e.target.value }))
          }
        />
      </div>

      <div>
        <label className={labelClass}>Summary</label>
        <textarea
          className={inputClass}
          rows={3}
          value={form.summary}
          onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Time to build</label>
          <input
            className={inputClass}
            placeholder="e.g. 5 days"
            value={form.time_to_build}
            onChange={(e) =>
              setForm((f) => ({ ...f, time_to_build: e.target.value }))
            }
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Key decisions</label>
        <textarea
          className={inputClass}
          rows={4}
          placeholder="Trade-offs you made and why"
          value={form.key_decisions}
          onChange={(e) =>
            setForm((f) => ({ ...f, key_decisions: e.target.value }))
          }
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save case study"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
