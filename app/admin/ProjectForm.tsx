"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@/lib/types";

type FormState = {
  title: string;
  tagline: string;
  description: string;
  problem: string;
  approach: string;
  outcome: string;
  live_url: string;
  github_url: string;
  cover_image_url: string;
  status: string;
  sort_order: number;
};

function toFormState(project?: Project): FormState {
  return {
    title: project?.title ?? "",
    tagline: project?.tagline ?? "",
    description: project?.description ?? "",
    problem: project?.problem ?? "",
    approach: project?.approach ?? "",
    outcome: project?.outcome ?? "",
    live_url: project?.live_url ?? "",
    github_url: project?.github_url ?? "",
    cover_image_url: project?.cover_image_url ?? "",
    status: project?.status ?? "shipped",
    sort_order: project?.sort_order ?? 0,
  };
}

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none";
const labelClass = "block text-sm font-medium text-neutral-800 mb-1";

export function ProjectForm({ project }: { project?: Project }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(toFormState(project));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isEdit = Boolean(project);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    const res = await fetch(
      isEdit ? `/api/projects/${project!.id}` : "/api/projects",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors ?? { _form: "Something went wrong" });
      setSubmitting(false);
      return;
    }

    if (!isEdit && form.description.trim()) {
      fetch("/api/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: data.project.id }),
      }).catch(() => {});
    }

    router.push(`/admin?msg=${isEdit ? "updated" : "created"}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors._form && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Title *</label>
          <input
            className={inputClass}
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Tagline *</label>
          <input
            className={inputClass}
            value={form.tagline}
            onChange={(e) => update("tagline", e.target.value)}
          />
          {errors.tagline && (
            <p className="mt-1 text-xs text-red-600">{errors.tagline}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Description (internal notes)</label>
        <textarea
          className={inputClass}
          rows={2}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Problem</label>
          <textarea
            className={inputClass}
            rows={3}
            value={form.problem}
            onChange={(e) => update("problem", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Approach</label>
          <textarea
            className={inputClass}
            rows={3}
            value={form.approach}
            onChange={(e) => update("approach", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Outcome</label>
          <textarea
            className={inputClass}
            rows={3}
            value={form.outcome}
            onChange={(e) => update("outcome", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Live URL</label>
          <input
            className={inputClass}
            placeholder="https://..."
            value={form.live_url}
            onChange={(e) => update("live_url", e.target.value)}
          />
          {errors.live_url && (
            <p className="mt-1 text-xs text-red-600">{errors.live_url}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>GitHub URL</label>
          <input
            className={inputClass}
            placeholder="https://github.com/..."
            value={form.github_url}
            onChange={(e) => update("github_url", e.target.value)}
          />
          {errors.github_url && (
            <p className="mt-1 text-xs text-red-600">{errors.github_url}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>Cover image URL</label>
        <input
          className={inputClass}
          placeholder="https://..."
          value={form.cover_image_url}
          onChange={(e) => update("cover_image_url", e.target.value)}
        />
        {errors.cover_image_url && (
          <p className="mt-1 text-xs text-red-600">{errors.cover_image_url}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Status</label>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="shipped">shipped</option>
            <option value="in-progress">in-progress</option>
            <option value="concept">concept</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Sort order</label>
          <input
            type="number"
            className={inputClass}
            value={form.sort_order}
            onChange={(e) => update("sort_order", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Create project"}
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
