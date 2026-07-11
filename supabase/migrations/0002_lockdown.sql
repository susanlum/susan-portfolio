-- Sprint 5: lock down writes. Reads stay public; writes require the row's
-- user_id to match the authenticated user. Run AFTER creating Susan's auth
-- user (Supabase dashboard > Authentication > Add user), since the backfill
-- below assigns all existing rows to the first auth user.

-- ── Backfill ownership ────────────────────────────────────────────────────
update projects     set user_id = (select id from auth.users order by created_at limit 1) where user_id is null;
update skills       set user_id = (select id from auth.users order by created_at limit 1) where user_id is null;
update case_studies set user_id = (select id from auth.users order by created_at limit 1) where user_id is null;
update audit_logs   set user_id = (select id from auth.users order by created_at limit 1) where user_id is null;

-- ── projects ──────────────────────────────────────────────────────────────
drop policy if exists "projects_v1_write" on projects;
create policy "projects_insert_own" on projects for insert to authenticated with check (auth.uid() = user_id);
create policy "projects_update_own" on projects for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "projects_delete_own" on projects for delete to authenticated using (auth.uid() = user_id);

-- ── skills ────────────────────────────────────────────────────────────────
drop policy if exists "skills_v1_write" on skills;
create policy "skills_insert_own" on skills for insert to authenticated with check (auth.uid() = user_id);
create policy "skills_update_own" on skills for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "skills_delete_own" on skills for delete to authenticated using (auth.uid() = user_id);

-- ── case_studies ──────────────────────────────────────────────────────────
drop policy if exists "case_studies_v1_write" on case_studies;
create policy "case_studies_insert_own" on case_studies for insert to authenticated with check (auth.uid() = user_id);
create policy "case_studies_update_own" on case_studies for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "case_studies_delete_own" on case_studies for delete to authenticated using (auth.uid() = user_id);

-- ── audit_logs: append-only ───────────────────────────────────────────────
-- No update/delete policies at all; authenticated users can only insert
-- their own rows.
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_insert_own" on audit_logs for insert to authenticated with check (auth.uid() = user_id);
