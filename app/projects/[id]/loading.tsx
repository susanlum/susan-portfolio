export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="h-4 w-24 animate-pulse rounded bg-neutral-200" />
      <div className="mt-6 h-9 w-2/3 animate-pulse rounded bg-neutral-200" />
      <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-neutral-200" />
      <div className="mt-8 space-y-3">
        <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
      </div>
    </main>
  );
}
