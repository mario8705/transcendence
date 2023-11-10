/*
  Warnings:

  - You are about to drop the column `userId1` on the `GameParticipation` table. All the data in the column will be lost.
  - You are about to drop the column `userId2` on the `GameParticipation` table. All the data in the column will be lost.
  - Added the required column `opponentId` to the `GameResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `GameParticipation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scored" INTEGER NOT NULL,
    "conceded" INTEGER NOT NULL,
    "opponentId" INTEGER NOT NULL,
    CONSTRAINT "GameResult_opponentId_fkey" FOREIGN KEY ("opponentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GameResult" ("conceded", "createdAt", "id", "scored") SELECT "conceded", "createdAt", "id", "scored" FROM "GameResult";
DROP TABLE "GameResult";
ALTER TABLE "new_GameResult" RENAME TO "GameResult";
CREATE TABLE "new_GameParticipation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "gameResultId" INTEGER NOT NULL,
    CONSTRAINT "GameParticipation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GameParticipation_gameResultId_fkey" FOREIGN KEY ("gameResultId") REFERENCES "GameResult" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GameParticipation" ("gameResultId", "id") SELECT "gameResultId", "id" FROM "GameParticipation";
DROP TABLE "GameParticipation";
ALTER TABLE "new_GameParticipation" RENAME TO "GameParticipation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
