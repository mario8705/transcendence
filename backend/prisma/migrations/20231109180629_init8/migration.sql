/*
  Warnings:

  - You are about to drop the column `userId` on the `GameParticipation` table. All the data in the column will be lost.
  - You are about to drop the column `opponentId` on the `GameResult` table. All the data in the column will be lost.
  - Added the required column `user1Id` to the `GameParticipation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user2Id` to the `GameParticipation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GameParticipation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameResultId" INTEGER NOT NULL,
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,
    CONSTRAINT "GameParticipation_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GameParticipation_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GameParticipation_gameResultId_fkey" FOREIGN KEY ("gameResultId") REFERENCES "GameResult" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_GameParticipation" ("gameResultId", "id") SELECT "gameResultId", "id" FROM "GameParticipation";
DROP TABLE "GameParticipation";
ALTER TABLE "new_GameParticipation" RENAME TO "GameParticipation";
CREATE TABLE "new_GameResult" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scored" INTEGER NOT NULL,
    "conceded" INTEGER NOT NULL
);
INSERT INTO "new_GameResult" ("conceded", "createdAt", "id", "scored") SELECT "conceded", "createdAt", "id", "scored" FROM "GameResult";
DROP TABLE "GameResult";
ALTER TABLE "new_GameResult" RENAME TO "GameResult";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
