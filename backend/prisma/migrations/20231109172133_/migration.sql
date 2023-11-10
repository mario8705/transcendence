/*
  Warnings:

  - You are about to drop the column `userId` on the `GameParticipation` table. All the data in the column will be lost.
  - Added the required column `userId1` to the `GameParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId2` to the `GameParticipation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameParticipation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId1" INTEGER NOT NULL,
    "userId2" INTEGER NOT NULL,
    "gameResultId" INTEGER NOT NULL,
    CONSTRAINT "GameParticipation_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GameParticipation_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GameParticipation_gameResultId_fkey" FOREIGN KEY ("gameResultId") REFERENCES "GameResult" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GameParticipation" ("gameResultId", "id") SELECT "gameResultId", "id" FROM "GameParticipation";
DROP TABLE "GameParticipation";
ALTER TABLE "new_GameParticipation" RENAME TO "GameParticipation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
