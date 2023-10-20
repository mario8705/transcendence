import { Injectable } from '@nestjs/common';
import { truncateSync } from 'fs';
import { userInfo } from 'os';
import { ChatService } from 'src/chat/chat.service';
import { UsersService } from 'src/chat/users/services/users.service';
import { User } from '../../users/model/user.model';
import { Room } from '../model/room.model'
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class RoomService {

	private rooms : Room[] = [];

	createRoom(name: string, user: User, option: {invite: boolean, key: boolean, value: string}) : Room {
		const id = uuidv4(); // prévoir de rajouter cet id dans la membership database
		const newRoom = new Room(name, id);
		newRoom.owner = user;
		newRoom.admin.push(user);
		if (option.invite === true)
			newRoom.inviteOnly = true;
		if (option.key === true)
			newRoom.pwdValue = option.value;
		this.rooms.push(newRoom);
		return newRoom;
	}

	joinRoom(curruser: User, roomname: string, option: {invite: boolean, key: boolean, value: string}) : boolean {
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
			else if (room.pwdValue === undefined) {//! Attention est ce qu'il faut faire cette vérification ? On peut rentrer quoi qu'il arrive si il y a pas besoin de mdp 
				if (option.value !== room.pwdValue)
				return false;	
			}
			console.log("push");
			room?.users.push(curruser);
		}
		else {
			console.log(curruser.name, " is already in ", roomname);
			return false;
		}
		console.log(curruser.name, ' joined room: ', roomname);
		return true;
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

	isRoomAdmin(curruser: User, roomname: string) : boolean {
		const room = this.getRoom(roomname);
		if (room.admin.find((user) => user === curruser))
			return true;
		return false;
	}

	isRoomOwner(curruser: User, roomname: string) : boolean {
		const room = this.getRoom(roomname);
		if (room?.owner === curruser)
			return true;
		return false;
	}
 
	changePassword(curruser: User, roomname: string, option: {invite: boolean, key: boolean, value: string}) : boolean {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room !== undefined) {
			if (room.admin.find((user) => user === curruser)) {
				if (option.key === true)
					room.pwdValue = option.value;
				else {
					room.pwdValue = undefined;
				}
				return true;
			}
		}
		return false;
	}

	changeInviteOnly(curruser: User, roomname: string, option: {invite: boolean, key: boolean, value: string}) {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room !== undefined) {
			if (room.admin.find((user) => user === curruser)) {
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
		console.log(roomname);
		return this.rooms.find((room) => room.name === roomname)?.users;
	}

	getRooms() : Room[] {
		return [...this.rooms];
	}

	getRoom(roomname: string) : Room {
		return this.rooms.find((room) => room.name === roomname);
	}

	kickUser(curruser: User, roomname: string, target: User) : {status: boolean, msg: string} {
		if (this.roomExists(roomname)) {
			let room = this.getRoom(roomname);
			if (room.admin.find((user) => user === curruser)) {
				if (this.isUserinRoom(target, roomname) && !this.isRoomOwner(target, roomname)) {
					room.users.splice(room.users.indexOf(target), 1);
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

	banUser(curruser: User, roomname: string, target: string) : {status: boolean, msg: string} {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room) {
			let usertarget = room.users.find((user) => user.name === target);
			if (usertarget) {
				room.users.splice(room.users.indexOf(usertarget), 1);
				return ({status: true, msg: ''});
			}
			else
				return {status: false, msg: "user not in room"};
		}
		else
			return ({status: false, msg: "no such room"});
		
	}

	muteUser(curruser: User, roomname: string, target: string) : {status: boolean, msg: string} {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room) {
			//comment je fais pour mute quelqu'un ? Il faut que je trouve un solution. C'est un peu compliqué
		}
		return ({status: false, msg: "room doesn't exist"});
	}

	
	addAdmin(roomname: string, name: string): {status: boolean, msg: string} {
		let room = this.rooms.find((room) => room.name == roomname);
		if (room) {
			const target = room.users.find((user) => user.name === name);
			if (target) {
				room.admin.push(target);
				return {status: true, msg: ''};
			}
			else
				return {status: false, msg: name + ': is not in this room'};
		}
		return {status: false, msg: roomname + ': no such channel'};
	}

	kickAdmin(roomname: string, name: string) : {status: boolean, msg: string} {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room) {
			const target = room.users.find((user) => user.name === name);
			if (target && room.admin.find((user) => user === target) != undefined) {
				room.admin.splice(room.admin.indexOf(target), 1);
				return ({status: true, msg: ''});
			}
			else
				return ({status: false, msg: name + ': target not in the room OR not an admin'});
				
			}
		else
			return {status: false, msg: roomname + ' no such room'};
	}

	addPwd(roomname: string, pwd: string) : {status: boolean, msg: string} {
		let room = this.getRoom(roomname);
		if (room) {
			room.pwdValue = pwd;
			return {status: true, msg: ''};
		}
		else
			return {status: false, msg : roomname + ': no such room'};
	}

	rmPwd(roomname: string) : {status: boolean, msg : string} {
		let room = this.getRoom(roomname);
		if (room) {
			room.pwdValue = undefined;
			return {status: true, msg: ''};
		}
		else
			return {status: false, msg: roomname + ': no such room'};
	}

	addInvite(roomname: string) : {status: boolean, msg: string} {
		let room = this.getRoom(roomname);
		if (room) {
			room.inviteOnly = true;
			return {status: true, msg: ''};
		}
		return {status: false, msg: roomname + ': no such room'};
	}

	rmInvite(roomname: string) : {status: boolean, msg: string} {
		let room = this.getRoom(roomname);
		if (room) {
			room.inviteOnly = false;
			return {status: true, msg: ''};
		}
		return {status: false, msg: roomname + ': no such room'};
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
