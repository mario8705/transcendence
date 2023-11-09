import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const BALL_SPEED_MOD = 2;
const PADDLE_SPEED = 6;
const BALL_DEFAULT_RADIUS = 15;
const BALL_SPEED_Y = 5;
const BALL_SPEED_X = 1.5;

const WIDTH = 800;
const HEIGHT = 600;

const GAME_MAX_GOAL = 2;

interface scoreElem {
	leftPlayer: number,
	rightPlayer: number,
}

interface paddleElem {
	x: number,
	y: number,
	width: number,
	length: number,
	activate?: number
}

interface ballElem {
	speed: {x: number, y: number},
	speedModifyer: number,
	x: number,
	y: number,
	radius: number,
}

interface keyStateElem {
	leftPadArrowUp: boolean;
	leftPadArrowDown: boolean;
	leftPadSpacebar?: boolean;
	rightPadArrowUp: boolean;
	rightPadArrowDown: boolean;
	rightPadSpacebar?: boolean;
}

class GameEngine {

	roomName: string;
	server: Server;
	socketLeft: string;
	socketRight: string | null;
	leftPad: paddleElem;
	rightPad: paddleElem;
	ball: ballElem;
	score: scoreElem;
	keyState: keyStateElem;


	constructor(server: Server, socketLeft: string, roomName: string) {
		this.roomName = roomName;
		this.server = server;
		this.socketLeft = socketLeft;
		this.leftPad = {
			x: 5,
			y: Math.round(HEIGHT / 2) - Math.round(WIDTH / 20),
			width: 10,
			length: Math.round(WIDTH / 10),
		}
		this.rightPad = {
			x: WIDTH - 5 - 10,
			y: Math.round(HEIGHT / 2) - Math.round(WIDTH / 20),
			width: 10,
			length: Math.round(WIDTH / 10)
		}
		this.ball = {
			speed: {x: 1, y: 1},
			speedModifyer: BALL_SPEED_MOD,
			x: Math.round(WIDTH / 2),
			y: Math.round(HEIGHT / 2),
			radius: BALL_DEFAULT_RADIUS,
		}
		this.score = {
			leftPlayer: 0,
			rightPlayer: 0
		}
		this.keyState = {
			leftPadArrowUp: false,
			leftPadArrowDown: false,
			rightPadArrowUp: false,
			rightPadArrowDown: false,
		}
	}
	
	addPlayerSocket(socketId: string) {
		this.socketRight = socketId;
	}

	keyUp(socketId, key) {
		if (socketId === this.socketLeft) {
			if (key === "ArrowUp") {
				this.keyState.leftPadArrowUp = false;
			}
			else if (key === "ArrowDown") {
				this.keyState.leftPadArrowDown = false;
			}
		}
		else if (socketId === this.socketRight) {
			if (key === "ArrowUp") {
				this.keyState.rightPadArrowUp = false;
			}
			else if (key === "ArrowDown") {
				this.keyState.rightPadArrowDown = false;
			}
		}
	}
	
	keyDown(socketId, key) {
		if (socketId === this.socketLeft) {
			if (key === "ArrowUp") {
				this.keyState.leftPadArrowUp = true;
			}
			else if (key === "ArrowDown") {
				this.keyState.leftPadArrowDown = true;
			}
		}
		else if (socketId === this.socketRight) {
			if (key === "ArrowUp") {
				this.keyState.rightPadArrowUp = true;
			}
			else if (key === "ArrowDown") {
				this.keyState.rightPadArrowDown = true;
			}
		}
	}

	resetGamePosition() {
		this.ball.speed.y = 0;
		while (Math.abs(this.ball.speed.y) <= 0.2 || Math.abs(this.ball.speed.y) >= 0.9) {
			const heading = Math.random() * (2 * Math.PI - 0) + 0;
			this.ball.speed = { x: BALL_SPEED_X, y: Math.sin(heading) }
		}

		this.ball.x = Math.round(WIDTH / 2);
		this.ball.y = Math.round(HEIGHT / 2);

		this.leftPad.y = Math.round(HEIGHT / 2) - Math.round(this.leftPad.length / 2);
		this.rightPad.y = Math.round(HEIGHT / 2) - Math.round(this.rightPad.length / 2);

		this.server.to(this.roomName).emit("updateGame", this.leftPad, this.rightPad, this.ball);
	}

