-- Create the Author table
CREATE TABLE "Author" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "outlet" TEXT,
  CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- Create unique index
CREATE UNIQUE INDEX "Author_name_outlet_key" ON "Author"("name", "outlet");

-- Populate the Author table with unique author/outlet combinations from the Article table
INSERT INTO
  "Author" ("id", "name", "outlet")
SELECT
  gen_random_uuid(),
  "author",
  "clean_url"
FROM
  "Article"
GROUP BY
  "author",
  "clean_url";

-- Add a new column authorId to the Article table
ALTER TABLE
  "Article"
ADD
  COLUMN "authorId" TEXT;

-- Populate the authorId column in the Article table
UPDATE
  "Article"
SET
  "authorId" = "Author"."id"
FROM
  "Author"
WHERE
  "Article"."author" = "Author"."name"
  AND "Article"."clean_url" = "Author"."outlet";

-- Add foreign key constraint
ALTER TABLE
  "Article"
ADD
  CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE
SET
  NULL ON UPDATE CASCADE;

-- Drop the author column
ALTER TABLE
  "Article" DROP COLUMN "author";