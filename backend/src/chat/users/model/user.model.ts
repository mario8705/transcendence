import { Socket } from "socket.io";

export class User {

	id: string;
	name: string;
	friends : User[];
	
	constructor(
		id:string,
		name: string,
		) {
			this.id = id,
		this.name = name,
		this.friends = []
	}
}