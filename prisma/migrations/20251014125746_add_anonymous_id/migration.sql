/*
  Warnings:

  - A unique constraint covering the columns `[anonymousId,cookieName]` on the table `CookieConsent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CookieConsent" ADD COLUMN     "anonymousId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "unique_anonymousId_cookieName" ON "CookieConsent"("anonymousId", "cookieName");