	gameFinished() {
		if (this.score.leftPlayer >= GAME_MAX_GOAL || this.score.rightPlayer >= GAME_MAX_GOAL) {
			this.server.to(this.roomName).emit("gameFinished");
			return true;
		}
		else
			return false;
	}

	checkGoal() {
		if (this.ball.x - this.ball.radius <= 0) {
			this.score.rightPlayer++;
			this.resetGamePosition();
			this.server.to(this.roomName).emit("updateScore", this.score);
		}
		else if (this.ball.x + this.ball.radius >= WIDTH) {
			this.score.leftPlayer++;
			this.server.to(this.roomName).emit("updateScore", this.score);
			this.resetGamePosition();
		}
	}

	movePaddle() {
		if (this.keyState.leftPadArrowUp) {
			this.leftPad.y -= PADDLE_SPEED;
		}
		if (this.keyState.leftPadArrowDown) {
			this.leftPad.y += PADDLE_SPEED;
		}
		this.leftPad.y = Math.max(0, this.leftPad.y);
		this.leftPad.y = Math.min(HEIGHT - this.leftPad.length, this.leftPad.y);
		
		// RIGHT PLAYER MOVEMENT
		if (this.keyState.rightPadArrowUp) {
			this.rightPad.y -= PADDLE_SPEED;
		}
		if (this.keyState.rightPadArrowDown) {
			this.rightPad.y += PADDLE_SPEED;
		}
		this.rightPad.y = Math.max(0, this.rightPad.y);
		this.rightPad.y = Math.min(HEIGHT - this.rightPad.length, this.rightPad.y);
	}

	moveBall() {

		function checkWallCollision(ball: ballElem) {
			if (ball.y - ball.radius <= 0 && ball.speed.y < 0
				|| ball.y + ball.radius >= HEIGHT && ball.speed.y > 0)
				ball.speed.y *= -1;
		}

		function checkPaddleCollision(ball: ballElem, leftPad: paddleElem, rightPad: paddleElem) {
			function leftPaddleCollision(): boolean {
				if (ball.x - ball.radius <= leftPad.x + leftPad.width
					&& ball.y + ball.radius >= leftPad.y
					&& ball.y - ball.radius <= leftPad.y + leftPad.length)
				{
					return true;
				}
				return false;
			}
	
			function rightPaddleCollision(): boolean {
				if (ball.x + ball.radius >= rightPad.x
					&& ball.y + ball.radius >= rightPad.y
					&& ball.y - ball.radius <= rightPad.y + rightPad.length)
				{
						return true;
				}
				return false;
			}
	
			if (leftPaddleCollision() && ball.speed.x < 0) {
				const relativeBallPos = ball.y - (leftPad.y + leftPad.length / 2);
				ball.speed.x *= -1;
				ball.speed.y = ball.speed.x * BALL_SPEED_Y * (relativeBallPos / leftPad.length / 2);
			}
			if (rightPaddleCollision() && ball.speed.x > 0) {
				const relativeBallPos = ball.y - (rightPad.y + rightPad.length / 2);
				ball.speed.x *= -1;
				ball.speed.y = ball.speed.x * (BALL_SPEED_Y * -1) * (relativeBallPos / rightPad.length / 2);
			}

		}

		checkWallCollision(this.ball);
		checkPaddleCollision(this.ball, this.leftPad, this.rightPad);
		this.ball.x += this.ball.speed.x * this.ball.speedModifyer;
		this.ball.y += this.ball.speed.y * this.ball.speedModifyer;
	}

	updateGame() {
		this.checkGoal();
		this.movePaddle();
		this.moveBall();
		this.server.to(this.roomName).emit("updateGame", this.leftPad, this.rightPad, this.ball);
	}

}

const LEFT = 0;
const RIGHT = 1;
let TURN = LEFT;

class GameEnginePlus {

	roomName: string;
	server: Server;
	socketLeft: string;
	socketRight: string | null;
	leftPad: paddleElem;
	rightPad: paddleElem;
	ball: ballElem;
	score: scoreElem;
	keyState: keyStateElem;


