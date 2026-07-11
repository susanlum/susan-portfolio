"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Skill } from "@/lib/types";

function ConfidenceBadge({ confidence }: { confidence: number | null }) {
  if (confidence === null) return null;
  const strong = confidence >= 0.85;
  const uncertain = confidence < 0.6;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        strong
          ? "bg-emerald-100 text-emerald-800"
          : uncertain
            ? "bg-amber-100 text-amber-800"
            : "bg-neutral-100 text-neutral-600"
      }`}
    >
      {Math.round(confidence * 100)}% confident
    </span>
  );
}

export function TagsPanel({
  projectId,
  initialSkills,
  hasDescription,
}: {
  projectId: string;
  initialSkills: Skill[];
  hasDescription: boolean;
}) {
  const router = useRouter();
  const [suggesting, setSuggesting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const unreviewed = initialSkills.filter((s) => s.tag_review_status === "unreviewed");
  const accepted = initialSkills.filter((s) => s.tag_review_status === "accepted");
  const rejected = initialSkills.filter((s) => s.tag_review_status === "rejected");

  async function handleSuggest() {
    setSuggesting(true);
    setNotice(null);

    const res = await fetch("/api/suggest-tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: projectId }),
    });
    const data = await res.json();

    if (!data.ok) {
      setNotice(
        data.reason === "ai_unavailable"
          ? "AI unavailable — add an OPENAI_API_KEY in Vercel env, or enter tags manually."
          : "Couldn't generate tag suggestions right now.",
      );
      setSuggesting(false);
      return;
    }

    setSuggesting(false);
    router.refresh();
  }

  async function handleReview(id: string, status: "accepted" | "rejected") {
    setBusyId(id);
    await fetch(`/api/skills/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag_review_status: status }),
    });
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={handleSuggest}
          disabled={suggesting || !hasDescription}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {suggesting ? "Suggesting…" : "Re-suggest tags"}
        </button>
        {!hasDescription && (
          <p className="mt-2 text-xs text-neutral-500">
            Add a description on the project form to enable AI suggestions.
          </p>
        )}
        {notice && <p className="mt-2 text-sm text-amber-700">{notice}</p>}
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Unreviewed ({unreviewed.length})
        </h2>
        {unreviewed.length === 0 && (
          <p className="text-sm text-neutral-500">Nothing to review.</p>
        )}
        <ul className="space-y-2">
          {unreviewed
            .slice()
            .sort((a, b) => (b.tag_confidence ?? 0) - (a.tag_confidence ?? 0))
            .map((skill) => (
              <li
                key={skill.id}
                className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-neutral-900">{skill.tag}</span>
                  <ConfidenceBadge confidence={skill.tag_confidence} />
                </div>
                <div className="flex gap-3">
                  <button
                    disabled={busyId === skill.id}
                    onClick={() => handleReview(skill.id, "accepted")}
                    className="text-sm font-medium text-emerald-700 hover:underline disabled:opacity-50"
                  >
                    Accept
                  </button>
                  <button
                    disabled={busyId === skill.id}
                    onClick={() => handleReview(skill.id, "rejected")}
                    className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Public badges ({accepted.length})
        </h2>
        {accepted.length === 0 && (
          <p className="text-sm text-neutral-500">No accepted tags yet.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {accepted.map((skill) => (
            <span
              key={skill.id}
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-700"
            >
              {skill.tag}
            </span>
          ))}
        </div>
      </section>

      {rejected.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Rejected ({rejected.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {rejected.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full bg-neutral-50 px-3 py-1 text-sm text-neutral-400 line-through"
              >
                {skill.tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
