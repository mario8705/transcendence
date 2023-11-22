/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  await prisma.gameParticipation.deleteMany();
  await prisma.game.deleteMany();
  await prisma.userAchievements.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.user.deleteMany();
    const user1 = await prisma.user.create({
      data: {
        pseudo: "User1",
        email: "user1@example.com",
        emailVerified: false,
      },
    });
  
    const user2 = await prisma.user.create({
      data: {
        pseudo: "User2",
        email: "user2@example.com",
        emailVerified: false,
      },
    });
  
    const user3 = await prisma.user.create({
      data: {
        pseudo: "User3",
        email: "user3@example.com",
        emailVerified: false,
      },
    });
    
    const user4 = await prisma.user.create({
      data: {
        pseudo: "User4",
        email: "user4@example.com",
        emailVerified: false,
      },
    });

    const user5 = await prisma.user.create({
      data: {
        pseudo: "User5",
        email: "user5@example.com",
        emailVerified: false,
      },
    });


    // create achievements
    const achievement1 = await prisma.achievement.create({
      data: {
        name: "Achievement1",
        description: "First achievement",
        difficulty: 1,
      },
    });
  
    const achievement2 = await prisma.achievement.create({
      data: {
        name: "Achievement2",
        description: "Second achievement",
        difficulty: 2,
      },
    });

    const achievement3 = await prisma.achievement.create({
        data: {
          name: "Achievement3",
          description: "Third achievement",
          difficulty: 3,
        },
      });
  
    // assign achievements to users
    await prisma.userAchievements.create({
      data: {
        userId: user1.id,
        achievementId: achievement1.id,
      },
    });

    await prisma.userAchievements.create({
        data: {
          userId: user1.id,
          achievementId: achievement3.id,
        },
      });

      await prisma.userAchievements.create({
        data: {
          userId: user2.id,
          achievementId: achievement2.id,
        },
      });

      await prisma.userAchievements.create({
        data: {
          userId: user3.id,
          achievementId: achievement1.id,
        },
      });

      await prisma.userAchievements.create({
        data: {
          userId: user3.id,
          achievementId: achievement2.id,
        },
      });

      await prisma.userAchievements.create({
        data: {
          userId: user3.id,
          achievementId: achievement3.id,
        },
      });
  
    // and so on for other user-achievement relations
    // create game results
    const game1 = await prisma.game.create({
      data: {
        winnerScore: 10,
        looserScore: 5,
        winnerId: user1.id,
        looserId: user2.id
      },
    });
    
    const game2 = await prisma.game.create({
      data: {
        winnerScore: 10,
        looserScore: 3,
        winnerId: user1.id,
        looserId: user3.id
      },
    });

    const game3 = await prisma.game.create({
      data: {
        winnerScore: 10,
        looserScore: 9,
        winnerId: user3.id,
        looserId: user1.id
      },
    });

    const game4 = await prisma.game.create({
      data: {
        winnerScore: 10,
        looserScore: 4,
        winnerId: user1.id,
        looserId: user4.id
      },
    });
    
    // create game participations

    // GAME 1 Pair
    await prisma.gameParticipation.create({
      data: {
        userId: user1.id,
        gameId: game1.id,
        opponentId: user2.id
      },
    });
    await prisma.gameParticipation.create({
      data: {
        userId: user2.id,
        gameId: game1.id,
        opponentId: user1.id
      },
    });
    
    // GAME 2 Pair
    await prisma.gameParticipation.create({
      data: {
        userId: user1.id,
        gameId: game2.id,
        opponentId: user3.id
      },
    });
    await prisma.gameParticipation.create({
      data: {
        userId: user3.id,
        gameId: game2.id,
        opponentId: user1.id
      },
    });

    // GAME 3 Pair
    await prisma.gameParticipation.create({
      data: {
        userId: user3.id,
        gameId: game3.id,
        opponentId: user1.id
      },
    });
    await prisma.gameParticipation.create({
      data: {
        userId: user1.id,
        gameId: game3.id,
        opponentId: user3.id
      },
    });

    // GAME 4 Pair
    await prisma.gameParticipation.create({
      data: {
        userId: user1.id,
        gameId: game4.id,
        opponentId: user4.id
      },
    });
    await prisma.gameParticipation.create({
      data: {
        userId: user4.id,
        gameId: game4.id,
        opponentId: user1.id
      },
    });
  }
  
// execute the main function
main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
