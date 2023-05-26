/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Document";

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "author" TEXT,
    "published_date" TIMESTAMP(3),
    "published_date_precision" TEXT,
    "link" TEXT,
    "clean_url" TEXT,
    "excerpt" TEXT,
    "summary" TEXT,
    "rights" TEXT,
    "rank" INTEGER,
    "topic" TEXT,
    "country" TEXT,
    "language" TEXT,
    "authors" TEXT,
    "media" TEXT,
    "is_opinion" BOOLEAN,
    "twitter_account" TEXT,
    "external_score" DOUBLE PRECISION,
    "external_id" TEXT,
    "vector" vector,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
