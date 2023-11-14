/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import { brotliDecompressSync } from 'zlib';
import { UsersService } from './services/users.service';

@Controller("users")
export class UserController {

	userService: UsersService;

	@Get('allUsers')
	getAllUsers() {
		return this.userService.getUsers();
	}

	

	
	@Post("messages")
	async messages(
	@Body('username') username : string,
	@Body('message') message : string
	) {
		return 'test';
	}
}
