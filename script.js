const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

const BALL_RADIUS = 20;
const BALL_SPEED_X = Math.random() * 5;
const BALL_SPEED_Y = Math.random() * 5;

const PLAYER_SIZE_X = 10;
const PLAYER_SIZE_Y = 150;
const PLAYER_SPEED_X = 10;
const PLAYER_SPEED_Y = 10;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

class Ball {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.speedX = BALL_SPEED_X;
		this.speedY = BALL_SPEED_Y;
	}

	intersectX(player) {
		return intervalsIntersect(this.x - BALL_RADIUS, this.x + BALL_RADIUS, player.x, player.x + PLAYER_SIZE_X);
	}

	intersectY(player) {
		return intervalsIntersect(this.y - BALL_RADIUS, this.y + BALL_RADIUS, player.y, player.y + PLAYER_SIZE_Y);
	}

	collideWith(player) {
		if (this.intersectY(player) && this.prevX - BALL_RADIUS > player.prevX + PLAYER_SIZE_X && this.x - BALL_RADIUS <= player.x + PLAYER_SIZE_X) {
			this.speedX *= -1;
		}

		if (this.intersectY(player) && this.prevX + BALL_RADIUS < player.prevX && this.x + BALL_RADIUS >= player.x) {
			this.speedX *= -1;
		}

		if (this.intersectX(player) && this.prevY + BALL_RADIUS < player.prevY && this.y + BALL_RADIUS > player.y) {
			this.speedY *= -1;
			this.y = player.y - BALL_RADIUS - 1;
		}

		if (this.intersectX(player) && this.prevY - BALL_RADIUS > player.prevY + PLAYER_SIZE_Y && this.y - BALL_RADIUS <= player.y + PLAYER_SIZE_Y) {
			this.speedY *= -1;
			this.y = player.y + PLAYER_SIZE_Y + BALL_RADIUS + 1;
		}
	}

	draw() {
		context.arc(this.x, this.y, BALL_RADIUS, 0 * Math.PI, 2 * Math.PI);
		context.fillStyle = '#77abff';
		context.fill();

		this.prevX = this.x;
		this.prevY = this.y;

		this.x = Math.max(Math.min(this.x + this.speedX, CANVAS_WIDTH - BALL_RADIUS), BALL_RADIUS);
		this.y = Math.max(Math.min(this.y + this.speedY, CANVAS_HEIGHT - BALL_RADIUS), BALL_RADIUS);

		if (this.x - BALL_RADIUS <= 0 || this.x + BALL_RADIUS >= CANVAS_WIDTH) {
			this.speedX *= -1;
		}

		if (this.y - BALL_RADIUS <= 0 || this.y + BALL_RADIUS >= CANVAS_HEIGHT) {
			this.speedY *= -1;
		}
	}
}

class Player {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.speedX = 0;
		this.speedY = 0;
	}

	setSpeedX(speedX) {
		this.speedX = speedX;
	}

	setSpeedY(speedY) {
		this.speedY = speedY;
	} 

	draw() {
		context.fillStyle = '#FFFFFF';
		context.fillRect(this.x, this.y, PLAYER_SIZE_X, PLAYER_SIZE_Y);

		this.prevX = this.x;
		this.prevY = this.y;

		this.x = Math.max(Math.min(this.x + this.speedX, CANVAS_WIDTH - PLAYER_SIZE_X), 0);
		this.y = Math.max(Math.min(this.y + this.speedY, CANVAS_HEIGHT - PLAYER_SIZE_Y - 2 * BALL_RADIUS), 2 * BALL_RADIUS);
	}
}

function intervalsIntersect(a1, a2, b1, b2) {
	return a1 <= b2 && b1 <= a2;
}

const player1 = new Player(.125 * CANVAS_WIDTH - .5 * PLAYER_SIZE_X, .5 * CANVAS_HEIGHT - .5 * PLAYER_SIZE_Y);
const player2 = new Player(.875 * CANVAS_WIDTH - .5 * PLAYER_SIZE_X, .5 * CANVAS_HEIGHT - .5 * PLAYER_SIZE_Y);
const ball = new Ball(CANVAS_WIDTH / 2 - BALL_RADIUS, CANVAS_HEIGHT / 2 - BALL_RADIUS);

addEventListener('keydown', event => {
	if (event.key === 'ArrowDown') {
		player1.setSpeedY(PLAYER_SPEED_Y);
	} else if (event.key === 'ArrowUp') {
		player1.setSpeedY(-PLAYER_SPEED_Y);
	}
});

addEventListener('keyup', event => {
	if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
		player1.setSpeedY(0);
	}
});

function draw() {
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	context.beginPath();

	context.fillStyle = '#000000';
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	player1.draw();
	player2.draw();
	ball.draw();

	ball.collideWith(player1);
	ball.collideWith(player2);

	context.closePath();

	requestAnimationFrame(draw);
}

draw();