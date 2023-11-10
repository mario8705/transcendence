/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaClient) {}
    
    async getProfileInfos(userId: number): Promise<any> {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                pseudo: true,
                avatar: true
            },
        });
    }

    async addAvatar(avatarPath: string, pseudo: string): Promise<any> {
        const updatedUser = await this.prisma.user.update({
            where: { pseudo: pseudo },
            data: { avatar: avatarPath },
        });
        return { "avatar": updatedUser.avatar};
    }

    async getMatchHistory(userId: number): Promise<any> {
        const userWithGames = await this.prisma.user.findFirst({
            where: {
              id: userId,
            },
            include: {
              gameParticipationsCurrentUser: {
                include: {
                  gameResult: true, // include the related GameResult records
                  user2: true,
                },
              },
            },
        });
        return userWithGames;
    }

    async getLadder(): Promise<any> {
        const allUsers = await this.prisma.user.findMany({
            select: {
                id: true,
                pseudo: true,
                avatar: true,
                gameParticipationsCurrentUser: {
                    include: {
                        gameResult: {
                            select: {
                                scored: true,
                                conceded: true
                            }
                        }
                    }
                },
            }
        });
        return allUsers;
    }

    async getAchievements(userId: number): Promise<any> {
        const allAchievementsUnlocked = await this.prisma.userAchievements.findMany({
            where: {
                userId: userId,
            },
            include: {
                achievement: true,
            }
        });
        return allAchievementsUnlocked;
    }
}

//TODO: 
// 1 - Get all the necessary data in getProfileInfos (Maybe fetch at Ladder level with a new endpoint in nest)
// 2 - update schema if necessary
// 3 - Create new seed data
// 4 - Display profile

// Ask: About auth / currentUser
// How to Watch a Game ?

// Do Home Page
// Do Play Page
// Do Play against Friend Page
// Do Waiting for game to start Page
// Do the Watch Selection Page

/* Data needed

Profile
    current user's avatar
    current user's pseudo

Ladder
    All users (including their game results)

Statistics
    current user's game results

Match History
    current user's avatar
    current user's game results

Achievements
    current user's achievements
*/