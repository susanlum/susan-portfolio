import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";
import { DeleteProjectButton } from "@/app/admin/DeleteProjectButton";
import { Toast } from "@/app/admin/Toast";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string }>;
}) {
  const { msg } = await searchParams;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  const projects = (data ?? []) as Project[];

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Admin</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Manage projects, case studies, and skill tags.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-neutral-500 hover:underline">
            View site
          </Link>
          <Link
            href="/admin/new"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            + Add Project
          </Link>
        </div>
      </div>

      <Toast msg={msg} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Couldn&apos;t load projects: {error.message}
        </div>
      )}

      {!error && projects.length === 0 && (
        <div className="rounded-lg border border-dashed border-neutral-300 p-12 text-center text-neutral-500">
          No projects yet.{" "}
          <Link href="/admin/new" className="text-blue-600 hover:underline">
            Add your first one
          </Link>
          .
        </div>
      )}

      {!error && projects.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-600">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Sort</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-neutral-900">
                      {project.title}
                    </div>
                    <div className="text-neutral-500">{project.tagline}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{project.status}</td>
                  <td className="px-4 py-3 text-neutral-600">{project.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/${project.id}/edit`}
                        className="text-sm font-medium text-neutral-700 hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/admin/${project.id}/case-study`}
                        className="text-sm font-medium text-neutral-700 hover:underline"
                      >
                        Case study
                      </Link>
                      <Link
                        href={`/admin/${project.id}/tags`}
                        className="text-sm font-medium text-neutral-700 hover:underline"
                      >
                        Tags
                      </Link>
                      <DeleteProjectButton
                        projectId={project.id}
                        projectTitle={project.title}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