	constructor(server: Server, socketLeft: string, roomName: string) {
		this.roomName = roomName;
		this.server = server;
		this.socketLeft = socketLeft;
		this.leftPad = {
			x: 5,
			y: Math.round(HEIGHT / 2) - Math.round(WIDTH / 20),
			width: 10,
			length: Math.round(WIDTH / 10),
			activate: -1
		}
		this.rightPad = {
			x: WIDTH - 5 - 10,
			y: Math.round(HEIGHT / 2) - Math.round(WIDTH / 20),
			width: 10,
			length: Math.round(WIDTH / 10),
			activate: -1
		}
		this.ball = {
			speed: {x: 1, y: 1},
			speedModifyer: BALL_SPEED_MOD,
			x: Math.round(WIDTH / 2),
			y: Math.round(HEIGHT / 2),
			radius: BALL_DEFAULT_RADIUS,
		}
		this.score = {
			leftPlayer: 0,
			rightPlayer: 0
		}
		this.keyState = {
			leftPadArrowUp: false,
			leftPadArrowDown: false,
			leftPadSpacebar: false,
			rightPadArrowUp: false,
			rightPadArrowDown: false,
			rightPadSpacebar: false,
		}
	}
	
	addPlayerSocket(socketId: string) {
		this.socketRight = socketId;
	}

	keyUp(socketId, key) {
		if (socketId === this.socketLeft) {
			if (key === "ArrowUp") {
				this.keyState.leftPadArrowUp = false;
			}
			else if (key === "ArrowDown") {
				this.keyState.leftPadArrowDown = false;
			}
			else if (key === " ") {
				this.keyState.leftPadSpacebar = false;
			}
		}
		else if (socketId === this.socketRight) {
			if (key === "ArrowUp") {
				this.keyState.rightPadArrowUp = false;
			}
			else if (key === "ArrowDown") {
				this.keyState.rightPadArrowDown = false;
			}
			else if (key === " ") {
				this.keyState.rightPadSpacebar = false;
			}
		}
	}
	
	keyDown(socketId, key) {
		if (socketId === this.socketLeft) {
			if (key === "ArrowUp") {
				this.keyState.leftPadArrowUp = true;
			}
			else if (key === "ArrowDown") {
				this.keyState.leftPadArrowDown = true;
			}
			else if (key === " ") {
				this.keyState.leftPadSpacebar = true;
				if (this.leftPad.activate == -1 && TURN == LEFT) {
					this.leftPad.activate = new Date().getTime();
				}
			}
		}
		else if (socketId === this.socketRight) {
			if (key === "ArrowUp") {
				this.keyState.rightPadArrowUp = true;
			}
			else if (key === "ArrowDown") {
				this.keyState.rightPadArrowDown = true;
			}
			else if (key === " ") {
				this.keyState.rightPadSpacebar = true;
				if (this.rightPad.activate == -1 && TURN == RIGHT) {
					this.rightPad.activate = new Date().getTime();
				}
			}
		}
	}

	resetGamePosition() {
		this.ball.speed.y = 0;
		while (Math.abs(this.ball.speed.y) <= 0.2 || Math.abs(this.ball.speed.y) >= 0.9) {
			const heading = Math.random() * (2 * Math.PI - 0) + 0;
			this.ball.speed = { x: BALL_SPEED_X, y: Math.sin(heading) }
		}

		if (this.ball.speed.x > 0)
			TURN = RIGHT;
		else
			TURN = LEFT;

		this.ball.speedModifyer = BALL_SPEED_MOD;

		this.ball.x = Math.round(WIDTH / 2);
		this.ball.y = Math.round(HEIGHT / 2);

		this.leftPad.y = Math.round(HEIGHT / 2) - Math.round(this.leftPad.length / 2);
		this.rightPad.y = Math.round(HEIGHT / 2) - Math.round(this.rightPad.length / 2);
		
		this.leftPad.activate = -1;
		this.rightPad.activate = -1;

		this.server.to(this.roomName).emit("updateGame", this.leftPad, this.rightPad, this.ball);
	}

	gameFinished() {
		if (this.score.leftPlayer >= GAME_MAX_GOAL || this.score.rightPlayer >= GAME_MAX_GOAL) {
			this.server.to(this.roomName).emit("gameFinished");
			return true;
		}
		else
			return false;
	}

