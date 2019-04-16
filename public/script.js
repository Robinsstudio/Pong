const socket = io();

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let constants = {};
let score = { leftPlayer: 0, rightPlayer: 0 };

function clearCanvas() {
	context.clearRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
	context.fillStyle = '#000000';
	context.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);
}

function drawBall(ball) {
	context.beginPath();
	
	context.arc(ball.x, ball.y, constants.BALL_RADIUS, 0 * Math.PI, 2 * Math.PI);
	context.fillStyle = '#77ABFF';
	context.fill();
	
	context.closePath();
}

function drawPlayer(player) {
	context.fillStyle = '#FFFFFF';
	context.fillRect(player.x, player.y, constants.PLAYER_SIZE_X, constants.PLAYER_SIZE_Y);
}

function drawScore() {
	context.font = '30px Arial';
	context.textAlign = 'center';
	context.textBaseline = 'top';
	context.fillStyle = '#FFFFFF';
	context.fillText(`${score.leftPlayer} - ${score.rightPlayer}`, canvas.width / 2, 10);
}

function drawWaitingText() {
	context.font = '50px Arial';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillStyle = '#FFFFFF';
	context.fillText('Waiting for your opponent...', canvas.width / 2, canvas.height / 2);
}

addEventListener('keydown', event => socket.emit('keydown', event.key));
addEventListener('keyup', event => socket.emit('keyup', event.key));

socket.on('refresh', event => {
	clearCanvas();

	drawScore();

	drawBall(event.ball);
	drawPlayer(event.leftPlayer);
	drawPlayer(event.rightPlayer);
});

socket.on('constants', consts => {
	constants = consts;
	canvas.width = constants.CANVAS_WIDTH;
	canvas.height = constants.CANVAS_HEIGHT;

	clearCanvas();
	drawWaitingText();
});

socket.on('score', sc => score = sc);