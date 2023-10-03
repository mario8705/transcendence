import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

const BALL_SPEED_MOD = 250;
const PADDLE_SPEED = 500;
const BALL_DEFAULT_RADIUS = 15;
const BALL_SPEED_Y = 5;
const BALL_SPEED_X = 1.5;

const WIDTH = 1000;
const HEIGHT = 550;

const GAME_MAX_GOAL = 2;

const REFRESH_RATE = 16.6667;

interface scoreElem {
	leftPlayer: number,
	rightPlayer: number,
}

interface paddleElem {
	x: number,
	y: number,
	width: number,
	length: number
}

interface ballElem {
	speed: {x: number, y: number},
	speedModifyer: number,
	x: number,
	y: number,
	radius: number,
}

class GameEngine {

	server: Server;
	socketLeft: string;
	socketRight: string;

	constructor(server: Server) {
		this.server = server;
	}

	leftPad = {
		x: 5,
		y: Math.round(HEIGHT / 2) - Math.round(WIDTH / 20),
		width: 10,
		length: Math.round(WIDTH / 10)
	}
	rightPad = {
		x: WIDTH - 5,
		y: 0,//Math.round(HEIGHT / 2) - Math.round(WIDTH / 20),
		width: 10,
		length: HEIGHT //Math.round(WIDTH / 10)
	}
	ball = {
		speed: {x: 1, y: 1},
		speedModifyer: BALL_SPEED_MOD,
		x: Math.round(WIDTH / 2),
		y: Math.round(HEIGHT / 2),
		radius: BALL_DEFAULT_RADIUS,
	}
	score = {
		leftPlayer: 0,
		rightPlayer: 0
	}
	keyState = {
		leftPadArrowUp: false,
		leftPadArrowDown: false,
		rightPaArrowdUp: false,
		rightPadArrowDown: false,
	}

	resetGamePosition() {
		while (Math.abs(this.ball.speed.y) <= 0.2 || Math.abs(this.ball.speed.y) >= 0.9) {
			const heading = Math.random() * (2 * Math.PI - 0) + 0;
			this.ball.speed = { x: BALL_SPEED_X, y: Math.sin(heading) }
		}

		this.ball.x = Math.round(WIDTH / 2);
		this.ball.y = Math.round(HEIGHT / 2);

		this.leftPad.y = Math.round(HEIGHT / 2) - Math.round(this.leftPad.length / 2);
		this.rightPad.y = 0; //Math.round(HEIGHT / 2) - Math.round(this.rightPad.length / 2);

		this.server
			.to([this.socketLeft, this.socketRight])
			.emit("resetPosition", [this.ball.speed, this.ball.x, this.ball.y, this.leftPad.y, this.rightPad.y]);
	}

	gameFinished() {
		if (this.score.leftPlayer >= GAME_MAX_GOAL || this.score.rightPlayer >= GAME_MAX_GOAL) {
			this.server
				.to([this.socketLeft, this.socketRight])
				.emit("gameFinished");
			return true;
		}
		else
			return false;
	}

	checkGoal() {
		if (this.ball.x - this.ball.radius <= 0) {
			this.score.rightPlayer++;
			this.server
				.to([this.socketLeft, this.socketRight])
				.emit("updateScore", this.score);
			this.resetGamePosition();
		}
		else if (this.ball.x + this.ball.radius >= WIDTH) {
			this.score.leftPlayer++;
			this.server
				.to([this.socketLeft, this.socketRight])
				.emit("updateScore", this.score);
			this.resetGamePosition();
		}
	}

	movePaddle() {
		if (this.keyState.leftPadArrowUp) {
			this.leftPad.y -= PADDLE_SPEED; //* REFRESH_RATE;
		}
		if (this.keyState.leftPadArrowDown) {
			this.leftPad.y += PADDLE_SPEED; //* REFRESH_RATE;
		}
		this.leftPad.y = Math.max(0, this.leftPad.y);
		this.leftPad.y = Math.min(HEIGHT - this.leftPad.length, this.leftPad.y);
		
		// RIGHT PLAYER MOVEMENT
		if (this.keyState.rightPaArrowdUp) {
			this.rightPad.y -= PADDLE_SPEED; //* delta;
		}
		if (this.keyState.rightPadArrowDown) {
			this.rightPad.y += PADDLE_SPEED; //* delta;
		}
		this.rightPad.y = Math.max(0, this.rightPad.y);
		this.rightPad.y = Math.min(HEIGHT - this.rightPad.length, this.rightPad.y);
	}

