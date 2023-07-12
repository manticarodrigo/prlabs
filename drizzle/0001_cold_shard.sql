ALTER TABLE "ArticleAnalysis" DROP CONSTRAINT "ArticleAnalysis_articleId_fkey";
--> statement-breakpoint
ALTER TABLE "Article" DROP CONSTRAINT "Article_authorId_fkey";
--> statement-breakpoint
ALTER TABLE "ArticleAnalysis" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "Article" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ArticleAnalysis" ADD CONSTRAINT "ArticleAnalysis_articleId_Article_id_fk" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_Author_id_fk" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
