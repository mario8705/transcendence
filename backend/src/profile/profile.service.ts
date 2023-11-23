/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserAchievementDto {
    userId: number;
    achievementId: number;
}

export class ChangePseudoDto {
    @IsNotEmpty()
    @IsString()
    pseudo: string
}

export class ChangeIsPopupShown {
    isShown: boolean
    achievementId: number
}

@Injectable()
export class ProfileService {
    constructor(private prisma: PrismaClient) {}
    
    async getProfileInfos(userId: number): Promise<any> {
        const currentUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                pseudo: true,
                avatar: true,
            }
        });

        const gamesParticipated = await this.prisma.gameParticipation.findMany({
            where: { userId: userId },
            select: {
                game: {
                    select: {
                        winner: true,
                        createdAt: true,
                    }
                }
            }
        });

        const achievements = await this.prisma.achievement.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                difficulty: true,
                users: true,
            }
        })

        const achievementsObj = {};
        achievements.forEach(achievement => {
            const filteredUsers = achievement.users.filter(user => {
                return user.userId === currentUser.id;
            });
            achievement.users = filteredUsers;
            achievementsObj[achievement.name] = achievement;
        });


        return {
            ...currentUser,
            gamesParticipated: gamesParticipated,
            achievements: achievementsObj,
        };
    }

    async addAchievementToUser(dto: CreateUserAchievementDto): Promise<any> {
        console.log('Adding achievement to user...', dto); // Log the start of the function

   const existingUserAchievement = await this.prisma.userAchievements.findFirst({
       where: {
           userId: dto.userId,
           achievementId: dto.achievementId
       }
   });

   console.log(`Existing user achievement: ${existingUserAchievement}`); // Log the existing user achievement

   if (existingUserAchievement) {
       throw new Error('Already connected');
   }

   const newUserAchievement = await this.prisma.userAchievements.create({
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

   console.log(`New user achievement: ${newUserAchievement}`); // Log the new user achievement

   return newUserAchievement;
    }

    async addAvatar(avatarPath: string, userId: number): Promise<any> {
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { avatar: avatarPath },
        });
        return { "avatar": updatedUser.avatar};
    }

    async changePseudo(dto: ChangePseudoDto, userId: number): Promise<any> {
        const updatedPseudo = await this.prisma.user.update({
            where: { id: userId },
            data: { pseudo: dto.pseudo },
        })
        return { "pseudo" : updatedPseudo.pseudo };
    }

    async getMatchHistory(userId: number): Promise<any> {
        const gameParticipations = await this.prisma.gameParticipation.findMany({
            where: {
              userId: userId,
            },
            include: {
              game: true,
            },
          });
         
          const matchHistory = await Promise.all(
            gameParticipations.map(async (participation) => {
              const opponentParticipation = await this.prisma.gameParticipation.findFirst({
                where: {
                  gameId: participation.gameId,
                  userId: {
                    not: userId,
                  },
                },
                include: {
                  user: true,
                },
              });
         
              return {
                game: participation.game,
                opponent: opponentParticipation?.user,
              };
            })
            )
         
          return matchHistory;
    }

    async getLadder(): Promise<any> {
        const allUsers = await this.prisma.user.findMany({
            select: {
                id: true,
                pseudo: true,
                avatar: true,
                gameParticipation: {
                    include: {
                        game: {
                            select: {
                                winner: true,
                                loser: true
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