	checkGoal() {
		if (this.ball.x - this.ball.radius <= 0) {
			this.score.rightPlayer++;
			this.resetGamePosition();
			this.server.to(this.roomName).emit("updateScore", this.score);
		}
		else if (this.ball.x + this.ball.radius >= WIDTH) {
			this.score.leftPlayer++;
			this.server.to(this.roomName).emit("updateScore", this.score);
			this.resetGamePosition();
		}
	}

	movePaddle() {
		if (this.keyState.leftPadArrowUp) {
			this.leftPad.y -= PADDLE_SPEED;
		}
		if (this.keyState.leftPadArrowDown) {
			this.leftPad.y += PADDLE_SPEED;
		}
		this.leftPad.y = Math.max(0, this.leftPad.y);
		this.leftPad.y = Math.min(HEIGHT - this.leftPad.length, this.leftPad.y);
		
		// RIGHT PLAYER MOVEMENT
		if (this.keyState.rightPadArrowUp) {
			this.rightPad.y -= PADDLE_SPEED;
		}
		if (this.keyState.rightPadArrowDown) {
			this.rightPad.y += PADDLE_SPEED;
		}
		this.rightPad.y = Math.max(0, this.rightPad.y);
		this.rightPad.y = Math.min(HEIGHT - this.rightPad.length, this.rightPad.y);
	}

	moveBall(server: Server, roomName: string) {

		function checkWallCollision(ball: ballElem) {
			if (ball.y - ball.radius <= 0 && ball.speed.y < 0
				|| ball.y + ball.radius >= HEIGHT && ball.speed.y > 0)
				ball.speed.y *= -1;
		}

		function checkPaddleCollision(ball: ballElem, leftPad: paddleElem, rightPad: paddleElem) {
			function leftPaddleCollision(): boolean {
				if (ball.x - ball.radius <= leftPad.x + leftPad.width
					&& ball.y + ball.radius >= leftPad.y
					&& ball.y - ball.radius <= leftPad.y + leftPad.length)
				{
					return true;
				}
				return false;
			}
	
			function rightPaddleCollision(): boolean {
				if (ball.x + ball.radius >= rightPad.x
					&& ball.y + ball.radius >= rightPad.y
					&& ball.y - ball.radius <= rightPad.y + rightPad.length)
				{
						return true;
				}
				return false;
			}
	
			if (leftPaddleCollision() && ball.speed.x < 0) {
				const relativeBallPos = ball.y - (leftPad.y + leftPad.length / 2);
				ball.speed.x *= -1;
				ball.speed.y = ball.speed.x * BALL_SPEED_Y * (relativeBallPos / leftPad.length / 2);
				if (Math.abs(new Date().getTime() - leftPad.activate) < 400) {
					server.to(roomName).emit("shield", "left");
					ball.speedModifyer += 0.2;
					console.log("leftPad shielded")
				}
				leftPad.activate = -1;
				TURN = RIGHT;
			}
			if (rightPaddleCollision() && ball.speed.x > 0) {
				const relativeBallPos = ball.y - (rightPad.y + rightPad.length / 2);
				ball.speed.x *= -1;
				ball.speed.y = ball.speed.x * (BALL_SPEED_Y * -1) * (relativeBallPos / rightPad.length / 2);
				if (Math.abs(new Date().getTime() - rightPad.activate) < 400) {
					server.to(roomName).emit("shield", "right");
					ball.speedModifyer += 0.2;
					console.log("rightPad shielded")
				}
				rightPad.activate = -1;
				TURN = LEFT;
			}

		}

		checkWallCollision(this.ball);
		checkPaddleCollision(this.ball, this.leftPad, this.rightPad);
		this.ball.x += this.ball.speed.x * this.ball.speedModifyer;
		this.ball.y += this.ball.speed.y * this.ball.speedModifyer;
	}

	updateGame() {
		this.checkGoal();
		this.movePaddle();
		this.moveBall(this.server, this.roomName);
		this.server.to(this.roomName).emit("updateGame", this.leftPad, this.rightPad, this.ball);
	}

}

const NORMAL_MODE = 0;
const SPECIAL_MODE = 1;

interface gameList {
	roomName: string,
	full: boolean,
	running: boolean,
	socketA: Socket,
	socketB: Socket | null,
	mode: number,
	game: GameEngine | GameEnginePlus

};

