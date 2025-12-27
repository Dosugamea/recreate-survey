/*
  Warnings:

  - Made the column `endAt` on table `Survey` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startAt` on table `Survey` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Survey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME NOT NULL,
    "themeColor" TEXT NOT NULL DEFAULT '#6c4034',
    "headerImage" TEXT,
    "bgImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Survey_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Survey" ("appId", "bgImage", "createdAt", "description", "endAt", "headerImage", "id", "isActive", "notes", "slug", "startAt", "themeColor", "title", "updatedAt") SELECT "appId", "bgImage", "createdAt", "description", "endAt", "headerImage", "id", "isActive", "notes", "slug", "startAt", "themeColor", "title", "updatedAt" FROM "Survey";
DROP TABLE "Survey";
ALTER TABLE "new_Survey" RENAME TO "Survey";
CREATE UNIQUE INDEX "Survey_slug_key" ON "Survey"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
