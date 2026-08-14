CREATE TABLE "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'USER',
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Hunter" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "origin" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "departureFrom" DATETIME NOT NULL,
  "departureTo" DATETIME NOT NULL,
  "returnFrom" DATETIME,
  "returnTo" DATETIME,
  "maxPrice" REAL,
  "currentPrice" REAL,
  "previousPrice" REAL,
  "score" INTEGER NOT NULL DEFAULT 0,
  "confidence" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "userId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL,
  CONSTRAINT "Hunter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Hunter_userId_status_idx" ON "Hunter"("userId", "status");
CREATE INDEX "Hunter_origin_destination_idx" ON "Hunter"("origin", "destination");

CREATE TABLE "Alert" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "severity" TEXT NOT NULL DEFAULT 'INFO',
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "hunterId" TEXT NOT NULL,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Alert_hunterId_fkey" FOREIGN KEY ("hunterId") REFERENCES "Hunter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Alert_hunterId_createdAt_idx" ON "Alert"("hunterId", "createdAt");
CREATE INDEX "Alert_isRead_idx" ON "Alert"("isRead");

CREATE TABLE "PriceRecord" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "price" REAL NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'BRL',
  "source" TEXT NOT NULL,
  "capturedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "hunterId" TEXT NOT NULL,
  CONSTRAINT "PriceRecord_hunterId_fkey" FOREIGN KEY ("hunterId") REFERENCES "Hunter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "PriceRecord_hunterId_capturedAt_idx" ON "PriceRecord"("hunterId", "capturedAt");
