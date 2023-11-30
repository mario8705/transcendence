import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Socket } from 'socket.io';
import { SocketService } from 'src/socket/socket.service';


@Injectable()
export class UsersService {

	constructor(
		private readonly prismaService : PrismaService,
		private readonly socketService: SocketService
		) {}

	async areFriends(userId: number, friendId: number) : Promise<any> {
		const friends = await this.prismaService.friendship.findUnique({
			where: {
				userId_friendId: {
					userId: userId,
					friendId: friendId
				}
			}
		});
		if (friends == null) {
			return await this.prismaService.friendship.findUnique({
				where: {
					userId_friendId : {
						userId: friendId,
						friendId: userId
				}}
			})
		}
		else
			return friends;
	}


	// async addFriend(userId: number, friendId: number) : Promise<any> {
	// 		const friendship1 = await this.prismaService.friendship.createMany({
	// 			data:
	// 				{userId_friendId: {userId: userId, friendId: friendId}},
	// 				{userId_friendId: {userId: friendId, friendId: userId}},
	// 		});
	// 		return friendship;
	// }


	async removeFriend(userId: number, friendId: number) : Promise<any> {
		return await this.prismaService.friendship.delete({
			where: {
				userId_friendId :{
				userId: userId,
				friendId: friendId
			}}
		});
	}

	async blockUser(userId: number, targetId: number) : Promise<any> {
		return await this.prismaService.blocked.upsert({
			where: {
				userId_blockedId: {
				userId: userId,
				blockedId: targetId
			}},
			update: {},
			create: {
				userId: userId,
				blockedId: targetId
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
		if (id != undefined) {
			return this.prismaService.user.findUnique({
				where: {id : id}
			});
		}
	}

	// async getUserbyName(name: string): Promise<any> {
	// 	return this.prismaService.user.findUnique({
	// 		where: {
	// 			name: name
	// 		}
	// 	})
	// }

	async isUserBlocked(userId: number, targetId: number) : Promise<any> {
		return await this.prismaService.blocked.findUnique({
			where: {
				userId_blockedId: {
				userId: userId,
				blockedId: targetId
			}}
		});
	}

	async blockedByUser(userId: number, targetId: number) : Promise<any> {
		return await this.prismaService.blocked.findUnique({
			where: {
				userId_blockedId : {
				userId: targetId,
				blockedId: userId
			}}
		}); 
	}

	async unBlockUser(userId: number, targetId: number) : Promise<any> {
		return await this.prismaService.blocked.delete({where: {
			userId_blockedId: {
				userId: userId,
				blockedId: targetId
			}
		}});
	}

}