const SOCKET_NOT_FOUND = -1;
const REFRESH_RATE = 16.66667;

export class GameService {

	server: Server;
	randomGameList: gameList[];

	constructor(server: Server) {
		this.server = server;
		this.randomGameList = [];
	}

	tick() {
		const interval = setInterval(() => {
			for (let i = 0; i < this.randomGameList.length; i++) {
				const currGame = this.randomGameList[i];

				if (currGame.full && !currGame.running) {
					if (currGame.mode == NORMAL_MODE)
						this.server.to(currGame.roomName).emit("launchRandomNormal");
					if (currGame.mode == SPECIAL_MODE)
						this.server.to(currGame.roomName).emit("launchRandomSpecial");
					console.log("launch game");
					currGame.running = true;
				}

				if (currGame.game.gameFinished()) {
					if (currGame.socketA)
						currGame.socketA.leave(currGame.roomName);
					if (currGame.socketB)
						currGame.socketB.leave(currGame.roomName);
					this.randomGameList.splice(i, 1);
				} else if (currGame.running) {
					currGame.game.updateGame();
				}
			}
		}, REFRESH_RATE);
	}
	
	removeFromGame(socket: Socket) {
		for (let i = 0; i < this.randomGameList.length; i++) {
			const currGame = this.randomGameList[i];

			if (currGame.socketA.id === socket.id) {
				currGame.socketA.leave(currGame.roomName);
				currGame.socketA = null;
				currGame.full = false;
			}
			
			if (currGame.socketB && currGame.socketB.id === socket.id) {
				currGame.socketB.leave(currGame.roomName);
				currGame.socketB = null;
				currGame.full = false;
			}
			if (!currGame.socketA && !currGame.socketB)
				this.randomGameList.splice(i, 1);
		}
		// check in friendsGameList TO !!!!!
	}
	
	joinRandomMatch(socket: Socket, gameMode: number) {

		for (let i = 0; i < this.randomGameList.length; i++) {
			if (this.randomGameList[i].socketA.id === socket.id
					|| (this.randomGameList[i].socketB && this.randomGameList[i].socketB.id === socket.id))
				return; // EXCEPTION ? player already in a game
		}

		for (let i = 0; i < this.randomGameList.length; i++) {
			const currentGame = this.randomGameList[i];

			if (currentGame.mode !== gameMode)
				continue;


			if (currentGame.full == false )
			{
				if (socket.id != currentGame.socketA.id
					&& currentGame.socketB === null)
				{
					currentGame.socketB = socket;
					socket.join(currentGame.roomName);
					currentGame.game.addPlayerSocket(socket.id);
					currentGame.full = true;
					currentGame.running = false;
					return;
				}
			}
		}
		const roomName: string = uuidv4();
		socket.join(roomName);
		if (gameMode === NORMAL_MODE) {
			this.randomGameList.push({
				roomName: roomName,
				full: false,
				running: false,
				socketA: socket,
				socketB: null,
				mode: gameMode,
				game: new GameEngine(this.server, socket.id, roomName)
			});
		}
		else if (gameMode === SPECIAL_MODE) {
			this.randomGameList.push({
				roomName: roomName,
				full: false,
				running: false,
				socketA: socket,
				socketB: null,
				mode: gameMode,
				game: new GameEnginePlus(this.server, socket.id, roomName)
			});
		}
	}
	
	findGameIndex(socketId: string) {
		for (let i = 0; i < this.randomGameList.length; i++) {
			if (this.randomGameList[i].socketA.id === socketId || this.randomGameList[i].socketB.id === socketId)
				return i;
		}
		return SOCKET_NOT_FOUND;
	}

	keyUp(socketId: string, key: string) {
		const gameIndex = this.findGameIndex(socketId);
		if (gameIndex != -1) {
			this.randomGameList[gameIndex].game.keyUp(socketId, key);
		}
		else {
			return; //EXCEPTION ? player not found
		}
	}
	
	keyDown(socketId: string, key: string) {
		const gameIndex = this.findGameIndex(socketId);
		if (gameIndex != -1) {
			this.randomGameList[gameIndex].game.keyDown(socketId, key);
		}
		else {
			return; //EXCEPTION ? player not found
		}
	}
}
