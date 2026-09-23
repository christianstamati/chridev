import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_resume_stack_items_icon" AS ENUM('typescript', 'react', 'nextdotjs', 'tanstack', 'tailwindcss', 'shadcnui', 'threedotjs', 'webgpu', 'unrealengine', 'unity', 'nodedotjs', 'convex', 'mongodb', 'drizzle', 'payloadcms', 'betterauth', 'blender', 'figma');
  CREATE TYPE "public"."enum__resume_v_version_stack_items_icon" AS ENUM('typescript', 'react', 'nextdotjs', 'tanstack', 'tailwindcss', 'shadcnui', 'threedotjs', 'webgpu', 'unrealengine', 'unity', 'nodedotjs', 'convex', 'mongodb', 'drizzle', 'payloadcms', 'betterauth', 'blender', 'figma');
  CREATE TABLE "projects_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL
  );
  
  CREATE TABLE "projects_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"still_id" integer NOT NULL,
  	"video_id" integer,
  	"caption_title" varchar,
  	"caption_text" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"company_url" varchar,
  	"year" varchar,
  	"role" varchar,
  	"duration" varchar,
  	"live_url" varchar,
  	"challenge" varchar NOT NULL,
  	"solution" varchar NOT NULL,
  	"results" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_projects_v_version_team" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"still_id" integer NOT NULL,
  	"video_id" integer,
  	"caption_title" varchar,
  	"caption_text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar NOT NULL,
  	"version_slug" varchar NOT NULL,
  	"version_excerpt" varchar NOT NULL,
  	"version_company" varchar NOT NULL,
  	"version_company_url" varchar,
  	"version_year" varchar,
  	"version_role" varchar,
  	"version_duration" varchar,
  	"version_live_url" varchar,
  	"version_challenge" varchar NOT NULL,
  	"version_solution" varchar NOT NULL,
  	"version_results" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_projects_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"source_path" varchar,
  	"prefix" varchar DEFAULT '',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"location" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"intro" jsonb NOT NULL,
  	"about" jsonb NOT NULL,
  	"avatar_id" integer NOT NULL,
  	"cv_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_profile_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_name" varchar NOT NULL,
  	"version_role" varchar NOT NULL,
  	"version_location" varchar NOT NULL,
  	"version_url" varchar NOT NULL,
  	"version_intro" jsonb NOT NULL,
  	"version_about" jsonb NOT NULL,
  	"version_avatar_id" integer NOT NULL,
  	"version_cv_id" integer NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "resume_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "resume_stack_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"href" varchar,
  	"icon" "enum_resume_stack_items_icon"
  );
  
  CREATE TABLE "resume_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group" varchar NOT NULL
  );
  
  CREATE TABLE "resume_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"start" varchar NOT NULL,
  	"end" varchar,
  	"href" varchar,
  	"summary" varchar NOT NULL
  );
  
  CREATE TABLE "resume_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"school" varchar NOT NULL,
  	"period" varchar NOT NULL,
  	"detail" varchar
  );
  
  CREATE TABLE "resume_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"level" varchar NOT NULL
  );
  
  CREATE TABLE "resume" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "resume_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_resume_v_version_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_resume_v_version_stack_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"href" varchar,
  	"icon" "enum__resume_v_version_stack_items_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_resume_v_version_stack" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"group" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_resume_v_version_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"start" varchar NOT NULL,
  	"end" varchar,
  	"href" varchar,
  	"summary" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_resume_v_version_education" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"school" varchar NOT NULL,
  	"period" varchar NOT NULL,
  	"detail" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_resume_v_version_languages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"level" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_resume_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "_resume_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "contact_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "contact" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar NOT NULL,
  	"blurb" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contact_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_heading" varchar NOT NULL,
  	"version_blurb" varchar NOT NULL,
  	"version_email" varchar NOT NULL,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "projects_team" ADD CONSTRAINT "projects_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_media" ADD CONSTRAINT "projects_media_still_id_media_id_fk" FOREIGN KEY ("still_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_media" ADD CONSTRAINT "projects_media_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_media" ADD CONSTRAINT "projects_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_texts" ADD CONSTRAINT "projects_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_team" ADD CONSTRAINT "_projects_v_version_team_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_media" ADD CONSTRAINT "_projects_v_version_media_still_id_media_id_fk" FOREIGN KEY ("still_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_media" ADD CONSTRAINT "_projects_v_version_media_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_media" ADD CONSTRAINT "_projects_v_version_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_texts" ADD CONSTRAINT "_projects_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "profile" ADD CONSTRAINT "profile_cv_id_media_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_v" ADD CONSTRAINT "_profile_v_version_avatar_id_media_id_fk" FOREIGN KEY ("version_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_profile_v" ADD CONSTRAINT "_profile_v_version_cv_id_media_id_fk" FOREIGN KEY ("version_cv_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resume_skills" ADD CONSTRAINT "resume_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resume_stack_items" ADD CONSTRAINT "resume_stack_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume_stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resume_stack" ADD CONSTRAINT "resume_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resume_experience" ADD CONSTRAINT "resume_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resume_education" ADD CONSTRAINT "resume_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resume_languages" ADD CONSTRAINT "resume_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resume_texts" ADD CONSTRAINT "resume_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."resume"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_version_skills" ADD CONSTRAINT "_resume_v_version_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_version_stack_items" ADD CONSTRAINT "_resume_v_version_stack_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resume_v_version_stack"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_version_stack" ADD CONSTRAINT "_resume_v_version_stack_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_version_experience" ADD CONSTRAINT "_resume_v_version_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_version_education" ADD CONSTRAINT "_resume_v_version_education_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_version_languages" ADD CONSTRAINT "_resume_v_version_languages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_resume_v_texts" ADD CONSTRAINT "_resume_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_resume_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_socials" ADD CONSTRAINT "contact_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_v_version_socials" ADD CONSTRAINT "_contact_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "projects_team_order_idx" ON "projects_team" USING btree ("_order");
  CREATE INDEX "projects_team_parent_id_idx" ON "projects_team" USING btree ("_parent_id");
  CREATE INDEX "projects_media_order_idx" ON "projects_media" USING btree ("_order");
  CREATE INDEX "projects_media_parent_id_idx" ON "projects_media" USING btree ("_parent_id");
  CREATE INDEX "projects_media_still_idx" ON "projects_media" USING btree ("still_id");
  CREATE INDEX "projects_media_video_idx" ON "projects_media" USING btree ("video_id");
  CREATE INDEX "projects__order_idx" ON "projects" USING btree ("_order");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects_texts_order_parent" ON "projects_texts" USING btree ("order","parent_id");
  CREATE INDEX "_projects_v_version_team_order_idx" ON "_projects_v_version_team" USING btree ("_order");
  CREATE INDEX "_projects_v_version_team_parent_id_idx" ON "_projects_v_version_team" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_media_order_idx" ON "_projects_v_version_media" USING btree ("_order");
  CREATE INDEX "_projects_v_version_media_parent_id_idx" ON "_projects_v_version_media" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_media_still_idx" ON "_projects_v_version_media" USING btree ("still_id");
  CREATE INDEX "_projects_v_version_media_video_idx" ON "_projects_v_version_media" USING btree ("video_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version__order_idx" ON "_projects_v" USING btree ("version__order");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_texts_order_parent" ON "_projects_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "media_source_path_idx" ON "media" USING btree ("source_path");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "profile_avatar_idx" ON "profile" USING btree ("avatar_id");
  CREATE INDEX "profile_cv_idx" ON "profile" USING btree ("cv_id");
  CREATE INDEX "_profile_v_version_version_avatar_idx" ON "_profile_v" USING btree ("version_avatar_id");
  CREATE INDEX "_profile_v_version_version_cv_idx" ON "_profile_v" USING btree ("version_cv_id");
  CREATE INDEX "_profile_v_created_at_idx" ON "_profile_v" USING btree ("created_at");
  CREATE INDEX "_profile_v_updated_at_idx" ON "_profile_v" USING btree ("updated_at");
  CREATE INDEX "resume_skills_order_idx" ON "resume_skills" USING btree ("_order");
  CREATE INDEX "resume_skills_parent_id_idx" ON "resume_skills" USING btree ("_parent_id");
  CREATE INDEX "resume_stack_items_order_idx" ON "resume_stack_items" USING btree ("_order");
  CREATE INDEX "resume_stack_items_parent_id_idx" ON "resume_stack_items" USING btree ("_parent_id");
  CREATE INDEX "resume_stack_order_idx" ON "resume_stack" USING btree ("_order");
  CREATE INDEX "resume_stack_parent_id_idx" ON "resume_stack" USING btree ("_parent_id");
  CREATE INDEX "resume_experience_order_idx" ON "resume_experience" USING btree ("_order");
  CREATE INDEX "resume_experience_parent_id_idx" ON "resume_experience" USING btree ("_parent_id");
  CREATE INDEX "resume_education_order_idx" ON "resume_education" USING btree ("_order");
  CREATE INDEX "resume_education_parent_id_idx" ON "resume_education" USING btree ("_parent_id");
  CREATE INDEX "resume_languages_order_idx" ON "resume_languages" USING btree ("_order");
  CREATE INDEX "resume_languages_parent_id_idx" ON "resume_languages" USING btree ("_parent_id");
  CREATE INDEX "resume_texts_order_parent" ON "resume_texts" USING btree ("order","parent_id");
  CREATE INDEX "_resume_v_version_skills_order_idx" ON "_resume_v_version_skills" USING btree ("_order");
  CREATE INDEX "_resume_v_version_skills_parent_id_idx" ON "_resume_v_version_skills" USING btree ("_parent_id");
  CREATE INDEX "_resume_v_version_stack_items_order_idx" ON "_resume_v_version_stack_items" USING btree ("_order");
  CREATE INDEX "_resume_v_version_stack_items_parent_id_idx" ON "_resume_v_version_stack_items" USING btree ("_parent_id");
  CREATE INDEX "_resume_v_version_stack_order_idx" ON "_resume_v_version_stack" USING btree ("_order");
  CREATE INDEX "_resume_v_version_stack_parent_id_idx" ON "_resume_v_version_stack" USING btree ("_parent_id");
  CREATE INDEX "_resume_v_version_experience_order_idx" ON "_resume_v_version_experience" USING btree ("_order");
  CREATE INDEX "_resume_v_version_experience_parent_id_idx" ON "_resume_v_version_experience" USING btree ("_parent_id");
  CREATE INDEX "_resume_v_version_education_order_idx" ON "_resume_v_version_education" USING btree ("_order");
  CREATE INDEX "_resume_v_version_education_parent_id_idx" ON "_resume_v_version_education" USING btree ("_parent_id");
  CREATE INDEX "_resume_v_version_languages_order_idx" ON "_resume_v_version_languages" USING btree ("_order");
  CREATE INDEX "_resume_v_version_languages_parent_id_idx" ON "_resume_v_version_languages" USING btree ("_parent_id");
  CREATE INDEX "_resume_v_created_at_idx" ON "_resume_v" USING btree ("created_at");
  CREATE INDEX "_resume_v_updated_at_idx" ON "_resume_v" USING btree ("updated_at");
  CREATE INDEX "_resume_v_texts_order_parent" ON "_resume_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "contact_socials_order_idx" ON "contact_socials" USING btree ("_order");
  CREATE INDEX "contact_socials_parent_id_idx" ON "contact_socials" USING btree ("_parent_id");
  CREATE INDEX "_contact_v_version_socials_order_idx" ON "_contact_v_version_socials" USING btree ("_order");
  CREATE INDEX "_contact_v_version_socials_parent_id_idx" ON "_contact_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_contact_v_created_at_idx" ON "_contact_v" USING btree ("created_at");
  CREATE INDEX "_contact_v_updated_at_idx" ON "_contact_v" USING btree ("updated_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "projects_team" CASCADE;
  DROP TABLE "projects_media" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_texts" CASCADE;
  DROP TABLE "_projects_v_version_team" CASCADE;
  DROP TABLE "_projects_v_version_media" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_texts" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "profile" CASCADE;
  DROP TABLE "_profile_v" CASCADE;
  DROP TABLE "resume_skills" CASCADE;
  DROP TABLE "resume_stack_items" CASCADE;
  DROP TABLE "resume_stack" CASCADE;
  DROP TABLE "resume_experience" CASCADE;
  DROP TABLE "resume_education" CASCADE;
  DROP TABLE "resume_languages" CASCADE;
  DROP TABLE "resume" CASCADE;
  DROP TABLE "resume_texts" CASCADE;
  DROP TABLE "_resume_v_version_skills" CASCADE;
  DROP TABLE "_resume_v_version_stack_items" CASCADE;
  DROP TABLE "_resume_v_version_stack" CASCADE;
  DROP TABLE "_resume_v_version_experience" CASCADE;
  DROP TABLE "_resume_v_version_education" CASCADE;
  DROP TABLE "_resume_v_version_languages" CASCADE;
  DROP TABLE "_resume_v" CASCADE;
  DROP TABLE "_resume_v_texts" CASCADE;
  DROP TABLE "contact_socials" CASCADE;
  DROP TABLE "contact" CASCADE;
  DROP TABLE "_contact_v_version_socials" CASCADE;
  DROP TABLE "_contact_v" CASCADE;
  DROP TYPE "public"."enum_resume_stack_items_icon";
  DROP TYPE "public"."enum__resume_v_version_stack_items_icon";`)
}
