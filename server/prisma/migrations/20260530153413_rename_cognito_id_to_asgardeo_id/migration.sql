/*
  Warnings:

  - You are about to drop the column `cognitoId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[asgardeoId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `asgardeoId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_cognitoId_key";

-- AlterTable
ALTER TABLE "User"
RENAME COLUMN "cognitoId" TO "asgardeoId";

-- CreateIndex
CREATE UNIQUE INDEX "User_asgardeoId_key" ON "User"("asgardeoId");
