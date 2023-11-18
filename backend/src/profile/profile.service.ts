/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export class CreateUserAchievementDto {
    userId: number;
    achievementId: number;
}

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaClient) {}
    
    async getProfileInfos(userId: number): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                pseudo: true,
                avatar: true,
            }
        });

        const achievement = await this.prisma.achievement.findUnique({
            where: { name: 'Newwww Avatar' },
            select: {
                id: true,
                name: true,
                description: true,
                difficulty: true,
                users: true,
            }
        })

        return {
            ...user,
            achievement: [achievement]
        };
    }

    async addAchievementToUser(dto: CreateUserAchievementDto): Promise<any> {
        const existingUserAchievement = await this.prisma.userAchievements.findFirst({
            where: {
                userId: dto.userId,
                achievementId: dto.achievementId
            }
        });

        console.log("-->", existingUserAchievement);
        if (existingUserAchievement) {
            throw new Error('Already connected');
        }

        return this.prisma.userAchievements.create({
            data: {
                user: {
                    connect: {
                        id: dto.userId
                    }
                },
                achievement: {
                    connect: {
                        id: dto.achievementId
                    }
                }
            },
        });
    }

    async addAvatar(avatarPath: string, userId: number): Promise<any> {
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
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