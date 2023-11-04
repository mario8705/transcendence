import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
// import { SocketService } from '../../socket/socket.service';
import { User } from '../model/user.model';


/**
 * TODO Faire BLOCK
 */

@Injectable()
export class UsersService {

	constructor(
		private readonly prismaService : PrismaClient
		) {}

	private users : User[] = [];

	addUser(id: string, uSocket: Socket, name: string) {
		const newUser = new User(id, uSocket, name);
		console.log(this.users.push(newUser));
		return 'coucou';
	}

	getUsers() {
		return [...this.users];
	}

	clearUsers() {
		this.users = [];
	}

	alreadyRegisterdByName(name: string) : User | undefined {
		return this.users.find((user) => user.name === name);
	}

	alreadyRegisterdById(id: string) : User | undefined {
		return this.users.find((user) => user.id === id);
	}

	updateSocketId(name: string, id: string) {
		const user : User = this.users.find((user) => user.name === name);
		user.id = id;
		console.log([...this.users]);
	}

	updateSocket(name: string, newSocket: Socket) :void {
		const user : User = this.users.find((user) => user.name === name);
		if (user != undefined) {
			user.socket = newSocket;
		}
	}

	updateName(name: string, id: string) {
		const user : User = this.users.find((user) => user.id === id);
		user.name = name;
		console.log([...this.users]);
	}

	getUserbyId(id: string) {
		return this.users.find((user) => user.id === id);
	}


	getUserbyName(name: string) {
		return this.users.find((user) => user.name === name);
	}

	// async areFriends(curruser: User, friend: User) : Promise<any> {
	// 	return this.prismaService.friends.findUnique({
	// 		where: {
	// 			id: [curruser.id, friend.id]
	// 		}
	// 	});
	// }

	areFriends(curruser: User, friend: User) : boolean {
		if (curruser.friends.find((user) => user === friend) === undefined)
			return false;
		else
			return true;
	}

	// async addFriend(curruser: User, friend: User) : Promise<any> {
	// 		const friendship = await this.prismaService.friends.upsert({
	// 			where: {
	// 				id: ([curruser.id, friend.id])
	// 			},
	// 			update: {},
	// 			create: {
	// 				userId: curruser.id,
	// 				friendId: friend.id
	// 			}
	// 		});
	// 		return friendship;

	// 	// if (this.prismaService.friends.findUnique({
	// 	// 	where: {
	// 	// 		id: [curruser.id, friend.id]
	// 	// 	}
	// 	// }) === null) {
	// 	// 	return this.prismaService.friend.create({
	// 	// 		data: {
	// 	// 			id: [curruser.id, friend.id]
	// 	// 		}
	// 	// 	});
	// 	// }
	// }

	addFriend(curruser: User, friend: User): boolean {
		// if (this.users.find((user) => user === friend) == undefined) {
		// 	console.log('existe pas');
		// 	return false;
		// }
		if (!this.areFriends(curruser, friend)) {
			curruser.friends.push(friend);
			friend.friends.push(curruser);
			console.log('befriended');
			console.log(curruser.name, ' ', this.getFriends(curruser));
			console.log(friend.name, ' ', this.getFriends(friend));
		}
		else {
			console.log("already friends");
		}
		return true;
	}

	// async removeFriend(curruser: User, friend : User) : Promise<any> {
	// 	return this.prismaService.friends.delete({
	// 		where: {
	// 			userId: curruser.id,
	// 			friendId: friend.id
	// 		}
	// 	});
	// }

	removeFriend(currUser: User, friend: User) : any {
		if (this.users.find((user) => user === friend) == undefined)
			return;
		if (this.areFriends(currUser, friend))
			currUser.friends.splice(currUser.friends.indexOf(friend), 1);
		else
			console.log("not friends");
		return currUser.friends;
	}

	getFriends(currUser: User) : any {
		return currUser.friends;
	}

	// async blockUser(curruser: User, target: User) : Promise<any> {
	// 	return this.prismaService.blocked.upsert({
	// 		where: {
	// 			userId: curruser.id,
	// 			blockedId: target.id
	// 		},
	// 		update: {},
	// 		create: {
	// 			userId: curruser.id,
	// 			blockedId: target.id,
	// 			blockedAt: Date()
	// 		}
	// 	});
	// }
}

/* //*Fonctions avec la database.

	async addUser(id: string, uSocket: Socket, name: string) : Promise<any> {
		const newUser = await this.prismaService.user.create({
			data: {
				id: id,
				Socket: uSocket, 
				name: name
			}
		});
		return newUser;
	}

	async getUsers() {
		return this.prismaService.users.fondMany();
	}

	async clearUsers() : Promise<any> {
		//! Avant de pouvoir delete un user il faut delete tout ce qui lui appartient dans les autre tables.
		return this.prismaService.users.deleteMany({});
	}

	async alreadyRegisterdByName(name: string) : Promise<any> {
		//? Est ce que null c'est egal à undefined ?
		return this.prismaService.user.findUnique({
			data: {
				name: name
			},
		});
	}

	async alreadyRegisterdById(id: string) : Promise<any> {
		//? Est ce que null c'est egal à undefined ?
		return this.prismaService.user.findUnique({
			data: {
				id: id
			},
		});
	}

	async updateSocketId(name: string, id: string) : Promise<any> {
		return this.prismaService.user.update({
			where: {
				name: name
			},
			data: {
				id: id
			}
		});
	}

	async updateSocket(name: string, newSocket : Socket): Promise<any> {
		return this.prismaService.user.update({
			where : {
				name: name
			},
			data: {
				socket: newSocket
			}
		});
	}

	async updateName(name: string, id: string) : Promise<any> {
		return this.prismaService.user.update({
			where: {
				id : id
			},
			data : {
				name: name
			}
		});
	}

	async getUserById(id: string) : Promise<any> {
		return this.prismaService.user.findUnique({
			where: {id : id}
		});
	}

	async getUserbyName(name: string): Promise<any> {
		return this.prismaService.user.findUnique({
			where: {name: name}
		});
	}

*/