	moveBall() {
		function leftPaddleCollision(): boolean {
			if (this.ball.x - this.ball.radius <= this.leftPad.x + this.leftPad.width
				&& this.ball.y + this.ball.radius >= this.leftPad.y
				&& this.ball.y - this.ball.radius <= this.leftPad.y + this.leftPad.length
				) {
				return true;
			}
			return false;
		}

		function rightPaddleCollision(): boolean {
			if (this.ball.x + this.ball.radius >= this.rightPad.x
				&& this.ball.y + this.ball.radius >= this.rightPad.y
				&& this.ball.y - this.ball.radius <= this.rightPad.y + this.rightPad.length
				) {
					return true;
			}
			return false;
		}

		if (leftPaddleCollision()) {
			const relativeBallPos = this.ball.y - (this.leftPad.y + this.leftPad.length / 2);
			this.ball.speed.x *= -1;
			this.ball.speed.y = this.ball.speed.x * BALL_SPEED_Y * (relativeBallPos / this.leftPad.length / 2);
		}
		if (rightPaddleCollision()) {
			const relativeBallPos = this.ball.y - (this.rightPad.y + this.rightPad.length / 2);
			this.ball.speed.x *= -1;
			this.ball.speed.y = this.ball.speed.x * (BALL_SPEED_Y * -1) * (relativeBallPos / this.rightPad.length / 2);
		}
	}

	updateGame() {
		this.checkGoal();
		this.movePaddle();
		this.moveBall();
		this.server
			.to([this.socketLeft, this.socketRight])
			.emit("updateElements", );
	}

	// DOES NOT TAKE ANY TIME DELTA INTO ACCOUNT
	launch() {
		this.resetGamePosition();

		setInterval(() => {
			this.updateGame()

			if (this.gameFinished())
				return ;
		}, REFRESH_RATE);
	}

}


const SOCKET_NOT_FOUND = -1;

export class GameService {

	server: Server;
	randomGameList: {full: boolean, socketIdA: string, socketIdB: string, game: GameEngine} [];

	constructor(server: Server) {
		this.server = server;
	}

	joinRandomGame(socketId: string) {
		for (let i in this.randomGameList) {
			if (this.randomGameList[i].full == false )
			{
				if (this.randomGameList[i].socketIdA == null)
					this.randomGameList[i].socketIdA = socketId;
				else if (this.randomGameList[i].socketIdB == null)
					this.randomGameList[i].socketIdB = socketId;

				if (this.randomGameList[i].socketIdA && this.randomGameList[i].socketIdB) {
					this.randomGameList[i].full = true;
					this.randomGameList[i].game.launch();
				}
			}
		}
		this.randomGameList.push({full: false, socketIdA: socketId, socketIdB: null, game: new GameEngine(this.server)});
	}

	findGameIndex(socketId: string) {
		for (let i in this.randomGameList) {
			if (this.randomGameList[i].socketIdA === socketId || this.randomGameList[i].socketIdB === socketId)
				return i;
		}
		return SOCKET_NOT_FOUND;
	}

	keyUp(socketId: string, key: string) {
		const gameIndex = this.findGameIndex(socketId);
		if (gameIndex != -1) {
			this.randomGameList[gameIndex].keyUp(socketId, key);
		}
		else {
			return; //EXCEPTION ?
		}
	}
	
	keyDown(socketId: string, key: string) {
		const gameIndex = this.findGameIndex(socketId);
		if (gameIndex != -1) {
			this.randomGameList[gameIndex].keyDown(socketId, key);
		}
		else {
			return; //EXCEPTION ?
		}
	}

}

