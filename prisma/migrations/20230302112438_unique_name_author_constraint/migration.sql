/*
  Warnings:

  - A unique constraint covering the columns `[authorId,name]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_authorId_name_key" ON "File"("authorId", "name");
