ALTER TABLE "doslr_schema"."documents" DROP CONSTRAINT "documents_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "doslr_schema"."documents" ADD COLUMN "project_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "doslr_schema"."documents" ADD CONSTRAINT "documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "doslr_schema"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "doslr_schema"."documents" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "doslr_schema"."documents" DROP COLUMN "user_id";