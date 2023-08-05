DROP INDEX IF EXISTS "Team_userId_slug_index";--> statement-breakpoint
ALTER TABLE "Team" DROP COLUMN IF EXISTS "slug";