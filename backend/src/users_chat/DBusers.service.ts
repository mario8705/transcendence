import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';


@Injectable()
export class UsersService {

	constructor(
		private readonly prismaService : PrismaClient,
		private readonly socketService: SocketService
		) {}

	async areFriends(user: any, friend: any) : Promise<any> {
		const friends = await this.prismaService.friendship.findUnique({
			where: {
				userId_friendId: {
					userId: user.id,
					friendId: friend.id
				}
			}
		});
		if (friends == null) {
			return await this.prismaService.friendship.findUnique({
				where: {
					userId_friendId : {
						userId: friend.id,
						friendId: user.id
				}}
			})
		}
		else
			return friends;
	}


	async addFriend(user: any, friend: any) : Promise<any> {
			const friendship = await this.prismaService.friendship.createMany({
				data: [
					{userId_friendId: {userId: user.id, friendId: friend.id}},
					{userId_friendId: {userId: friend.id, friendId: user.id}}
				]
			})
			return friendship;
	}


	async removeFriend(user: any, friend : any) : Promise<any> {
		return await this.prismaService.friendship.delete({
			where: {
				userId_friendId :{
				userId: user.id,
				friendId: friend.id
			}}
		});
	}

	async blockUser(user: any, target: any) : Promise<any> {
		return await this.prismaService.blocked.upsert({
			where: {
				userId_blockedId: {
				userId: user.id,
				blockedId: target.id
			}},
			update: {},
			create: {
				userId: user.id,
				blockedId: target.id
			}
		});
	}

	// async addUser(socket: Socket, name: string,) : Promise<any> { //! revoir ça ++ utilsier socket service
	// 	const newUser = await this.prismaService.user.create({
	// 		data: {
	// 			name: name
	// 		}
	// 	});
	// 	// this.connectedUsers.map((obj) => {
	// 	// 	if (obj.userId === newUser.id) {
	// 	// 		return;
	// 	// 	}
	// 	// 	else {
	// 	// 		this.connectedUsers.push({userId: newUser.id, sockets: []});
	// 	// 		this.connectedUsers.map((obj) => { 
	// 	// 			if (obj.userId === newUser.id) { 
	// 	// 				obj.sockets.push(socket);
	// 	// 		}});
	// 	// 	}
	// 	// })
	// 	return newUser;
	// }

	async getUsers() {
		return this.prismaService.user.findMany({select: {}});
	}

	async clearUsers() : Promise<any> {
		this.prismaService.channelMembership.deleteMany({});
		this.prismaService.friendship.deleteMany({});
		this.socketService.deleteAllSockets();
		return this.prismaService.user.deleteMany({});
	}

	// async alreadyRegisterdByName(name: string) : Promise<any> { //eessayer si je dois utiliser select ou pas
	// 	return this.prismaService.user.findUnique({
	// 		where: {
	// 			name: name
	// 		},
	// 		select: {}
	// 	});
	// }

	async alreadyRegisterdById(id: number) : Promise<any> {
		return this.prismaService.user.findUnique({
			where: {
				id: id
			}
		});
	}

	// addSocket(user: any, socket: Socket) {
	// 	this.connectedUsers.map((obj) => {
	// 		if (obj.userId === user.id) {
	// 			obj.sockets.push(socket);
	// 		}
	// 	})
	// }

	// async updateSocketId(name: string, id: number) : Promise<any> {
	// 	return this.prismaService.user.update({
	// 		where: {
	// 			name: name
	// 		},
	// 		data: {
	// 			id: id
	// 		}
	// 	});
	// }

	// async updateSocket(name: string, newSocket : Socket): Promise<any> {
	// 	return this.prismaService.user.update({
	// 		where : {
	// 			name: name
	// 		},
	// 		data: {
	// 			Socket: newSocket
	// 		}
	// 	});
	// }

	async updateName(pseudo: string, id: number) : Promise<any> {
		return this.prismaService.user.update({
			where: {
				id : id
			},
			data : {
				pseudo: pseudo
			}
		});
	}

	async getUserById(id: number) : Promise<any> {
		return this.prismaService.user.findUnique({
			where: {id : id}
		});
	}

	// async getUserbyName(name: string): Promise<any> {
	// 	return this.prismaService.user.findUnique({
	// 		where: {
	// 			name: name
	// 		}
	// 	})
	// }

	async isUserBlocked(user: any, target: any) : Promise<any> {
		return await this.prismaService.blocked.findUnique({
			where: {
				userId_blockedId: {
				userId: user.id,
				blockedId: target.id
			}}
		});
	}

	async blockedByUser(user: any, target: any) : Promise<any> {
		return await this.prismaService.blocked.findUnique({
			where: {
				userId_blockedId : {
				userId: target.id,
				blockedId: user.id
			}}
		}); 
	}

}
