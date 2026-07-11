import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CaseStudyForm } from "@/app/admin/[id]/case-study/CaseStudyForm";
import type { CaseStudy, Project } from "@/lib/types";

export default async function CaseStudyEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: caseStudy }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("case_studies").select("*").eq("project_id", id).maybeSingle(),
  ]);

  if (!project) notFound();

  const p = project as Project;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">
        Case Study — {p.title}
      </h1>
      <p className="mt-1 mb-8 text-sm text-neutral-600">
        Problem, approach, and outcome are edited on the{" "}
        <Link href={`/admin/${p.id}/edit`} className="text-blue-600 hover:underline">
          project form
        </Link>
        . This page covers the recruiter-facing extras.
      </p>
      <CaseStudyForm projectId={p.id} caseStudy={caseStudy as CaseStudy | null} />
    </main>
  );
}
