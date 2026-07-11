export type ProjectStatus = "shipped" | "in-progress" | "concept";

export type Project = {
  id: string;
  user_id: string | null;
  created_at: string;
  title: string;
  tagline: string;
  description: string | null;
  problem: string | null;
  approach: string | null;
  outcome: string | null;
  live_url: string | null;
  github_url: string | null;
  cover_image_url: string | null;
  status: ProjectStatus;
  sort_order: number;
};

export type TagSource = "manual" | "openai";
export type ReviewStatus = "unreviewed" | "accepted" | "rejected";

export type Skill = {
  id: string;
  user_id: string | null;
  created_at: string;
  project_id: string;
  tag: string;
  tag_source: TagSource | null;
  tag_confidence: number | null;
  tag_review_status: ReviewStatus;
};

export type CaseStudy = {
  id: string;
  user_id: string | null;
  created_at: string;
  project_id: string;
  summary: string | null;
  summary_source: TagSource | null;
  summary_confidence: number | null;
  summary_review_status: ReviewStatus;
  recruiter_headline: string | null;
  time_to_build: string | null;
  key_decisions: string | null;
};

export type AuditAction = "create" | "update" | "delete" | "tag_accepted" | "tag_rejected";
export type AuditObjectType = "projects" | "skills" | "case_studies";

export type AuditLog = {
  id: string;
  user_id: string | null;
  created_at: string;
  action: AuditAction;
  object_type: AuditObjectType;
  object_id: string;
  payload: unknown;
};
