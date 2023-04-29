-- CreateEnum
CREATE TYPE "FileRoles" AS ENUM ('EDITOR', 'VIEWER', 'COMMENTER');

-- CreateTable
CREATE TABLE "FileMembership" (
    "fileId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "FileRoles" NOT NULL DEFAULT 'VIEWER'
);

-- CreateIndex
CREATE UNIQUE INDEX "FileMembership_fileId_userId_key" ON "FileMembership"("fileId", "userId");

-- AddForeignKey
ALTER TABLE "FileMembership" ADD CONSTRAINT "FileMembership_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileMembership" ADD CONSTRAINT "FileMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
