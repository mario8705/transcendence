import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/model/user.model';
import { SocketService } from 'src/chatmodules/socket/socket.service';
import { Room } from '../model/room.model'

@Injectable()
export class RoomService extends SocketService {
	private rooms : Room[] = [];

	createRoom(name: string, user: User, option: {invite: boolean, key: boolean, value: string}) : Room {
		const newRoom = new Room(name);
		newRoom.admin = user;
		if (option.invite === true)
			newRoom.inviteOnly = true;
		if (option.key === true)
			newRoom.pwdValue = option.value;
		this.rooms.push(newRoom);
		return newRoom;
	}

	joinRoom(curruser: User, roomname: string, option: {invite: boolean, key: boolean, value: string}) : void {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room == undefined)	{
			room = this.createRoom(roomname, curruser, option);
			console.log("create room");
		}
		//ici faire les vérifications de mot de passe et d'invite only.
		if (room.users.find((user) => user.name === curruser.name) === undefined) {
			if (room.inviteOnly)  /* trouver si il a été invité */ {
				console.log('inviteOnly');
				//return si il n'a pas été invité.
			}
			else if (room.password) {
				if (option.value !== room.pwdValue)
				return;	
			}
			console.log("push");
			room?.users.push(curruser);
		}
		else {
			console.log(curruser.name, " is already in ", roomname);
			return;
		}
		console.log(curruser.name, ' joined room: ', roomname);
	}

	roomExists(roomname: string) :boolean {
		if (this.rooms.find((room) => room.name === roomname) != undefined)
			return true;
		return false;
	}

	isUserinRoom(currUser: User, roomname: string) : boolean {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room != undefined) {
			if (room.users.find((user) => user.name === currUser.name))
				return true;
		}
		return false;
	}

	isUserAdmin(curruser: User, roomname: string) : boolean {
		const room = this.getRoom(roomname);
		if (room.admin === curruser)
			return true;
		return false;
	}

	changePassword(curruser: User, roomname: string, option: {invite: boolean, key: boolean, value: string}) : boolean {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room !== undefined) {
			if (room.admin === curruser) {
				if (option.key === true)
					room.pwdValue = option.value;
				else {
					room.password = false;
					room.pwdValue = '';
				}
				return true;
			}
		}
		return false;
	}

	changeInviteOnly(curruser: User, roomname: string, option: {invite: boolean, key: boolean, value: string}) {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room !== undefined) {
			if (room.admin === curruser) {
				if (option.invite === true)
					room.inviteOnly = true;
				else
					room.inviteOnly = false;
				return true;
			}
		}
		return false;
	}

	removeUserfromRoom(curUser: User, roomname: string) : void {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room != undefined) {
			var index = room.users.indexOf(curUser);
			if (index > -1)
				room.users.splice(index, 1);
		}
	}

	clearUsersfromRoom(roomname: string) : void {
		let room = this.rooms.find((room) => room.name === roomname);
		if( room != undefined)
			room.users = [];
	}

	getUsersfromRoom(roomname: string) {
		return this.rooms.find((room) => room.name === roomname).users;
	}

	getRooms() : Room[] {
		return [...this.rooms];
	}

	getRoom(roomname: string) : Room {
		return this.rooms.find((room) => room.name === roomname);
	}

	kick(roomname: string, curruser: User, target: User) {
		if (this.roomExists(roomname)) {
			let room = this.getRoom(roomname);
			if (room.admin === curruser) {
				if (this.isUserinRoom(target, roomname)) {
					room.users.slice(room.users.indexOf(target), 1);
					console.log(room.users);
					console.log(target.name, ' has been successfully removed from the room');
				}
				else
					console.log("this user is not in the room");
			}
			else {
				console.log(curruser.name, " not admin");
			}
		}
		else
			return;
	}

	clearRooms() : void {
		this.rooms = [];
	}

	deleteRoom(roomname: string) : void {
		var room = this.getRoom(roomname);
		const index = this.rooms.indexOf(room);
		this.rooms.slice(index, 1);
	}
}
