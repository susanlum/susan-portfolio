import Link from "next/link";
import type { Project, Skill } from "@/lib/types";

const statusStyles: Record<string, string> = {
  shipped: "bg-emerald-100 text-emerald-800",
  "in-progress": "bg-amber-100 text-amber-800",
  concept: "bg-neutral-100 text-neutral-600",
};

export function ProjectCard({
  project,
  skills,
}: {
  project: Project;
  skills: Skill[];
}) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/projects/${project.id}`} className="block">
        <div className="aspect-video w-full overflow-hidden bg-neutral-100">
          {project.cover_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-neutral-300">
              {project.title.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/projects/${project.id}`}>
            <h3 className="text-lg font-semibold text-neutral-900 group-hover:underline">
              {project.title}
            </h3>
          </Link>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
              statusStyles[project.status] ?? statusStyles.concept
            }`}
          >
            {project.status}
          </span>
        </div>
        <p className="text-sm text-neutral-600">{project.tagline}</p>

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
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

        <div className="mt-auto flex items-center gap-4 pt-2 text-sm font-medium">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline"
            >
              Live demo →
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:underline"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
