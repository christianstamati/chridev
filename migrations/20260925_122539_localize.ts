import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'it');
  CREATE TABLE "projects_team_locales" (
  	"role" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_media_locales" (
  	"caption_title" varchar,
  	"caption_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"role" varchar,
  	"duration" varchar,
  	"challenge" varchar NOT NULL,
  	"solution" varchar NOT NULL,
  	"results" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_team_locales" (
  	"role" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_media_locales" (
  	"caption_title" varchar,
  	"caption_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar NOT NULL,
  	"version_excerpt" varchar NOT NULL,
  	"version_role" varchar,
  	"version_duration" varchar,
  	"version_challenge" varchar NOT NULL,
  	"version_solution" varchar NOT NULL,
  	"version_results" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "profile_locales" (
  	"role" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"intro" jsonb NOT NULL,
  	"about" jsonb NOT NULL,
  	"cv_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_profile_v_locales" (
  	"version_role" varchar NOT NULL,
  	"version_location" varchar NOT NULL,
  	"version_intro" jsonb NOT NULL,
  	"version_about" jsonb NOT NULL,
  	"version_cv_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "resume_skills_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "resume_stack_locales" (
  	"group" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "resume_experience_locales" (
  	"role" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "resume_education_locales" (
  	"title" varchar NOT NULL,
  	"detail" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "resume_languages_locales" (
  	"name" varchar NOT NULL,
  	"level" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_resume_v_version_skills_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_resume_v_version_stack_locales" (
  	"group" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_resume_v_version_experience_locales" (
  	"role" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_resume_v_version_education_locales" (
  	"title" varchar NOT NULL,
  	"detail" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_resume_v_version_languages_locales" (
  	"name" varchar NOT NULL,
  	"level" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contact_locales" (
  	"heading" varchar NOT NULL,
  	"blurb" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_contact_v_locales" (
  	"version_heading" varchar NOT NULL,
  	"version_blurb" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "profile" DROP CONSTRAINT "profile_cv_id_media_id_fk";
  
  ALTER TABLE "_profile_v" DROP CONSTRAINT "_profile_v_version_cv_id_media_id_fk";
  
  DROP INDEX "profile_cv_idx";
  DROP INDEX "_profile_v_version_version_cv_idx";
  ALTER TABLE "media" ALTER COLUMN "prefix" SET DEFAULT 'media';
  ALTER TABLE "projects_texts" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_projects_v_texts" ADD COLUMN "locale" "_locales";
  ALTER TABLE "resume_texts" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_resume_v_texts" ADD COLUMN "locale" "_locales";
  ALTER TABLE "projects_team_locales" ADD CONSTRAINT "projects_team_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_media_locales" ADD CONSTRAINT "projects_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_team_locales" ADD CONSTRAINT "_projects_v_version_team_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_media_locales" ADD CONSTRAINT "_projects_v_version_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_version_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile_locales" ADD CONSTRAINT "profile_locales_cv_id_media_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile_locales" ADD CONSTRAINT "profile_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_profile_v_locales" ADD CONSTRAINT "_profile_v_locales_version_cv_id_media_id_fk" FOREIGN KEY ("version_cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_v_locales" ADD CONSTRAINT "_profile_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_profile_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resume_skills_locales" ADD CONSTRAINT "resume_skills_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume_skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resume_stack_locales" ADD CONSTRAINT "resume_stack_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume_stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resume_experience_locales" ADD CONSTRAINT "resume_experience_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resume_education_locales" ADD CONSTRAINT "resume_education_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume_education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resume_languages_locales" ADD CONSTRAINT "resume_languages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume_languages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_version_skills_locales" ADD CONSTRAINT "_resume_v_version_skills_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resume_v_version_skills"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_version_stack_locales" ADD CONSTRAINT "_resume_v_version_stack_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resume_v_version_stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_version_experience_locales" ADD CONSTRAINT "_resume_v_version_experience_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resume_v_version_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_version_education_locales" ADD CONSTRAINT "_resume_v_version_education_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resume_v_version_education"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_version_languages_locales" ADD CONSTRAINT "_resume_v_version_languages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resume_v_version_languages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_locales" ADD CONSTRAINT "contact_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_v_locales" ADD CONSTRAINT "_contact_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "projects_team_locales_locale_parent_id_unique" ON "projects_team_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_media_locales_locale_parent_id_unique" ON "projects_media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_team_locales_locale_parent_id_unique" ON "_projects_v_version_team_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_projects_v_version_media_locales_locale_parent_id_unique" ON "_projects_v_version_media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "profile_cv_idx" ON "profile_locales" USING btree ("cv_id","_locale");
  CREATE UNIQUE INDEX "profile_locales_locale_parent_id_unique" ON "profile_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_profile_v_version_version_cv_idx" ON "_profile_v_locales" USING btree ("version_cv_id","_locale");
  CREATE UNIQUE INDEX "_profile_v_locales_locale_parent_id_unique" ON "_profile_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "resume_skills_locales_locale_parent_id_unique" ON "resume_skills_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "resume_stack_locales_locale_parent_id_unique" ON "resume_stack_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "resume_experience_locales_locale_parent_id_unique" ON "resume_experience_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "resume_education_locales_locale_parent_id_unique" ON "resume_education_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "resume_languages_locales_locale_parent_id_unique" ON "resume_languages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_resume_v_version_skills_locales_locale_parent_id_unique" ON "_resume_v_version_skills_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_resume_v_version_stack_locales_locale_parent_id_unique" ON "_resume_v_version_stack_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_resume_v_version_experience_locales_locale_parent_id_unique" ON "_resume_v_version_experience_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_resume_v_version_education_locales_locale_parent_id_unique" ON "_resume_v_version_education_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_resume_v_version_languages_locales_locale_parent_id_unique" ON "_resume_v_version_languages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "contact_locales_locale_parent_id_unique" ON "contact_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_contact_v_locales_locale_parent_id_unique" ON "_contact_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_texts_locale_parent" ON "projects_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_projects_v_texts_locale_parent" ON "_projects_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "resume_texts_locale_parent" ON "resume_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_resume_v_texts_locale_parent" ON "_resume_v_texts" USING btree ("locale","parent_id");`)

  // Hand-written. Everything already in the database is English: copy it into
  // the new per-locale tables before the columns it came from are dropped
  // below. Versions too, so restoring an old version still has its words.
  // hasMany text rows gain a locale only where the field became localized:
  // categories and skill items do, a project's stack stays shared.
  await db.execute(sql`
  INSERT INTO "projects_locales" ("title", "excerpt", "role", "duration", "challenge", "solution", "results", "_locale", "_parent_id")
    SELECT "title", "excerpt", "role", "duration", "challenge", "solution", "results", 'en', "id" FROM "projects";
  INSERT INTO "projects_team_locales" ("role", "_locale", "_parent_id")
    SELECT "role", 'en', "id" FROM "projects_team";
  INSERT INTO "projects_media_locales" ("caption_title", "caption_text", "_locale", "_parent_id")
    SELECT "caption_title", "caption_text", 'en', "id" FROM "projects_media";
  UPDATE "projects_texts" SET "locale" = 'en' WHERE "path" = 'categories';

  INSERT INTO "_projects_v_locales" ("version_title", "version_excerpt", "version_role", "version_duration", "version_challenge", "version_solution", "version_results", "_locale", "_parent_id")
    SELECT "version_title", "version_excerpt", "version_role", "version_duration", "version_challenge", "version_solution", "version_results", 'en', "id" FROM "_projects_v";
  INSERT INTO "_projects_v_version_team_locales" ("role", "_locale", "_parent_id")
    SELECT "role", 'en', "id" FROM "_projects_v_version_team";
  INSERT INTO "_projects_v_version_media_locales" ("caption_title", "caption_text", "_locale", "_parent_id")
    SELECT "caption_title", "caption_text", 'en', "id" FROM "_projects_v_version_media";
  UPDATE "_projects_v_texts" SET "locale" = 'en' WHERE "path" = 'version.categories';

  INSERT INTO "media_locales" ("alt", "_locale", "_parent_id")
    SELECT "alt", 'en', "id" FROM "media";

  INSERT INTO "profile_locales" ("role", "location", "intro", "about", "cv_id", "_locale", "_parent_id")
    SELECT "role", "location", "intro", "about", "cv_id", 'en', "id" FROM "profile";
  INSERT INTO "_profile_v_locales" ("version_role", "version_location", "version_intro", "version_about", "version_cv_id", "_locale", "_parent_id")
    SELECT "version_role", "version_location", "version_intro", "version_about", "version_cv_id", 'en', "id" FROM "_profile_v";

  INSERT INTO "resume_skills_locales" ("title", "_locale", "_parent_id")
    SELECT "title", 'en', "id" FROM "resume_skills";
  INSERT INTO "resume_stack_locales" ("group", "_locale", "_parent_id")
    SELECT "group", 'en', "id" FROM "resume_stack";
  INSERT INTO "resume_experience_locales" ("role", "summary", "_locale", "_parent_id")
    SELECT "role", "summary", 'en', "id" FROM "resume_experience";
  INSERT INTO "resume_education_locales" ("title", "detail", "_locale", "_parent_id")
    SELECT "title", "detail", 'en', "id" FROM "resume_education";
  INSERT INTO "resume_languages_locales" ("name", "level", "_locale", "_parent_id")
    SELECT "name", "level", 'en', "id" FROM "resume_languages";
  UPDATE "resume_texts" SET "locale" = 'en' WHERE "path" LIKE 'skills.%.items';

  INSERT INTO "_resume_v_version_skills_locales" ("title", "_locale", "_parent_id")
    SELECT "title", 'en', "id" FROM "_resume_v_version_skills";
  INSERT INTO "_resume_v_version_stack_locales" ("group", "_locale", "_parent_id")
    SELECT "group", 'en', "id" FROM "_resume_v_version_stack";
  INSERT INTO "_resume_v_version_experience_locales" ("role", "summary", "_locale", "_parent_id")
    SELECT "role", "summary", 'en', "id" FROM "_resume_v_version_experience";
  INSERT INTO "_resume_v_version_education_locales" ("title", "detail", "_locale", "_parent_id")
    SELECT "title", "detail", 'en', "id" FROM "_resume_v_version_education";
  INSERT INTO "_resume_v_version_languages_locales" ("name", "level", "_locale", "_parent_id")
    SELECT "name", "level", 'en', "id" FROM "_resume_v_version_languages";
  UPDATE "_resume_v_texts" SET "locale" = 'en' WHERE "path" LIKE 'version.skills.%.items';

  INSERT INTO "contact_locales" ("heading", "blurb", "_locale", "_parent_id")
    SELECT "heading", "blurb", 'en', "id" FROM "contact";
  INSERT INTO "_contact_v_locales" ("version_heading", "version_blurb", "_locale", "_parent_id")
    SELECT "version_heading", "version_blurb", 'en', "id" FROM "_contact_v";`)

  await db.execute(sql`
  ALTER TABLE "projects_team" DROP COLUMN "role";
  ALTER TABLE "projects_media" DROP COLUMN "caption_title";
  ALTER TABLE "projects_media" DROP COLUMN "caption_text";
  ALTER TABLE "projects" DROP COLUMN "title";
  ALTER TABLE "projects" DROP COLUMN "excerpt";
  ALTER TABLE "projects" DROP COLUMN "role";
  ALTER TABLE "projects" DROP COLUMN "duration";
  ALTER TABLE "projects" DROP COLUMN "challenge";
  ALTER TABLE "projects" DROP COLUMN "solution";
  ALTER TABLE "projects" DROP COLUMN "results";
  ALTER TABLE "_projects_v_version_team" DROP COLUMN "role";
  ALTER TABLE "_projects_v_version_media" DROP COLUMN "caption_title";
  ALTER TABLE "_projects_v_version_media" DROP COLUMN "caption_text";
  ALTER TABLE "_projects_v" DROP COLUMN "version_title";
  ALTER TABLE "_projects_v" DROP COLUMN "version_excerpt";
  ALTER TABLE "_projects_v" DROP COLUMN "version_role";
  ALTER TABLE "_projects_v" DROP COLUMN "version_duration";
  ALTER TABLE "_projects_v" DROP COLUMN "version_challenge";
  ALTER TABLE "_projects_v" DROP COLUMN "version_solution";
  ALTER TABLE "_projects_v" DROP COLUMN "version_results";
  ALTER TABLE "media" DROP COLUMN "alt";
  ALTER TABLE "profile" DROP COLUMN "role";
  ALTER TABLE "profile" DROP COLUMN "location";
  ALTER TABLE "profile" DROP COLUMN "intro";
  ALTER TABLE "profile" DROP COLUMN "about";
  ALTER TABLE "profile" DROP COLUMN "cv_id";
  ALTER TABLE "_profile_v" DROP COLUMN "version_role";
  ALTER TABLE "_profile_v" DROP COLUMN "version_location";
  ALTER TABLE "_profile_v" DROP COLUMN "version_intro";
  ALTER TABLE "_profile_v" DROP COLUMN "version_about";
  ALTER TABLE "_profile_v" DROP COLUMN "version_cv_id";
  ALTER TABLE "resume_skills" DROP COLUMN "title";
  ALTER TABLE "resume_stack" DROP COLUMN "group";
  ALTER TABLE "resume_experience" DROP COLUMN "role";
  ALTER TABLE "resume_experience" DROP COLUMN "summary";
  ALTER TABLE "resume_education" DROP COLUMN "title";
  ALTER TABLE "resume_education" DROP COLUMN "detail";
  ALTER TABLE "resume_languages" DROP COLUMN "name";
  ALTER TABLE "resume_languages" DROP COLUMN "level";
  ALTER TABLE "_resume_v_version_skills" DROP COLUMN "title";
  ALTER TABLE "_resume_v_version_stack" DROP COLUMN "group";
  ALTER TABLE "_resume_v_version_experience" DROP COLUMN "role";
  ALTER TABLE "_resume_v_version_experience" DROP COLUMN "summary";
  ALTER TABLE "_resume_v_version_education" DROP COLUMN "title";
  ALTER TABLE "_resume_v_version_education" DROP COLUMN "detail";
  ALTER TABLE "_resume_v_version_languages" DROP COLUMN "name";
  ALTER TABLE "_resume_v_version_languages" DROP COLUMN "level";
  ALTER TABLE "contact" DROP COLUMN "heading";
  ALTER TABLE "contact" DROP COLUMN "blurb";
  ALTER TABLE "_contact_v" DROP COLUMN "version_heading";
  ALTER TABLE "_contact_v" DROP COLUMN "version_blurb";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Hand-written. Back to one language: the English copy returns to the
  // columns it came from, and every other locale is dropped with its tables.
  // The columns come back nullable, get their English, then turn NOT NULL.
  await db.execute(sql`
  ALTER TABLE "projects_team" ADD COLUMN "role" varchar;
  ALTER TABLE "projects_media" ADD COLUMN "caption_title" varchar;
  ALTER TABLE "projects_media" ADD COLUMN "caption_text" varchar;
  ALTER TABLE "projects" ADD COLUMN "title" varchar;
  ALTER TABLE "projects" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "projects" ADD COLUMN "role" varchar;
  ALTER TABLE "projects" ADD COLUMN "duration" varchar;
  ALTER TABLE "projects" ADD COLUMN "challenge" varchar;
  ALTER TABLE "projects" ADD COLUMN "solution" varchar;
  ALTER TABLE "projects" ADD COLUMN "results" varchar;
  ALTER TABLE "_projects_v_version_team" ADD COLUMN "role" varchar;
  ALTER TABLE "_projects_v_version_media" ADD COLUMN "caption_title" varchar;
  ALTER TABLE "_projects_v_version_media" ADD COLUMN "caption_text" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_excerpt" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_role" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_duration" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_challenge" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_solution" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_results" varchar;
  ALTER TABLE "media" ADD COLUMN "alt" varchar;
  ALTER TABLE "profile" ADD COLUMN "role" varchar;
  ALTER TABLE "profile" ADD COLUMN "location" varchar;
  ALTER TABLE "profile" ADD COLUMN "intro" jsonb;
  ALTER TABLE "profile" ADD COLUMN "about" jsonb;
  ALTER TABLE "profile" ADD COLUMN "cv_id" integer;
  ALTER TABLE "_profile_v" ADD COLUMN "version_role" varchar;
  ALTER TABLE "_profile_v" ADD COLUMN "version_location" varchar;
  ALTER TABLE "_profile_v" ADD COLUMN "version_intro" jsonb;
  ALTER TABLE "_profile_v" ADD COLUMN "version_about" jsonb;
  ALTER TABLE "_profile_v" ADD COLUMN "version_cv_id" integer;
  ALTER TABLE "resume_skills" ADD COLUMN "title" varchar;
  ALTER TABLE "resume_stack" ADD COLUMN "group" varchar;
  ALTER TABLE "resume_experience" ADD COLUMN "role" varchar;
  ALTER TABLE "resume_experience" ADD COLUMN "summary" varchar;
  ALTER TABLE "resume_education" ADD COLUMN "title" varchar;
  ALTER TABLE "resume_education" ADD COLUMN "detail" varchar;
  ALTER TABLE "resume_languages" ADD COLUMN "name" varchar;
  ALTER TABLE "resume_languages" ADD COLUMN "level" varchar;
  ALTER TABLE "_resume_v_version_skills" ADD COLUMN "title" varchar;
  ALTER TABLE "_resume_v_version_stack" ADD COLUMN "group" varchar;
  ALTER TABLE "_resume_v_version_experience" ADD COLUMN "role" varchar;
  ALTER TABLE "_resume_v_version_experience" ADD COLUMN "summary" varchar;
  ALTER TABLE "_resume_v_version_education" ADD COLUMN "title" varchar;
  ALTER TABLE "_resume_v_version_education" ADD COLUMN "detail" varchar;
  ALTER TABLE "_resume_v_version_languages" ADD COLUMN "name" varchar;
  ALTER TABLE "_resume_v_version_languages" ADD COLUMN "level" varchar;
  ALTER TABLE "contact" ADD COLUMN "heading" varchar;
  ALTER TABLE "contact" ADD COLUMN "blurb" varchar;
  ALTER TABLE "_contact_v" ADD COLUMN "version_heading" varchar;
  ALTER TABLE "_contact_v" ADD COLUMN "version_blurb" varchar;

  UPDATE "projects" t SET "title" = l."title", "excerpt" = l."excerpt", "role" = l."role", "duration" = l."duration", "challenge" = l."challenge", "solution" = l."solution", "results" = l."results"
    FROM "projects_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_team" t SET "role" = l."role"
    FROM "projects_team_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "projects_media" t SET "caption_title" = l."caption_title", "caption_text" = l."caption_text"
    FROM "projects_media_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "_projects_v" t SET "version_title" = l."version_title", "version_excerpt" = l."version_excerpt", "version_role" = l."version_role", "version_duration" = l."version_duration", "version_challenge" = l."version_challenge", "version_solution" = l."version_solution", "version_results" = l."version_results"
    FROM "_projects_v_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "_projects_v_version_team" t SET "role" = l."role"
    FROM "_projects_v_version_team_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "_projects_v_version_media" t SET "caption_title" = l."caption_title", "caption_text" = l."caption_text"
    FROM "_projects_v_version_media_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "media" t SET "alt" = l."alt"
    FROM "media_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "profile" t SET "role" = l."role", "location" = l."location", "intro" = l."intro", "about" = l."about", "cv_id" = l."cv_id"
    FROM "profile_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "_profile_v" t SET "version_role" = l."version_role", "version_location" = l."version_location", "version_intro" = l."version_intro", "version_about" = l."version_about", "version_cv_id" = l."version_cv_id"
    FROM "_profile_v_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "resume_skills" t SET "title" = l."title"
    FROM "resume_skills_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "resume_stack" t SET "group" = l."group"
    FROM "resume_stack_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "resume_experience" t SET "role" = l."role", "summary" = l."summary"
    FROM "resume_experience_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "resume_education" t SET "title" = l."title", "detail" = l."detail"
    FROM "resume_education_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "resume_languages" t SET "name" = l."name", "level" = l."level"
    FROM "resume_languages_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "_resume_v_version_skills" t SET "title" = l."title"
    FROM "_resume_v_version_skills_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "_resume_v_version_stack" t SET "group" = l."group"
    FROM "_resume_v_version_stack_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "_resume_v_version_experience" t SET "role" = l."role", "summary" = l."summary"
    FROM "_resume_v_version_experience_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "_resume_v_version_education" t SET "title" = l."title", "detail" = l."detail"
    FROM "_resume_v_version_education_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "_resume_v_version_languages" t SET "name" = l."name", "level" = l."level"
    FROM "_resume_v_version_languages_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "contact" t SET "heading" = l."heading", "blurb" = l."blurb"
    FROM "contact_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  UPDATE "_contact_v" t SET "version_heading" = l."version_heading", "version_blurb" = l."version_blurb"
    FROM "_contact_v_locales" l WHERE l."_parent_id" = t."id" AND l."_locale" = 'en';
  DELETE FROM "projects_texts" WHERE "locale" IS NOT NULL AND "locale" <> 'en';
  DELETE FROM "_projects_v_texts" WHERE "locale" IS NOT NULL AND "locale" <> 'en';
  DELETE FROM "resume_texts" WHERE "locale" IS NOT NULL AND "locale" <> 'en';
  DELETE FROM "_resume_v_texts" WHERE "locale" IS NOT NULL AND "locale" <> 'en';

  ALTER TABLE "projects_team" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "excerpt" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "challenge" SET NOT NULL;
  ALTER TABLE "projects" ALTER COLUMN "solution" SET NOT NULL;
  ALTER TABLE "_projects_v_version_team" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_title" SET NOT NULL;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_excerpt" SET NOT NULL;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_challenge" SET NOT NULL;
  ALTER TABLE "_projects_v" ALTER COLUMN "version_solution" SET NOT NULL;
  ALTER TABLE "profile" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "profile" ALTER COLUMN "location" SET NOT NULL;
  ALTER TABLE "profile" ALTER COLUMN "intro" SET NOT NULL;
  ALTER TABLE "profile" ALTER COLUMN "about" SET NOT NULL;
  ALTER TABLE "profile" ALTER COLUMN "cv_id" SET NOT NULL;
  ALTER TABLE "_profile_v" ALTER COLUMN "version_role" SET NOT NULL;
  ALTER TABLE "_profile_v" ALTER COLUMN "version_location" SET NOT NULL;
  ALTER TABLE "_profile_v" ALTER COLUMN "version_intro" SET NOT NULL;
  ALTER TABLE "_profile_v" ALTER COLUMN "version_about" SET NOT NULL;
  ALTER TABLE "_profile_v" ALTER COLUMN "version_cv_id" SET NOT NULL;
  ALTER TABLE "resume_skills" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "resume_stack" ALTER COLUMN "group" SET NOT NULL;
  ALTER TABLE "resume_experience" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "resume_experience" ALTER COLUMN "summary" SET NOT NULL;
  ALTER TABLE "resume_education" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "resume_languages" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "resume_languages" ALTER COLUMN "level" SET NOT NULL;
  ALTER TABLE "_resume_v_version_skills" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "_resume_v_version_stack" ALTER COLUMN "group" SET NOT NULL;
  ALTER TABLE "_resume_v_version_experience" ALTER COLUMN "role" SET NOT NULL;
  ALTER TABLE "_resume_v_version_experience" ALTER COLUMN "summary" SET NOT NULL;
  ALTER TABLE "_resume_v_version_education" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "_resume_v_version_languages" ALTER COLUMN "name" SET NOT NULL;
  ALTER TABLE "_resume_v_version_languages" ALTER COLUMN "level" SET NOT NULL;
  ALTER TABLE "contact" ALTER COLUMN "heading" SET NOT NULL;
  ALTER TABLE "contact" ALTER COLUMN "blurb" SET NOT NULL;
  ALTER TABLE "_contact_v" ALTER COLUMN "version_heading" SET NOT NULL;
  ALTER TABLE "_contact_v" ALTER COLUMN "version_blurb" SET NOT NULL;

  DROP TABLE "projects_team_locales" CASCADE;
  DROP TABLE "projects_media_locales" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "_projects_v_version_team_locales" CASCADE;
  DROP TABLE "_projects_v_version_media_locales" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "profile_locales" CASCADE;
  DROP TABLE "_profile_v_locales" CASCADE;
  DROP TABLE "resume_skills_locales" CASCADE;
  DROP TABLE "resume_stack_locales" CASCADE;
  DROP TABLE "resume_experience_locales" CASCADE;
  DROP TABLE "resume_education_locales" CASCADE;
  DROP TABLE "resume_languages_locales" CASCADE;
  DROP TABLE "_resume_v_version_skills_locales" CASCADE;
  DROP TABLE "_resume_v_version_stack_locales" CASCADE;
  DROP TABLE "_resume_v_version_experience_locales" CASCADE;
  DROP TABLE "_resume_v_version_education_locales" CASCADE;
  DROP TABLE "_resume_v_version_languages_locales" CASCADE;
  DROP TABLE "contact_locales" CASCADE;
  DROP TABLE "_contact_v_locales" CASCADE;
  DROP INDEX "projects_texts_locale_parent";
  DROP INDEX "_projects_v_texts_locale_parent";
  DROP INDEX "resume_texts_locale_parent";
  DROP INDEX "_resume_v_texts_locale_parent";
  ALTER TABLE "media" ALTER COLUMN "prefix" SET DEFAULT '';
  ALTER TABLE "profile" ADD CONSTRAINT "profile_cv_id_media_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_v" ADD CONSTRAINT "_profile_v_version_cv_id_media_id_fk" FOREIGN KEY ("version_cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "profile_cv_idx" ON "profile" USING btree ("cv_id");
  CREATE INDEX "_profile_v_version_version_cv_idx" ON "_profile_v" USING btree ("version_cv_id");
  ALTER TABLE "projects_texts" DROP COLUMN "locale";
  ALTER TABLE "_projects_v_texts" DROP COLUMN "locale";
  ALTER TABLE "resume_texts" DROP COLUMN "locale";
  ALTER TABLE "_resume_v_texts" DROP COLUMN "locale";
  DROP TYPE "public"."_locales";`)
}
