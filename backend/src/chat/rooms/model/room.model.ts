import { User } from "src/modules/users/model/user.model";

export class Room {
	name: string;
	admin: User;
	users: User[];
	password: boolean;
	pwdValue: string;
	inviteOnly: boolean;


	constructor(name: string) {
		this.name = name;
		this.users = [];
		this.password = false;
		this.pwdValue = '';
		this.inviteOnly = false;
	}
}