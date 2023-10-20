import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ChatService } from 'src/chat/chat.service';
// import { SocketService } from '../../socket/socket.service';
import { User } from '../model/user.model';

@Injectable()
export class UsersService {
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


	updateSocketid(name: string, id: string) {
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

	areFriends(currUser: User, friend: User) : boolean {
		if (currUser.friends.find((user) => user === friend) === undefined)
			return false;
		else
			return true;
	}

	addFriend(currUser: User, friend: User): boolean {
		// if (this.users.find((user) => user === friend) == undefined) {
		// 	console.log('existe pas');
		// 	return false;
		// }
		if (!this.areFriends(currUser, friend)) {
			currUser.friends.push(friend);
			friend.friends.push(currUser);
			console.log('befriended');
			console.log(currUser.name, ' ', this.getFriends(currUser));
			console.log(friend.name, ' ', this.getFriends(friend));
		}
		else {
			console.log("already friends");
		}
		return true;
	}

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
}
