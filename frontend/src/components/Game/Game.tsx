import './Game.css'
import SocketContext from '../Socket/Context/Context';
import { useRef, useEffect, useContext, useCallback } from 'react';

const BALL_SPEED_MOD = 250;
// const PADDLE_SPEED = 500;
const BALL_DEFAULT_RADIUS = 15;
// const BALL_SPEED_Y = 5;
// const BALL_SPEED_X = 1.5;

// const GAME_MAX_GOAL = 2;

interface scoreElem {
	leftPlayer: string,
	rightPlayer: string,
}

interface gameProps {
	width: number,
	height: number,
	className: string,
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

//////////////////////////////
//           GAME           //
//////////////////////////////
const Game: React.FC<gameProps> = (props) => {
	const { SocketState } = useContext(SocketContext);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	// const leftPlayerKey: keyState = {};
	// const rightPlayerKey: keyState = {};
	// let   lastFrameTime: number | null = null
	let   gameEnd = false;
	let   ball: ballElem = {
		speed: {x: 1, y: 1},
		speedModifyer:BALL_SPEED_MOD,
		x: Math.round(props.width / 2),
		y: Math.round(props.height / 2),
		radius: BALL_DEFAULT_RADIUS,
	};
	let   leftPad: paddleElem = {
		length: Math.round(props.width / 10),
		width: 10,
		x: 5,
		y: Math.round(props.height / 2) - Math.round(props.width / 20),
	};
	let   rightPad: paddleElem = {
		length: Math.round(props.width / 10),
		width: 10,
		x: props.width - 5 - 10,
		y: Math.round(props.height / 2) - Math.round(props.width / 20),
	};
	let   score: scoreElem = {
		leftPlayer: '0',
		rightPlayer: '0',
	}
	
	function handleKeyDown(event: KeyboardEvent) {
		event.preventDefault();
		SocketState.socket?.emit("keyDown", event.key);
		// leftPlayerKey[event.key] = true;
	};
	
	function handleKeyUp(event: KeyboardEvent) {
		event.preventDefault();
		SocketState.socket?.emit("keyUp", event.key);
		// delete leftPlayerKey[event.key];
	};
	
	function clearBackground(ctx: CanvasRenderingContext2D): void {
		const { width, height } = ctx.canvas;
		ctx.rect(0, 0, width, height);
		ctx.fillStyle = 'white';
		ctx.fill();
	};
	
	function draw(ctx: CanvasRenderingContext2D): void {
		
		// draw ball
		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI);
		ctx.closePath();
		ctx.fill();
		
		// draw left paddle
		ctx.fillStyle = 'blue';
		ctx.fillRect(leftPad.x, leftPad.y, leftPad.width, leftPad.length);
		
		// draw right paddle
		ctx.fillStyle = 'blue';
		ctx.fillRect(rightPad.x, rightPad.y, rightPad.width, rightPad.length);
		
		ctx.fillStyle = "green";
		ctx.font = "40px Orbitron";
		ctx.fillText(score.leftPlayer, Math.round(props.width / 2 / 2), 100);
		ctx.fillText(score.rightPlayer,Math.round(props.width / 2 * 1.5),100);
	};
	
	function renderFrame(context: CanvasRenderingContext2D | null | undefined): void {
		if (context != null && context != undefined) {
			clearBackground(context);
			draw(context);
		}
	};
	
	// function resetGamePosition(): void {

	// 	while (Math.abs(ball.speed.y) <= 0.2 || Math.abs(ball.speed.y) >= 0.9) {
	// 		const heading = Math.random() * (2 * Math.PI - 0) + 0;
	// 		ball.speed = { x: BALL_SPEED_X, y: Math.sin(heading) }
	// 	}

	// 	ball.speedModifyer = BALL_SPEED_MOD;
	// 	ball.x = Math.round(props.width / 2);
	// 	ball.y = Math.round(props.height / 2);

	// 	leftPad.y = Math.round(props.height / 2) - Math.round(props.width / 20)
	// 	rightPad.y = Math.round(props.height / 2) - Math.round(props.width / 20)
	// };

	// function movePaddles(delta: number): void {

	// 	// LEFT PLAYER MOVEMENT
	// 	if (leftPlayerKey['ArrowUp']) {
	// 		leftPad.y -= PADDLE_SPEED * delta;
	// 	}
	// 	if (leftPlayerKey['ArrowDown']) {
	// 		leftPad.y += PADDLE_SPEED * delta;
	// 	}
	// 	leftPad.y = Math.max(0, leftPad.y);
	// 	leftPad.y = Math.min(props.height - leftPad.length, leftPad.y);
		
	// 	// RIGHT PLAYER MOVEMENT
	// 	if (rightPlayerKey['ArrowUp']) {
	// 		rightPad.y -= PADDLE_SPEED * delta;
	// 	}
	// 	if (rightPlayerKey['ArrowDown']) {
	// 		rightPad.y += PADDLE_SPEED * delta;
	// 	}
	// 	rightPad.y = Math.max(0, rightPad.y);
	// 	rightPad.y = Math.min(props.height - rightPad.length, rightPad.y);
	// };

