-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Author" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"outlet" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ArticleAnalysis" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"articleId" text NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Article" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"published_date" timestamp(3),
	"published_date_precision" text,
	"link" text,
	"clean_url" text,
	"excerpt" text,
	"summary" text,
	"rights" text,
	"rank" integer,
	"topic" text,
	"country" text,
	"language" text,
	"authors" text,
	"media" text,
	"is_opinion" boolean,
	"twitter_account" text,
	"external_score" double precision,
	"external_id" text,
	"authorId" text,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Author_name_outlet_key" ON "Author" ("name","outlet");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Article_external_id_key" ON "Article" ("external_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ArticleAnalysis" ADD CONSTRAINT "ArticleAnalysis_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;