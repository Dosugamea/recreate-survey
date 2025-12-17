-- AlterTable
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "privacyPolicyUrl" TEXT,
    "faviconImageUrl" TEXT,
    "copyrightNotice" TEXT,
    "contactUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_App" ("id", "name", "slug", "privacyPolicyUrl", "faviconImageUrl", "copyrightNotice", "contactUrl", "createdAt", "updatedAt")
SELECT "id", "name", "slug", "privacyPolicyUrl", "faviconImageUrl", "copyrightNotice", "contactEmail", "createdAt", "updatedAt"
FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
CREATE UNIQUE INDEX "App_slug_key" ON "App"("slug");
PRAGMA foreign_keys=ON;

