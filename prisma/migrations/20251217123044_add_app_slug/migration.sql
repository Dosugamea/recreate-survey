/*
  Warnings:

  - Added the required column `slug` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "privacyPolicyUrl" TEXT,
    "faviconImageUrl" TEXT,
    "copyrightNotice" TEXT,
    "contactEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
-- Set default slug for existing records based on name
INSERT INTO "new_App" ("contactEmail", "copyrightNotice", "createdAt", "faviconImageUrl", "id", "name", "privacyPolicyUrl", "updatedAt", "slug") 
SELECT 
    "contactEmail", 
    "copyrightNotice", 
    "createdAt", 
    "faviconImageUrl", 
    "id", 
    "name", 
    "privacyPolicyUrl", 
    "updatedAt",
    CASE 
        WHEN "name" = 'デフォルトアプリ' THEN 'default-app'
        ELSE LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE("name", ' ', '-'), '　', '-'), 'あ', 'a'), 'い', 'i'), 'う', 'u'), 'え', 'e'), 'お', 'o'), 'ア', 'a'), 'イ', 'i'), 'ウ', 'u')) || '-' || SUBSTR("id", 1, 8)
    END
FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
CREATE UNIQUE INDEX "App_slug_key" ON "App"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
