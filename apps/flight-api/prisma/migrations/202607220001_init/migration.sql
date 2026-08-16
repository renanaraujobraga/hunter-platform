CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "HunterStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ARCHIVED');
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'GOOD_DEAL', 'PROMOTION', 'BUY_NOW', 'RARE');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Hunter" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "origin" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "departureFrom" TIMESTAMP(3) NOT NULL,
  "departureTo" TIMESTAMP(3) NOT NULL,
  "returnFrom" TIMESTAMP(3),
  "returnTo" TIMESTAMP(3),
  "maxPrice" DOUBLE PRECISION,
  "currentPrice" DOUBLE PRECISION,
  "previousPrice" DOUBLE PRECISION,
  "score" INTEGER NOT NULL DEFAULT 0,
  "confidence" INTEGER NOT NULL DEFAULT 0,
  "status" "HunterStatus" NOT NULL DEFAULT 'ACTIVE',
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Hunter_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Alert" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "hunterId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PriceRecord" (
  "id" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'BRL',
  "source" TEXT NOT NULL,
  "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "hunterId" TEXT NOT NULL,
  CONSTRAINT "PriceRecord_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE INDEX "Hunter_userId_status_idx" ON "Hunter"("userId", "status");
CREATE INDEX "Hunter_origin_destination_idx" ON "Hunter"("origin", "destination");
CREATE INDEX "Alert_hunterId_createdAt_idx" ON "Alert"("hunterId", "createdAt");
CREATE INDEX "Alert_isRead_idx" ON "Alert"("isRead");
CREATE INDEX "PriceRecord_hunterId_capturedAt_idx" ON "PriceRecord"("hunterId", "capturedAt");

ALTER TABLE "Hunter"
  ADD CONSTRAINT "Hunter_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Alert"
  ADD CONSTRAINT "Alert_hunterId_fkey"
  FOREIGN KEY ("hunterId") REFERENCES "Hunter"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PriceRecord"
  ADD CONSTRAINT "PriceRecord_hunterId_fkey"
  FOREIGN KEY ("hunterId") REFERENCES "Hunter"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
