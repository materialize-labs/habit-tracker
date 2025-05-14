-- PostgreSQL database dump
-- Supabase project dump for initial setup.
-- Operations related to public.habits and public.habit_completion are commented out
-- as these tables will be entirely reset and repopulated by subsequent migrations.

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Extensions (these are idempotent and fine to keep)
CREATE EXTENSION IF NOT EXISTS "pgsodium";
COMMENT ON SCHEMA "public" IS 'standard public schema';
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

SET default_tablespace = '';
SET default_table_access_method = "heap";

-- CREATE TABLE IF NOT EXISTS "public"."habit_completion" (
--     "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
--     "user_id" "uuid",
--     "habit_id" integer,
--     "completion_date" "date" NOT NULL
-- );
-- ALTER TABLE "public"."habit_completion" OWNER TO "postgres";

-- CREATE TABLE IF NOT EXISTS "public"."habits" (
--     "id" integer NOT NULL,
--     "name" "text" NOT NULL,
--     "created_at" timestamp without time zone DEFAULT "now"()
-- );
-- ALTER TABLE "public"."habits" OWNER TO "postgres";

-- CREATE SEQUENCE IF NOT EXISTS "public"."habits_id_seq"
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;
-- ALTER TABLE "public"."habits_id_seq" OWNER TO "postgres";
-- ALTER SEQUENCE "public"."habits_id_seq" OWNED BY "public"."habits"."id";
-- ALTER TABLE ONLY "public"."habits" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."habits_id_seq"'::"regclass");

-- -- Name: habit_completion habit_completion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
-- --
-- -- ALTER TABLE ONLY public.habit_completion
-- --     ADD CONSTRAINT "habit_completion_pkey" PRIMARY KEY ("id");
-- -- Commenting out the above line as a primary key might already exist on live,
-- -- and the subsequent migration '...160106...' will drop and recreate this table with the correct PK.

-- -- ALTER TABLE ONLY "public"."habit_completion"
-- --     ADD CONSTRAINT "habit_completion_user_id_habit_id_completion_date_key" UNIQUE ("user_id", "habit_id", "completion_date");
-- -- Commenting out: This unique constraint might already exist on live.
-- -- The subsequent migration '...160106...' drops and recreates this table with the correct unique constraint.

-- -- ALTER TABLE ONLY "public"."habits"
-- --     ADD CONSTRAINT "habits_pkey" PRIMARY KEY ("id");
-- -- Commenting out: This primary key might already exist on live or be incompatible.
-- -- The subsequent migration '...160106...' drops and recreates this table with the correct PK for the new schema.

-- -- CREATE INDEX "habit_completion_user_date_idx" ON "public"."habit_completion" USING "btree" ("user_id", "completion_date");
-- -- Commenting out: This index might already exist on live.
-- -- The subsequent migration '...160106...' drops and recreates this table. If this index is needed for the new schema,
-- -- it should be defined in the '...160106...' script or a subsequent one.

-- -- ALTER TABLE ONLY "public"."habit_completion"
-- --     ADD CONSTRAINT "habit_completion_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "public"."habits"("id") ON DELETE CASCADE;
-- -- Commenting out: This foreign key might already exist on live.
-- -- The subsequent migration '...160106...' drops and recreates this table with the correct FK.

-- ALTER TABLE ONLY "public"."habit_completion"
--     ADD CONSTRAINT "habit_completion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;
-- Commenting out: This foreign key might already exist on live, or relate to an old structure.
-- The subsequent migration '...160106...' drops and recreates this table with the correct FKs.

-- CREATE POLICY "Anyone can read habits" ON "public"."habits" FOR SELECT TO "authenticated" USING (true);
-- CREATE POLICY "Everyone can view habits" ON "public"."habits" FOR SELECT TO "authenticated" USING (true);
-- CREATE POLICY "Users can delete their own habit completions" ON "public"."habit_completion" FOR DELETE USING (("auth"."uid"() = "user_id"));
-- CREATE POLICY "Users can insert their own habit completions" ON "public"."habit_completion" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));
-- CREATE POLICY "Users can manage their habit completions" ON "public"."habit_completion" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));
-- CREATE POLICY "Users can view their own habit completions" ON "public"."habit_completion" FOR SELECT USING (("auth"."uid"() = "user_id"));
-- ALTER TABLE "public"."habit_completion" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "public"."habits" ENABLE ROW LEVEL SECURITY;

-- Any COPY commands for public.habits and public.habit_completion from the old dump would also be commented out or removed.
-- Example:
-- COPY public.habits (id, name, created_at) FROM stdin;
-- ...data...
-- \.
-- COPY public.habit_completion (id, user_id, habit_id, completion_date) FROM stdin;
-- ...data...
-- \.

-- Grant statements for public.habits and public.habit_completion are also effectively superseded by the ...160106... migration
-- which recreates the tables and then RLS policies are applied.

-- ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres"; -- This might be project-wide, fine to keep if no errors
-- GRANT USAGE ON SCHEMA "public" TO "postgres"; -- Standard, fine
-- GRANT USAGE ON SCHEMA "public" TO "anon"; -- Standard, fine
-- GRANT USAGE ON SCHEMA "public" TO "authenticated"; -- Standard, fine
-- GRANT USAGE ON SCHEMA "public" TO "service_role"; -- Standard, fine

-- GRANT ALL ON TABLE "public"."habit_completion" TO "anon";
-- GRANT ALL ON TABLE "public"."habit_completion" TO "authenticated";
-- GRANT ALL ON TABLE "public"."habit_completion" TO "service_role";
-- GRANT ALL ON TABLE "public"."habits" TO "anon";
-- GRANT ALL ON TABLE "public"."habits" TO "authenticated";
-- GRANT ALL ON TABLE "public"."habits" TO "service_role";
-- GRANT ALL ON SEQUENCE "public"."habits_id_seq" TO "anon";
-- GRANT ALL ON SEQUENCE "public"."habits_id_seq" TO "authenticated";
-- GRANT ALL ON SEQUENCE "public"."habits_id_seq" TO "service_role";

-- Default privileges might be fine to keep, but ensure they don't conflict or are re-established correctly.
-- ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
-- ... (many default privilege lines) ...

RESET ALL;
