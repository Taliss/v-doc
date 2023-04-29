-- DropForeignKey
ALTER TABLE "FileMembership" DROP CONSTRAINT "FileMembership_fileId_fkey";

-- AddForeignKey
ALTER TABLE "FileMembership" ADD CONSTRAINT "FileMembership_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
