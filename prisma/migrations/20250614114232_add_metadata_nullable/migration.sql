-- CreateTable
CREATE TABLE "CookieConsent" (
    "id" SERIAL NOT NULL,
    "cookieName" TEXT NOT NULL,
    "consentGiven" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "CookieConsent_pkey" PRIMARY KEY ("id")
);
