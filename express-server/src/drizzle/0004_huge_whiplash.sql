CREATE TABLE "doslr_schema"."s3_unused_key" (
	"id" text PRIMARY KEY NOT NULL,
	"bucket" text NOT NULL,
	"key" text NOT NULL,
	"document_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "s3_unused_key_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "doslr_schema"."s3_unused_key" ADD CONSTRAINT "s3_unused_key_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "doslr_schema"."documents"("id") ON DELETE cascade ON UPDATE no action;