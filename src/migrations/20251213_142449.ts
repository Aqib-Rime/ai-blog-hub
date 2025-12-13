import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'user');
  CREATE TYPE "public"."enum_users_bh_roles" AS ENUM('admin', 'user', 'editor');
  CREATE TYPE "public"."enum_admin_invitations_role" AS ENUM('admin', 'user');
  CREATE TABLE "users_role" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_role",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_bh_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_bh_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"token" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"ip_address" varchar,
  	"user_agent" varchar,
  	"user_id" integer NOT NULL
  );
  
  CREATE TABLE "accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"account_id" varchar NOT NULL,
  	"provider_id" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"access_token" varchar,
  	"refresh_token" varchar,
  	"id_token" varchar,
  	"access_token_expires_at" timestamp(3) with time zone,
  	"refresh_token_expires_at" timestamp(3) with time zone,
  	"scope" varchar,
  	"password" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "verifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"identifier" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "admin_invitations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_admin_invitations_role" DEFAULT 'admin' NOT NULL,
  	"token" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_sessions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_kv_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk";
  
  DROP INDEX "payload_locked_documents_rels_payload_kv_id_idx";
  DROP INDEX "payload_locked_documents_rels_payload_jobs_id_idx";
  ALTER TABLE "users" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "users" ADD COLUMN "email_verified" boolean DEFAULT false NOT NULL;
  ALTER TABLE "users" ADD COLUMN "image" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "sessions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "accounts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "verifications_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "admin_invitations_id" integer;
  ALTER TABLE "users_role" ADD CONSTRAINT "users_role_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_bh_roles" ADD CONSTRAINT "users_bh_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_role_order_idx" ON "users_role" USING btree ("order");
  CREATE INDEX "users_role_parent_idx" ON "users_role" USING btree ("parent_id");
  CREATE INDEX "users_bh_roles_order_idx" ON "users_bh_roles" USING btree ("order");
  CREATE INDEX "users_bh_roles_parent_idx" ON "users_bh_roles" USING btree ("parent_id");
  CREATE UNIQUE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");
  CREATE INDEX "sessions_created_at_idx" ON "sessions" USING btree ("created_at");
  CREATE INDEX "sessions_updated_at_idx" ON "sessions" USING btree ("updated_at");
  CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");
  CREATE INDEX "accounts_account_id_idx" ON "accounts" USING btree ("account_id");
  CREATE INDEX "accounts_user_idx" ON "accounts" USING btree ("user_id");
  CREATE INDEX "accounts_access_token_expires_at_idx" ON "accounts" USING btree ("access_token_expires_at");
  CREATE INDEX "accounts_refresh_token_expires_at_idx" ON "accounts" USING btree ("refresh_token_expires_at");
  CREATE INDEX "accounts_created_at_idx" ON "accounts" USING btree ("created_at");
  CREATE INDEX "accounts_updated_at_idx" ON "accounts" USING btree ("updated_at");
  CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");
  CREATE INDEX "verifications_expires_at_idx" ON "verifications" USING btree ("expires_at");
  CREATE INDEX "verifications_created_at_idx" ON "verifications" USING btree ("created_at");
  CREATE INDEX "verifications_updated_at_idx" ON "verifications" USING btree ("updated_at");
  CREATE INDEX "admin_invitations_token_idx" ON "admin_invitations" USING btree ("token");
  CREATE INDEX "admin_invitations_updated_at_idx" ON "admin_invitations" USING btree ("updated_at");
  CREATE INDEX "admin_invitations_created_at_idx" ON "admin_invitations" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sessions_fk" FOREIGN KEY ("sessions_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_accounts_fk" FOREIGN KEY ("accounts_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verifications_fk" FOREIGN KEY ("verifications_id") REFERENCES "public"."verifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admin_invitations_fk" FOREIGN KEY ("admin_invitations_id") REFERENCES "public"."admin_invitations"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("sessions_id");
  CREATE INDEX "payload_locked_documents_rels_accounts_id_idx" ON "payload_locked_documents_rels" USING btree ("accounts_id");
  CREATE INDEX "payload_locked_documents_rels_verifications_id_idx" ON "payload_locked_documents_rels" USING btree ("verifications_id");
  CREATE INDEX "payload_locked_documents_rels_admin_invitations_id_idx" ON "payload_locked_documents_rels" USING btree ("admin_invitations_id");
  ALTER TABLE "users" DROP COLUMN "reset_password_token";
  ALTER TABLE "users" DROP COLUMN "reset_password_expiration";
  ALTER TABLE "users" DROP COLUMN "salt";
  ALTER TABLE "users" DROP COLUMN "hash";
  ALTER TABLE "users" DROP COLUMN "login_attempts";
  ALTER TABLE "users" DROP COLUMN "lock_until";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_kv_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_jobs_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  ALTER TABLE "users_role" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_bh_roles" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "sessions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "accounts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "verifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "admin_invitations" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_role" CASCADE;
  DROP TABLE "users_bh_roles" CASCADE;
  DROP TABLE "sessions" CASCADE;
  DROP TABLE "accounts" CASCADE;
  DROP TABLE "verifications" CASCADE;
  DROP TABLE "admin_invitations" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_sessions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_accounts_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_verifications_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_admin_invitations_fk";
  
  DROP INDEX "payload_locked_documents_rels_sessions_id_idx";
  DROP INDEX "payload_locked_documents_rels_accounts_id_idx";
  DROP INDEX "payload_locked_documents_rels_verifications_id_idx";
  DROP INDEX "payload_locked_documents_rels_admin_invitations_id_idx";
  ALTER TABLE "users" ADD COLUMN "reset_password_token" varchar;
  ALTER TABLE "users" ADD COLUMN "reset_password_expiration" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "salt" varchar;
  ALTER TABLE "users" ADD COLUMN "hash" varchar;
  ALTER TABLE "users" ADD COLUMN "login_attempts" numeric DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN "lock_until" timestamp(3) with time zone;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_kv_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_jobs_id" integer;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_kv_fk" FOREIGN KEY ("payload_kv_id") REFERENCES "public"."payload_kv"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_payload_kv_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_kv_id");
  CREATE INDEX "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "users" DROP COLUMN "email_verified";
  ALTER TABLE "users" DROP COLUMN "image";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "sessions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "accounts_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "verifications_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "admin_invitations_id";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_bh_roles";
  DROP TYPE "public"."enum_admin_invitations_role";`)
}
