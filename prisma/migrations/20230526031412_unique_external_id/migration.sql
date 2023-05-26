/*
  Warnings:

  - A unique constraint covering the columns `[external_id]` on the table `Article` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Article_external_id_key" ON "Article"("external_id");
