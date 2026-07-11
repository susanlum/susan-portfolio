import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/app/components/ProjectCard";
import type { Project, Skill } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();

  const [projectsRes, skillsRes] = await Promise.all([
    supabase.from("projects").select("*").order("sort_order", { ascending: true }),
    supabase.from("skills").select("*").eq("tag_review_status", "accepted"),
  ]);

  const fetchError = projectsRes.error || skillsRes.error;

  const projects = (projectsRes.data ?? []) as Project[];
  const skills = (skillsRes.data ?? []) as Skill[];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Susan Lum
          </h1>
          <p className="mt-1 text-neutral-600">
            Projects I&apos;ve shipped — live demos, case studies, and the tech behind them.
          </p>
        </div>
        <Link
          href="/admin"
          className="shrink-0 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Admin
        </Link>
      </div>

      {fetchError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn&apos;t load projects right now. Please refresh, or try again shortly.
        </div>
      )}

      {!fetchError && projects.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
          No projects yet. Add your first one from{" "}
          <Link href="/admin" className="text-blue-600 hover:underline">
            /admin
          </Link>
          .
        </div>
      )}

      {!fetchError && projects.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              skills={skills.filter((s) => s.project_id === project.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
