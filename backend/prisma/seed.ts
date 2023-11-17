/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  await prisma.gameParticipation.deleteMany();
  await prisma.gameResult.deleteMany();
  await prisma.userAchievements.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
        email: 'alexislavaud191@gmail.com',
        totpSecret: 'KVAFEKKWOZ4SYZD5JVYWS6KWF5UU4LDCKNBDYUCUGVZVEV3ZJNOQ',
        authMethod: 'password',
        pseudo: 'alex191',
        totpEnabled: true,
        password: bcrypt.hashSync('mdp', bcrypt.genSaltSync()),
        // password: 
        //otpauth://totp/SecretKey?secret=KVAFEKKWOZ4SYZD5JVYWS6KWF5UU4LDCKNBDYUCUGVZVEV3ZJNOQ
        // To test on your own phone, generate a qr code with the text of the previous comment
        // And scan it.
    },
  });
  
    const user1 = await prisma.user.create({
      data: {
        id: 1,
        pseudo: "User1",
        authMethod: 'password',
        email: "user1@example.com",
        emailVerified: false,
        experience: 0,
      },
    });
  
    const user2 = await prisma.user.create({
      data: {
        id: 2,
        pseudo: "User2",
        authMethod: 'password',
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
        authMethod: 'password',
        emailVerified: false,
        experience: 0,
      },
    });
  
    // create achievements
    const achievement1 = await prisma.achievement.create({
      data: {
        name: "Achievement1",
        description: "First achievement",
        difficulty: 1,
        isHidden: false,
      },
    });
  
    const achievement2 = await prisma.achievement.create({
      data: {
        name: "Achievement2",
        description: "Second achievement",
        difficulty: 2,
        isHidden: true,
      },
    });

    const achievement3 = await prisma.achievement.create({
        data: {
          name: "Achievement3",
          description: "Third achievement",
          difficulty: 3,
          isHidden: false,
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
    // create game results
    const gameResult1 = await prisma.gameResult.create({
      data: {
        createdAt: new Date(),
        scored: 10,
        conceded: 5,
      },
    });
    
    const gameResult2 = await prisma.gameResult.create({
      data: {
        createdAt: new Date(),
        scored: 8,
        conceded: 10,
      },
    });
    
    // create game participations
    await prisma.gameParticipation.create({
      data: {
      user1Id: user1.id,
      user2Id: user3.id,
      gameResultId: gameResult1.id,
      },
    });
    
    await prisma.gameParticipation.create({
      data: {
      user1Id: user3.id,
      user2Id: user1.id,
      gameResultId: gameResult1.id,
      },
    });
    
    await prisma.gameParticipation.create({
      data: {
      user1Id: user1.id,
      user2Id: user2.id,
      gameResultId: gameResult2.id,
      },
    });
    
    await prisma.gameParticipation.create({
      data: {
      user1Id: user2.id,
      user2Id: user1.id,
      gameResultId: gameResult2.id,
      },
    });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
