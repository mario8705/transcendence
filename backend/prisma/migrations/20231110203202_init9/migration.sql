/*
  Warnings:

  - Added the required column `difficulty` to the `Achievement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isHidden` to the `Achievement` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Achievement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "isHidden" BOOLEAN NOT NULL
);
INSERT INTO "new_Achievement" ("description", "id", "name") SELECT "description", "id", "name" FROM "Achievement";
DROP TABLE "Achievement";
ALTER TABLE "new_Achievement" RENAME TO "Achievement";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
