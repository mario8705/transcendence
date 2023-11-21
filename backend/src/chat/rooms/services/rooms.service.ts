import { Injectable } from '@nestjs/common';
import { ChatService } from 'src/chat/chat.service';
import { UsersService } from 'src/chat/users/services/users.service';
import { User } from '../../users/model/user.model';
import { Room } from '../model/room.model'
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';


/**
 * TODO Mettre le masque des permissions quand création ou join de channel
 */

@Injectable()
export class RoomService {

	private rooms : Room[] = [];
	
	// constructor(
	// 	private readonly prismaService : PrismaClient
	// 	) {}

	// async createRoom(name: string, user: User, option: {invite: boolean, key: boolean, value: string}): Promise<any> {
	// 	//! Il faut aussi ajouter au User qu'il est owner d'une room ++ au niveau du user est ce que je l'ai récupéré au préalable dans la db ?
	// 	this.prismaService.channel.create({
	// 		data: {
	// 			name: name,
	// 			ownerId: user.id,
	// 			createdAt: Date.now(),
	// 			password: option.value
	// 			//?Comment je vais pour la visibility ?
	// 		}
	// 	}); //* AAAAAH c'est trop compliqué, je ne suis pas contente.
		//TODO doit retourner l'ID de la room
	// }

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

	//TODO finir cette fonction
	// async joinRoom(curruser: User, roomname: string, option : {invite: boolean, key: boolean, value: string}): Promise<any> {
	// 	let room = this.prismaService.channel.findUnique({
	// 		where: {
	// 			name: roomname ///weird, what is the problem exactly ???
	// 	}});
	// 	if (room === null) {
	// 		const id = this.createRoom(roomname, curruser, option);
	// 		if (id !== undefined) {
	// 			const channelMembership = this.prismaService.channelMembership.create({
	// 			data: {
	// 				userId : curruser.id,
	// 				channelId: id,
	// 				joinedAt: Date(),
	// 				permissionMask: 4
	// 				}
	// 			});
	// 			return channelMembership;
	// 		}
	// 		return undefined;
	// 	}
	// 	else if (room !== null && this.prismaService.channelMembership.findUnique({where: {channelId : channelId, userId: curruser.id}}) === null) {
	// 		const id = this.prismaService.channel.findUnique({where : {name: roomname}}); //Je ne comprends rien purée. //!Il faut récupérer l'id de la room
	// 		const channelMembership = this.prismaService.channelMembership.create({
	// 			data: {
	// 				userId: curruser.id,
	// 				channelId: id,
	// 				joinedAt: Date(),
	// 				permissionMask: 1
	// 			}
	// 		});
	// 		return channelMembership;
	// 	}
	// }

	joinRoom(curruser: User, roomname: string, option: {invite: boolean, key: boolean, value: string}) : boolean {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room == undefined)	{
			room = this.createRoom(roomname, curruser, option);
			console.log("create room");
		}
		//ici faire les vérifications de mot de passe et d'invite only.
		else if (room.users.find((user) => user.name === curruser.name) === undefined) {
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

	// async roomExists(roomname: string) : Promise<any> {
	// 	return this.prismaService.channel.findUnique({where:{name: roomname}});
	// }

	roomExists(roomname: string) :boolean {
		if (this.rooms.find((room) => room.name === roomname) != undefined)
			return true;
		return false;
	}

	// async isUserinRoom(currUser: User, roomname: string) : Promise<any> {
	// 	return this.prismaService.channel.findUnique({where: {name : roomname, /*Ici il faut trouver le moyen de retrouver l'utilisateur */}});
	// }

	isUserinRoom(currUser: User, roomname: string) : boolean {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room != undefined) {
			if (room.users.find((user) => user.name === currUser.name))
				return true;
		}
		return false;
	}

	// async isRoomAdmin(curruser: User, roomname: string) : Promise<any> {
	// 	return this.prismaService.channel.findUnique({
	// 		where: {
	// 			name: roomname,
	// 			//regarder dans les admin si le user est admin
	// 		}
	// 	});
	// }

	isRoomAdmin(curruser: User, roomname: string) : boolean {
		const room = this.getRoom(roomname);
		if (room.admin.find((user) => user === curruser))
			return true;
		return false;
	}

	// async isRoomOwner(curruser: User, roomname: string) : Promise<any> {
	// 	return this.prismaService.channel.findUnique({
	// 		where: {
	// 			name: roomname,
	// 			//regarder dans les admin si le user est owner ou alors regarder la propriété du user.
	// 		}
	// 	});
	// }

