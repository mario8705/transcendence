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
