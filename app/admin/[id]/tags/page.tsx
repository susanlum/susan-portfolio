import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TagsPanel } from "@/app/admin/[id]/tags/TagsPanel";
import type { Project, Skill } from "@/lib/types";

export default async function TagsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: skills }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("skills").select("*").eq("project_id", id),
  ]);

  if (!project) notFound();

  const p = project as Project;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">
        Skill Tags — {p.title}
      </h1>
      <p className="mt-1 mb-8 text-sm text-neutral-600">
        Only accepted tags show up as public badges on{" "}
        <Link href="/" className="text-blue-600 hover:underline">
          the site
        </Link>
        .
      </p>
      <TagsPanel
        projectId={p.id}
        initialSkills={(skills ?? []) as Skill[]}
        hasDescription={Boolean(p.description?.trim())}
      />
    </main>
  );
}
