create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  title text not null,
  tagline text not null,
  description text,
  problem text,
  approach text,
  outcome text,
  live_url text,
  github_url text,
  cover_image_url text,
  status text not null default 'shipped',
  sort_order integer not null default 0
);

alter table projects enable row level security;
drop policy if exists "projects_v1_read" on projects;
create policy "projects_v1_read" on projects for select using (true);
drop policy if exists "projects_v1_write" on projects;
create policy "projects_v1_write" on projects for all using (true) with check (true);

create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  project_id uuid references projects(id) on delete cascade,
  tag text not null,
  tag_source text,
  tag_confidence numeric,
  tag_review_status text not null default 'unreviewed'
);

alter table skills enable row level security;
drop policy if exists "skills_v1_read" on skills;
create policy "skills_v1_read" on skills for select using (true);
drop policy if exists "skills_v1_write" on skills;
create policy "skills_v1_write" on skills for all using (true) with check (true);

create table if not exists case_studies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  project_id uuid references projects(id) on delete cascade,
  summary text,
  summary_source text,
  summary_confidence numeric,
  summary_review_status text not null default 'unreviewed',
  recruiter_headline text,
  time_to_build text,
  key_decisions text
);

alter table case_studies enable row level security;
drop policy if exists "case_studies_v1_read" on case_studies;
create policy "case_studies_v1_read" on case_studies for select using (true);
drop policy if exists "case_studies_v1_write" on case_studies;
create policy "case_studies_v1_write" on case_studies for all using (true) with check (true);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  created_at timestamptz not null default now(),
  action text not null,
  object_type text not null,
  object_id uuid,
  payload jsonb
);

alter table audit_logs enable row level security;
drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into projects (id, title, tagline, description, problem, approach, outcome, live_url, github_url, status, sort_order) values
  ('a1b2c3d4-0001-0001-0001-000000000001', 'AI Recipe Planner', 'Plan a week of meals in 10 seconds using GPT-4', 'A Next.js app that takes dietary preferences and generates a full weekly meal plan with shopping list.', 'Manually planning meals takes 30+ minutes and still ends in takeout.', 'Used GPT-4 to generate structured meal plans; stored results in Supabase; built a clean card-based UI.', 'App live in 5 days. Used in demo for 3 job interviews — generated real recruiter interest.', 'https://recipe-planner.vercel.app', 'https://github.com/susan/recipe-planner', 'shipped', 1),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Expense Tracker Pro', 'Log and categorise expenses with one photo', 'A mobile-friendly PWA that reads receipt photos via OCR and auto-categorises spend.', 'Keeping receipts is painful; manual entry is error-prone.', 'Used Tesseract.js for OCR, rule-based categorisation, Supabase for storage, Recharts for spend graphs.', 'Tracks $2k+ in personal spend per month. Zero missed receipts since launch.', 'https://expense-tracker-pro.vercel.app', 'https://github.com/susan/expense-tracker', 'shipped', 2),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Job Hunt CRM', 'Never lose track of a job application again', 'A Kanban-style board to track job applications, follow-ups, and interview stages.', 'Spreadsheets break down past 20 applications; follow-up dates get missed.', 'Built a drag-and-drop board with status columns, deadline reminders, and note threads per role.', 'Used personally to land current role. 47 applications tracked, 6 interviews scheduled on time.', 'https://job-hunt-crm.vercel.app', 'https://github.com/susan/job-hunt-crm', 'shipped', 3);

insert into skills (project_id, tag, tag_source, tag_confidence, tag_review_status) values
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Next.js', 'manual', 1.0, 'accepted'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 'OpenAI GPT-4', 'manual', 1.0, 'accepted'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Supabase', 'manual', 1.0, 'accepted'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'TypeScript', 'manual', 1.0, 'accepted'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'OCR / Tesseract.js', 'manual', 1.0, 'accepted'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Recharts', 'manual', 1.0, 'accepted'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'React', 'manual', 1.0, 'accepted'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Drag-and-Drop (dnd-kit)', 'manual', 1.0, 'accepted'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Supabase', 'manual', 1.0, 'accepted');

insert into case_studies (project_id, summary, summary_source, summary_confidence, summary_review_status, recruiter_headline, time_to_build, key_decisions) values
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Built an end-to-end AI meal planner from idea to deployed app in 5 days, integrating GPT-4, Supabase, and a polished Next.js UI.', 'manual', 1.0, 'accepted', 'Shipped a full-stack AI product solo in one week', '5 days', 'Chose GPT-4 structured output over free-form text to keep meal data queryable; used Supabase RLS for future multi-user support.'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Designed and shipped a receipt-scanning expense tracker as a PWA, solving a real personal pain point with OCR and automatic categorisation.', 'manual', 1.0, 'accepted', 'Turned a real pain point into a live, working app', '8 days', 'Client-side OCR kept costs at zero; rule-based categorisation before ML kept the logic auditable.'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Built a personal job-hunt CRM with Kanban board, deadline tracking, and note threads — used it to land a job.', 'manual', 1.0, 'accepted', 'Built the tool that got me hired', '6 days', 'Started with a simple list view and added drag-and-drop only after the core CRUD was solid.');