export type ProjectInput = {
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

const VALID_STATUSES = ["shipped", "in-progress", "concept"];

function isValidUrl(value: string) {
  if (!value) return true;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function validateProjectInput(input: Partial<ProjectInput>) {
  const errors: Record<string, string> = {};

  if (!input.title || !input.title.trim()) {
    errors.title = "Title is required";
  }
  if (!input.tagline || !input.tagline.trim()) {
    errors.tagline = "Tagline is required";
  }
  if (input.status && !VALID_STATUSES.includes(input.status)) {
    errors.status = "Status must be shipped, in-progress, or concept";
  }
  if (input.live_url && !isValidUrl(input.live_url)) {
    errors.live_url = "Live URL must be a valid URL";
  }
  if (input.github_url && !isValidUrl(input.github_url)) {
    errors.github_url = "GitHub URL must be a valid URL";
  }
  if (input.cover_image_url && !isValidUrl(input.cover_image_url)) {
    errors.cover_image_url = "Cover image URL must be a valid URL";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
