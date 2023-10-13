import { User } from "../../users/model/user.model";

export class Room {
	name: string;
	admin: User[];
	banned: User[];
	owner: User;
	users: User[];
	password: boolean;
	pwdValue: string;
	inviteOnly: boolean;


	constructor(name: string) {
		this.name = name;
		this.banned = [];
		this.users = [];
		this.admin = [];
		this.password = false;
		this.pwdValue = '';
		this.inviteOnly = false;
	}
}