	// function checkGoal(): void {
	// 	if (ball.x - ball.radius <= 0) {
	// 		score.rightPlayer = (parseInt(score.rightPlayer) + 1).toString();
	// 		resetGamePosition();
	// 	}
	// 	else if (ball.x + ball.radius >= props.width) {
	// 		score.leftPlayer = (parseInt(score.leftPlayer) + 1).toString();
	// 		resetGamePosition();
	// 	}
	// }

	// function moveBall(delta: number): void {
		
	// 	function checkWallCollision() {
	// 		if (ball.y - ball.radius <= 0 && ball.speed.y < 0
	// 			|| ball.y + ball.radius >= props.height && ball.speed.y > 0)
	// 			ball.speed.y *= -1;
	// 	}
	
	// 	function checkPaddleCollision() {

	// 		function leftPaddleCollision(): boolean {
	// 			if (ball.x - ball.radius <= leftPad.x + leftPad.width
	// 				&& ball.y + ball.radius >= leftPad.y
	// 				&& ball.y - ball.radius <= leftPad.y + leftPad.length
	// 				) {
	// 				return true;
	// 			}
	// 			return false;
	// 		}

	// 		function rightPaddleCollision(): boolean {
	// 			if (ball.x + ball.radius >= rightPad.x
	// 				&& ball.y + ball.radius >= rightPad.y
	// 				&& ball.y - ball.radius <= rightPad.y + rightPad.length
	// 				) {
	// 					return true;
	// 			}
	// 			return false;
	// 		}

	// 		if (leftPaddleCollision()) {
	// 			const relativeBallPos = ball.y - (leftPad.y + leftPad.length / 2);
	// 			ball.speed.x *= -1;
	// 			ball.speed.y = ball.speed.x * BALL_SPEED_Y * (relativeBallPos / leftPad.length / 2);
	// 		}
	// 		if (rightPaddleCollision()) {
	// 			const relativeBallPos = ball.y - (rightPad.y + rightPad.length / 2);
	// 			ball.speed.x *= -1;
	// 			ball.speed.y = ball.speed.x * (BALL_SPEED_Y * -1) * (relativeBallPos / rightPad.length / 2);
	// 		}
	// 	}

	// 	checkWallCollision();
	// 	checkPaddleCollision();
	// 	ball.x += ball.speed.x * ball.speedModifyer * delta;
	// 	ball.y += ball.speed.y * ball.speedModifyer * delta;
	// };

	// function updateGame(delta: number): void {
	// 	checkGoal();
	// 	movePaddles(delta);
	// 	moveBall(delta);
	// };

	// function checkWin(): boolean {
	// 	if (parseInt(score.leftPlayer) >= GAME_MAX_GOAL || parseInt(score.rightPlayer) >= GAME_MAX_GOAL)
	// 		return true;
	// 	return false;
	// }

	const finishGame = useCallback(() => {
		gameEnd = true;
		console.log("finish game event");
	}, []);

	const updateScore = useCallback((newScore: {leftPlayer: string, rightPlayer: string}) => {
		score.leftPlayer = newScore.leftPlayer.toString();
		score.rightPlayer = newScore.rightPlayer.toString();
		console.log("update score event");
	}, []);

	const updateGame = useCallback((newLeftPad: paddleElem, newRightPad: paddleElem, newBall: ballElem) => {
		leftPad = newLeftPad;
		rightPad = newRightPad;
		ball = newBall;
		console.log("update game event");
	}, []);
	

	useEffect(() => {

		SocketState.socket?.on("gameFinished", finishGame);
		SocketState.socket?.on("updateScore", updateScore);
		SocketState.socket?.on("updateGame", updateGame);
		
		return () => {
			SocketState.socket?.off("gameFinished", finishGame);
			SocketState.socket?.off("updateScore", updateScore);
			SocketState.socket?.off("updateGame", updateGame);
		};
	}, [SocketState.socket]);

	useEffect(() => {
		const context = canvasRef.current?.getContext('2d');

		// Set up listeners
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		// Init game
		// resetGamePosition();

		// GAME LOOP
		const gameLoop = () => {

			// if (lastFrameTime !== null) {
			// 	const delta = (time - lastFrameTime) / 1000
			// 	updateGame(delta);
			// }

			renderFrame(context);

			// lastFrameTime = time;
			// if (!checkWin()) {
			// 	window.requestAnimationFrame(gameLoop);
			// }
			if (!gameEnd) {
				window.requestAnimationFrame(gameLoop);
			}
		};

		// Start game loop
		let frameId = window.requestAnimationFrame(gameLoop);

		return () => {
			window.cancelAnimationFrame(frameId)
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		};
	}, []);

	return <canvas ref={canvasRef} {...props}/>;
}

// This is how you can add this component
{/* <Game className="canvasGame" width={1000} height={550} /> */}
export default Game
