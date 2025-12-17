/*
  Warnings:

  - Added the required column `appId` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "privacyPolicyUrl" TEXT,
    "faviconImageUrl" TEXT,
    "copyrightNotice" TEXT,
    "contactEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Create default app for existing surveys
INSERT INTO "App" ("id", "name", "createdAt", "updatedAt") 
VALUES ('default-app-id', 'デフォルトアプリ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Survey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "appId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startAt" DATETIME,
    "endAt" DATETIME,
    "themeColor" TEXT NOT NULL DEFAULT '#6c4034',
    "headerImage" TEXT,
    "bgImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Survey_appId_fkey" FOREIGN KEY ("appId") REFERENCES "App" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Survey" ("bgImage", "createdAt", "description", "endAt", "headerImage", "id", "isActive", "slug", "startAt", "themeColor", "title", "updatedAt", "appId") 
SELECT "bgImage", "createdAt", "description", "endAt", "headerImage", "id", "isActive", "slug", "startAt", "themeColor", "title", "updatedAt", 'default-app-id' FROM "Survey";
DROP TABLE "Survey";
ALTER TABLE "new_Survey" RENAME TO "Survey";
CREATE UNIQUE INDEX "Survey_slug_key" ON "Survey"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
