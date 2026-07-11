import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CaseStudy, Project, Skill } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("title, tagline, cover_image_url")
    .eq("id", id)
    .maybeSingle();

  if (!data) return { title: "Project not found" };

  return {
    title: `${data.title} — Susan Lum`,
    description: data.tagline,
    openGraph: {
      title: data.title,
      description: data.tagline,
      type: "article",
      ...(data.cover_image_url ? { images: [data.cover_image_url] } : {}),
    },
    twitter: {
      card: data.cover_image_url ? "summary_large_image" : "summary",
      title: data.title,
      description: data.tagline,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [projectRes, caseStudyRes, skillsRes] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("case_studies").select("*").eq("project_id", id).maybeSingle(),
    supabase.from("skills").select("*").eq("project_id", id).eq("tag_review_status", "accepted"),
  ]);

  if (projectRes.error || !projectRes.data) {
    if (projectRes.error?.code === "PGRST116") notFound();
    return (
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn&apos;t load this project right now. Please try again shortly.
        </div>
      </main>
    );
  }

  const project = projectRes.data as Project;
  const caseStudy = caseStudyRes.data as CaseStudy | null;
  const skills = (skillsRes.data ?? []) as Skill[];

  const hasCaseStudyContent =
    project.problem || project.approach || project.outcome || caseStudy;

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← All projects
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {project.title}
        </h1>
        <p className="mt-2 text-lg text-neutral-600">{project.tagline}</p>

        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700"
              >
                {skill.tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-4">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              View live demo →
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-neutral-600 hover:underline"
            >
              View on GitHub
            </a>
          )}
        </div>
      </div>

      {!hasCaseStudyContent && (
        <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
          Case study coming soon.
        </div>
      )}

      {hasCaseStudyContent && (
        <div className="space-y-8">
          {caseStudy?.recruiter_headline && (
            <p className="rounded-lg bg-neutral-100 p-4 text-lg font-semibold text-neutral-900">
              {caseStudy.recruiter_headline}
            </p>
          )}

          {caseStudy?.summary && (
            <p className="text-neutral-700">{caseStudy.summary}</p>
          )}

          {project.problem && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Problem
              </h2>
              <p className="mt-2 whitespace-pre-line text-neutral-800">
                {project.problem}
              </p>
            </section>
          )}

          {project.approach && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Approach
              </h2>
              <p className="mt-2 whitespace-pre-line text-neutral-800">
                {project.approach}
              </p>
            </section>
          )}

          {project.outcome && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Outcome
              </h2>
              <p className="mt-2 whitespace-pre-line text-neutral-800">
                {project.outcome}
              </p>
            </section>
          )}

          {caseStudy?.key_decisions && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Key decisions
              </h2>
              <p className="mt-2 whitespace-pre-line text-neutral-800">
                {caseStudy.key_decisions}
              </p>
            </section>
          )}

          {caseStudy?.time_to_build && (
            <p className="text-sm text-neutral-500">
              Time to build: {caseStudy.time_to_build}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
