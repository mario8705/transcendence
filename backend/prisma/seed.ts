/* eslint-disable prettier/prettier */
import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  await prisma.gameParticipation.deleteMany();
  await prisma.gameResult.deleteMany();
  await prisma.userAchievements.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.user.deleteMany();
    const user1 = await prisma.user.create({
      data: {
        //id: 1,
        pseudo: "User1",
        email: "user1@example.com",
        emailVerified: false,
        experience: 0,
      },
    });
  
    const user2 = await prisma.user.create({
      data: {
        //id: 2,
        pseudo: "User2",
        email: "user2@example.com",
        emailVerified: false,
        experience: 0,
      },
    });
  
    const user3 = await prisma.user.create({
      data: {
        //id: 3,
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
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
// import {PrismaClient} from '@prisma/client'

// const prisma = new PrismaClient();

// async function main() {
// 	const user1 = await prisma.user.create({
// 		data: {
// 			id: 1,
// 			email:  "user1@example.fr",
// 			emailVerified: true
// 		}
// 	});

// 	const user2 = await prisma.user.create({
// 		data: {
// 			id: 2,
// 			email:  "user1@example.fr",
// 			emailVerified: true
// 		}
// 	});

// 	const user3 = await prisma.user.create({
// 		data: {
// 			id: 3,
// 			email:  "user1@example.fr",
// 			emailVerified: true
// 		}
// 	});

// 	const friendship1 = await prisma.friends.create({
// 		data: {
// 			userId: 1,
// 			friendId: 2,
// 			user: user1,
// 			friend: user2 
// 		}
// 	});

// 	const friendship2 = await prisma.friends.create({
// 		data: {
// 			userId:2,
// 			friendId: 3,
// 			user: user2,
// 			friend: user3
// 		}
// 	});

// }

// main()
// 	.catch((e) => {
// 		console.error(e);
// 	})
// 	.finally(async () => {
// 		await prisma.$disconnect();
// 	});
