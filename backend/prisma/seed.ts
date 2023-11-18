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
  await prisma.$executeRaw`UPDATE sqlite_sequence SET seq = 0 WHERE name = 'User';`;
  await prisma.$executeRaw`UPDATE sqlite_sequence SET seq = 0 WHERE name = 'GameResult';`;
  await prisma.$executeRaw`UPDATE sqlite_sequence SET seq = 0 WHERE name = 'Achievement';`;
    await prisma.user.create({
      data: {
        //id: 1,
        pseudo: "User1",
        email: "user1@example.com",
        emailVerified: false,
        experience: 0,
      },
    });
  
     await prisma.user.create({
      data: {
        //id: 2,
        pseudo: "User2",
        email: "user2@example.com",
        emailVerified: false,
        experience: 0,
      },
    });
  
    await prisma.user.create({
      data: {
        //id: 3,
        pseudo: "User3",
        email: "user3@example.com",
        emailVerified: false,
        experience: 0,
      },
    });
  
    // create achievements
    await prisma.achievement.create({
      data: {
        name: "Newwww Avatar",
        description: "Congrats, you've just changed you're avatar for the very first time!",
        difficulty: 1
      },
    });
  
    await prisma.achievement.create({
      data: {
        name: "Newwww Pseudo",
        description: "Congrats, you've just changed you're pseudo for the very first time!",
        difficulty: 1,
      },
    });

    await prisma.achievement.create({
      data: {
        name: "First Game",
        description: "It's you're first game ever!",
        difficulty: 1
      },
    });

    await prisma.achievement.create({
      data: {
        name: "You're getting used to Pong",
        description: "It's you're 10th game participation!",
        difficulty: 2
      },
    });

    await prisma.achievement.create({
      data: {
        name: "You're playing a lot",
        description: "It's you're 100th game participation!",
        difficulty: 3
      },
    });

    await prisma.achievement.create({
        data: {
          name: "3",
          description: "3 wins in a row",
          difficulty: 2,
        },
      });

      await prisma.achievement.create({
        data: {
          name: "3 total",
          description: "3 wins in total",
          difficulty: 1,
        },
      });

     await prisma.achievement.create({
        data: {
          name: "10",
          description: "10 wins in a row",
          difficulty: 2,
        },
      });

     await prisma.achievement.create({
        data: {
          name: "10 total",
          description: "10 wins in total",
          difficulty: 2,
        },
      });

      await prisma.achievement.create({
        data: {
          name: "100",
          description: "100 wins in a row",
          difficulty: 3,
        },
      });

      await prisma.achievement.create({
        data: {
          name: "100 total",
          description: "10 wins in total",
          difficulty: 3,
        },
      });

      await prisma.achievement.create({
        data: {
          name: "Small Leader",
          description: "You're the leader of a league that contains at least 3 participants",
          difficulty: 2,
        },
      });

      await prisma.achievement.create({
        data: {
          name: "Great Leader",
          description: "You're the leader of a league that contains at least 10 participants",
          difficulty: 3,
        },
      });

      await prisma.achievement.create({
        data: {
          name: "Perfect win",
          description: "You won 10-0",
          difficulty: 2,
        },
      });

      await prisma.achievement.create({
        data: {
          name: "You're a looser",
          description: "You lost 10-0",
          difficulty: 2,
        },
      });

      await prisma.achievement.create({
        data: {
          name: "New level",
          description: "You reached level 1!",
          difficulty: 1,
        },
      });

      await prisma.achievement.create({
        data: {
          name: "Level 21",
          description: "You reached level 21! You're such a good player, I've never seen that before.",
          difficulty: 3,
        },
      });

      await prisma.achievement.create({
        data: {
          name: "You like to talk?",
          description: "You've already sent 10 messages.",
          difficulty: 1,
        },
      });

      await prisma.achievement.create({
        data: {
          name: "Chatterbox",
          description: "You can't stop talking! It's you're 100th message!",
          difficulty: 2,
        },
      });
  
    // create game results
    await prisma.gameResult.create({
      data: {
        createdAt: new Date(),
        scored: 10,
        conceded: 5,
      },
    });
    
    await prisma.gameResult.create({
      data: {
        createdAt: new Date(),
        scored: 8,
        conceded: 10,
      },
    });
    
    // create game participations
    await prisma.gameParticipation.create({
      data: {
        user1Id: 1,
        user2Id: 3,
        gameResultId: 1,
      },
    });
    
    await prisma.gameParticipation.create({
      data: {
        user1Id: 3,
        user2Id: 1,
        gameResultId: 1,
      },
    });
    
    await prisma.gameParticipation.create({
      data: {
        user1Id: 1,
        user2Id: 2,
        gameResultId: 2,
      },
    });
    
    await prisma.gameParticipation.create({
      data: {
        user1Id: 2,
        user2Id: 1,
        gameResultId: 2,
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
