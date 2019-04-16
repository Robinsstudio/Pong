const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

const BALL_RADIUS = 20;
const BALL_SPEED_X = Math.random() * 5;
const BALL_SPEED_Y = Math.random() * 5;

const PLAYER_SIZE_X = 10;
const PLAYER_SIZE_Y = 150;
const PLAYER_SPEED_X = 10;
const PLAYER_SPEED_Y = 10;

const socket = io();

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

function drawBall(ball) {
	context.beginPath();
	
	context.arc(ball.x, ball.y, BALL_RADIUS, 0 * Math.PI, 2 * Math.PI);
	context.fillStyle = '#77ABFF';
	context.fill();
	
	context.closePath();
}

function drawPlayer(player) {
	context.fillStyle = '#FFFFFF';
	context.fillRect(player.x, player.y, PLAYER_SIZE_X, PLAYER_SIZE_Y);
}

addEventListener('keydown', event => socket.emit('keydown', event.key));
addEventListener('keyup', event => socket.emit('keyup', event.key));

socket.on('refresh', event => {
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	context.fillStyle = '#000000';
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	drawBall(event.ball);
	drawPlayer(event.leftPlayer);
	drawPlayer(event.rightPlayer);
});