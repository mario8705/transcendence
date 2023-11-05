import './Game.css'
import SocketContext from '../Socket/Context/Context';
import { useRef, useEffect, useContext, useCallback } from 'react';

const BALL_DEFAULT_RADIUS = 15;

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
	x: number,
	y: number,
	radius: number,
}

let leftPaddleColor = 'blue';
let rightPaddleColor = 'blue';

//////////////////////////////
//           GAME           //
//////////////////////////////
const Game: React.FC<gameProps> = (props) => {
	const { SocketState } = useContext(SocketContext);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	let   gameEnd = false;
	let   ball: ballElem = {
		speed: {x: 1, y: 1},
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
	};
	
	function handleKeyUp(event: KeyboardEvent) {
		event.preventDefault();
		SocketState.socket?.emit("keyUp", event.key);
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
		ctx.fillStyle = leftPaddleColor;
		ctx.fillRect(leftPad.x, leftPad.y, leftPad.width, leftPad.length);
		
		// draw right paddle
		ctx.fillStyle = rightPaddleColor;
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

	const activateShield = useCallback((color: string) => {
		if (color === "left")
			leftPaddleColor = "red";
		else
			rightPaddleColor = "red";
	}, [])

	const finishGame = useCallback(() => {
		gameEnd = true;
		console.log("finish game event");
	}, []);

	const updateScore = useCallback((newScore: {leftPlayer: string, rightPlayer: string}) => {
		leftPaddleColor = "blue"
		rightPaddleColor = "blue"
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
		SocketState.socket?.on("shield", activateShield);
		
		return () => {
			SocketState.socket?.off("gameFinished", finishGame);
			SocketState.socket?.off("updateScore", updateScore);
			SocketState.socket?.off("updateGame", updateGame);
		};
	}, [SocketState.socket]);

	useEffect(() => {
		const context = canvasRef.current?.getContext('2d');

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);

		const gameLoop = () => {

			renderFrame(context);

			if (!gameEnd) {
				window.requestAnimationFrame(gameLoop);
			}
		};

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
