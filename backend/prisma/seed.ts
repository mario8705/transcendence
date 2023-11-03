/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
    const user1 = await prisma.user.create({
      data: {
        id: 1,
        pseudo: "User1",
        email: "user1@example.com",
        emailVerified: false,
        experience: 0,
      },
    });
  
    const user2 = await prisma.user.create({
      data: {
        id: 2,
        pseudo: "User2",
        email: "user2@example.com",
        emailVerified: false,
        experience: 0,
      },
    });
  
    const user3 = await prisma.user.create({
      data: {
        id: 3,
        pseudo: "User3",
        email: "user3@example.com",
        emailVerified: false,
        experience: 0,
      },
    });
  
    // create achievements
    const achievement1 = await prisma.achievement.create({
      data: {
        name: "Achievement1",
        description: "First achievement",
      },
    });
  
    const achievement2 = await prisma.achievement.create({
      data: {
        name: "Achievement2",
        description: "Second achievement",
      },
    });

    const achievement3 = await prisma.achievement.create({
        data: {
          name: "Achievement3",
          description: "Third achievement",
        },
      });
  
    // assign achievements to users
    await prisma.userAchievements.create({
      data: {
        userId: user1.id,
        achievementId: achievement1.id,
        // createdAt is automatically set to the current time
      },
    });

    await prisma.userAchievements.create({
        data: {
          userId: user1.id,
          achievementId: achievement3.id,
          // createdAt is automatically set to the current time
        },
      });

      await prisma.userAchievements.create({
        data: {
          userId: user2.id,
          achievementId: achievement2.id,
          // createdAt is automatically set to the current time
        },
      });

      await prisma.userAchievements.create({
        data: {
          userId: user3.id,
          achievementId: achievement1.id,
          // createdAt is automatically set to the current time
        },
      });

      await prisma.userAchievements.create({
        data: {
          userId: user3.id,
          achievementId: achievement2.id,
          // createdAt is automatically set to the current time
        },
      });

      await prisma.userAchievements.create({
        data: {
          userId: user3.id,
          achievementId: achievement3.id,
          // createdAt is automatically set to the current time
        },
      });
  
    // and so on for other user-achievement relations
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