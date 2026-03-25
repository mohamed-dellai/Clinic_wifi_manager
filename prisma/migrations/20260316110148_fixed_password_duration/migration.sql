/*
  Warnings:

  - You are about to drop the column `validFrom` on the `WifiPassword` table. All the data in the column will be lost.
  - You are about to drop the column `validTo` on the `WifiPassword` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WifiPassword" DROP COLUMN "validFrom",
DROP COLUMN "validTo";
