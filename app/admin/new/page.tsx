import { ProjectForm } from "@/app/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-bold text-neutral-900">Add Project</h1>
      <ProjectForm />
    </main>
  );
}
