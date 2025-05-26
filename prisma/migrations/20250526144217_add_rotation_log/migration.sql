/*
  Warnings:

  - You are about to drop the column `endTime` on the `HamsterSession` table. All the data in the column will be lost.
  - You are about to drop the column `humidity` on the `HamsterSession` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `HamsterSession` table. All the data in the column will be lost.
  - You are about to drop the column `rotations` on the `HamsterSession` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `HamsterSession` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `HamsterSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HamsterSession" DROP COLUMN "endTime",
DROP COLUMN "humidity",
DROP COLUMN "image",
DROP COLUMN "rotations",
DROP COLUMN "startTime",
DROP COLUMN "temperature",
ADD COLUMN     "images" TEXT[];

-- CreateTable
CREATE TABLE "RotationLogEntry" (
    "id" SERIAL NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "humidity" DOUBLE PRECISION NOT NULL,
    "sessionId" INTEGER NOT NULL,

    CONSTRAINT "RotationLogEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RotationLogEntry" ADD CONSTRAINT "RotationLogEntry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "HamsterSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
