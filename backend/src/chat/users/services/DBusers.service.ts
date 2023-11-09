// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
// import { Socket } from 'socket.io';
// import { ChatService } from 'src/chat/chat.service';
// import { User } from '../model/user.model';


// /**
//  * TODO Faire BLOCK
//  */

// @Injectable()
// export class UsersService {

// 	constructor(
// 		private readonly prismaService : PrismaClient
// 		) {}

// 	private users : User[] = [];

// 	async areFriends(curruser: User, friend: User) : Promise<any> {
// 		return this.prismaService.friends.findUnique({
// 			where: {
// 				id: [curruser.id, friend.id]
// 			}
// 		});
// 	}


// 	async addFriend(curruser: User, friend: User) : Promise<any> {
// 			const friendship = await this.prismaService.friends.upsert({
// 				where: {
// 					id: ([curruser.id, friend.id])
// 				},
// 				update: {},
// 				create: {
// 					userId: curruser.id,
// 					friendId: friend.id
// 				}
// 			});
// 			return friendship;

// 		// if (this.prismaService.friends.findUnique({
// 		// 	where: {
// 		// 		id: [curruser.id, friend.id]
// 		// 	}
// 		// }) === null) {
// 		// 	return this.prismaService.friend.create({
// 		// 		data: {
// 		// 			id: [curruser.id, friend.id]
// 		// 		}
// 		// 	});
// 		// }
// 	}


// 	async removeFriend(curruser: User, friend : User) : Promise<any> {
// 		return this.prismaService.friends.delete({
// 			where: {
// 				userId: curruser.id,
// 				friendId: friend.id
// 			}
// 		});
// 	}

// 	async blockUser(curruser: User, target: User) : Promise<any> {
// 		return this.prismaService.blocked.upsert({
// 			where: {
// 				userId: curruser.id,
// 				blockedId: target.id
// 			},
// 			update: {},
// 			create: {
// 				userId: curruser.id,
// 				blockedId: target.id,
// 				blockedAt: Date()
// 			}
// 		});
// 	}

// 	async addUser(id: string, uSocket: Socket, name: string) : Promise<any> {
// 		const newUser = await this.prismaService.user.create({
// 			data: {
// 				id: id,
// 				Socket: uSocket, 
// 				name: name
// 			}
// 		});
// 		return newUser;
// 	}

// 	async getUsers() {
// 		return this.prismaService.users.fondMany();
// 	}

// 	async clearUsers() : Promise<any> {
// 		//! Avant de pouvoir delete un user il faut delete tout ce qui lui appartient dans les autre tables.
// 		return this.prismaService.users.deleteMany({});
// 	}

// 	async alreadyRegisterdByName(name: string) : Promise<any> {
// 		//? Est ce que null c'est egal à undefined ?
// 		return this.prismaService.user.findUnique({
// 			data: {
// 				name: name
// 			},
// 		});
// 	}

// 	async alreadyRegisterdById(id: string) : Promise<any> {
// 		//? Est ce que null c'est egal à undefined ?
// 		return this.prismaService.user.findUnique({
// 			data: {
// 				id: id
// 			},
// 		});
// 	}

// 	async updateSocketId(name: string, id: string) : Promise<any> {
// 		return this.prismaService.user.update({
// 			where: {
// 				name: name
// 			},
// 			data: {
// 				id: id
// 			}
// 		});
// 	}

// 	async updateSocket(name: string, newSocket : Socket): Promise<any> {
// 		return this.prismaService.user.update({
// 			where : {
// 				name: name
// 			},
// 			data: {
// 				socket: newSocket
// 			}
// 		});
// 	}

// 	async updateName(name: string, id: string) : Promise<any> {
// 		return this.prismaService.user.update({
// 			where: {
// 				id : id
// 			},
// 			data : {
// 				name: name
// 			}
// 		});
// 	}

// 	async getUserById(id: string) : Promise<any> {
// 		return this.prismaService.user.findUnique({
// 			where: {id : id}
// 		});
// 	}

// 	async getUserbyName(name: string): Promise<any> {
// 		return this.prismaService.user.findUnique({
// 			where: {name: name}
// 		});
// 	}

// }