	isRoomOwner(curruser: User, roomname: string) : boolean {
		const room = this.getRoom(roomname);
		if (room?.owner === curruser)
			return true;
		return false;
	}

	// async changePassword(curruser: User, roomname: string, option : {invite: boolean, key: boolean, value: string}) : Promise<any> {
	// 	return this.prismaService.channel.update({
	// 		where: {
	// 			name : roomname
	// 		},
	// 		data : {
	// 			password : option.value
	// 		}
	// 	});
	// }
 
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

	// async changeInviteOnly(curruser, roomname, option: {invite: boolean, key: boolean, value: string}) : Promise<any> {
	// 	if (option.invite === true) {
	// 				return this.prismaService.channel.update({
	// 		where: {
	// 			name: roomname
	// 		},
	// 		data: {
	// 			visibility: "private"
	// 		}
	// 	});
	// 	}
	// 	else
	// 		return this.prismaService.channel.update({where: {name: roomname}, data: {visibility: "public"}});
	// }

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

	// async removeUserfromRoom(curruser: User, roomname: string): Promise<any> {
	// 	return this.prismaService.channelMembership.delete({where: {userId: curruser.id}});
	// }

	removeUserfromRoom(curruser: User, roomname: string) : void {
		let room = this.rooms.find((room) => room.name === roomname);
		if (room != undefined) {
			var index = room.users.indexOf(curruser);
			if (index > -1)
				room.users.splice(index, 1);
		}
	}

	// async clearUsersfromRoom(roomname: string): Promise<any> {
	// 	return this.prismaService.channelMembership.deleteMany({
	// 		where: {
	// 			name: roomname //regarder comment on reconnait une room sans le nom
	// 		}
	// 	});
	// }

	clearUsersfromRoom(roomname: string) : void {
		let room = this.rooms.find((room) => room.name === roomname);
		if( room != undefined)
			room.users = [];
	}

	// async getUsersfromRoom(roomname: string) : Promise<any> {
	// 	const channelId = this.prismaService.channel.findUnique({where : {name: roomname}})?.id; //? Cette ligne n'a pas l'air d'être très contente.
	// 	return this.prismaService.channelMembership.findMany({
	// 		where: {
	// 			channelId: channelId
	// 		}
	// 	});
	// }

	getUsersfromRoom(roomname: string) {
		console.log(roomname);
		return this.rooms.find((room) => room.name === roomname)?.users;
	}
	
	// async getRooms() : Promise<any> {
	// 	return this.prismaService.channel.findMany();
	// }

	getRooms() : Room[] {
		return [...this.rooms];
	}

	// async getRoom(roomname: string) : Promise<any> {
	// 	return this.prismaService.channel.findUnique({where: {name : roomname}});
	// }

	getRoom(roomname: string) : Room {
		return this.rooms.find((room) => room.name === roomname);
	}

	//! Il y a surement d'autres endroits où il faut que j'enlève la personne right? Genre regarder si il est pas amdin ou owner. Oh lala la catastrophe.
	// async kickUser(curruser: User, roomname: string, target: User) : Promise<any> {
	// 	if (this.prismaService.channelMembership.findUnique({where: {name: roomname, userId: curruser.id}}) !== null) {
			
	// 		return this.prismaService.channelMembership.delete({
	// 			where: {
	// 				name: roomname, userId: curruser.id,
	// 				//comment je fais pour vérifier qu'il n'est pas owner ou administrateur ? 
	// 			}
	// 		});
	// 	}
	// 	else
	// 		console.log('user not in the room');
	// }

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

	// async clearRooms() : Promise<any> {
	// 	return this.prismaService.channel.deleteMany({});
	// }

	clearRooms() : void {
		this.rooms = [];
	}
 
	// async deleteRoom(roomname: string) : Promise<any> {// mais il faut supprimer d'autres choses avant, genre les channel membership.
		
	// 	this.clearUsersfromRoom(roomname);
	// 	return this.prismaService.channel.delete({
	// 		where: {
	// 			name: roomname
	// 		}
	// 	});
	// }

	deleteRoom(roomname: string) : {status: boolean, msg: string} {
		var room = this.getRoom(roomname);
		if (room !== undefined) {
			const index = this.rooms.indexOf(room);
			this.rooms.slice(index, 1);
			return {status: true, msg:''};
		}
		return {status: false, msg: roomname + ': no such room'};
	}
}