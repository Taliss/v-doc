/*
  Warnings:

  - You are about to drop the column `file_name` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_file_name_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "file_name",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_name_key" ON "File"("name");
