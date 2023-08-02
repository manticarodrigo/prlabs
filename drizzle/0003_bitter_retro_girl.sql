CREATE TABLE IF NOT EXISTS "Team" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(255),
	"description" text,
	"strategy" text,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
DROP TABLE IF EXISTS "Customer";--> statement-breakpoint
DROP INDEX IF EXISTS "Article_external_id_key";--> statement-breakpoint
DROP INDEX IF EXISTS "Author_name_outlet_key";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Team_userId_slug_index" ON "Team" ("userId","slug");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Article_external_id_index" ON "Article" ("external_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Author_name_outlet_index" ON "Author" ("name","outlet");