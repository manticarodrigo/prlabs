CREATE TABLE IF NOT EXISTS "Keyword" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	CONSTRAINT "Keyword_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TeamKeywords" (
	"teamId" varchar NOT NULL,
	"keywordId" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Team" ALTER COLUMN "id" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "Team" ALTER COLUMN "userId" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "Team" ALTER COLUMN "name" SET DATA TYPE varchar;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "TeamKeywords_teamId_keywordId_index" ON "TeamKeywords" ("teamId","keywordId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TeamKeywords" ADD CONSTRAINT "TeamKeywords_teamId_Team_id_fk" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TeamKeywords" ADD CONSTRAINT "TeamKeywords_keywordId_Keyword_id_fk" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
