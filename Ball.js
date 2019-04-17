const Constants = require('./Constants');
const Intervals = require('./Intervals');

class Ball {
	constructor() {
		this.reset();
	}

	center() {
		this.x = Constants.CANVAS_WIDTH / 2 - Constants.BALL_RADIUS;
		this.y = Constants.CANVAS_HEIGHT / 2 - Constants.BALL_RADIUS;
	}

	random() {
		return Constants.BALL_SPEED / 4 + Math.random() * Constants.BALL_SPEED / 2;
	}

	randomizeSpeed() {
		this.speedX = this.random();
		this.speedY = this.random();
	}

	reset() {
		this.center();
		this.randomizeSpeed();
	}

	intersectX(player) {
		return Intervals.intersect(this.x - Constants.BALL_RADIUS, this.x + Constants.BALL_RADIUS, player.x, player.x + Constants.PLAYER_SIZE_X);
	}

	intersectY(player) {
		return Intervals.intersect(this.y - Constants.BALL_RADIUS, this.y + Constants.BALL_RADIUS, player.y, player.y + Constants.PLAYER_SIZE_Y);
	}

	collideWith(player) {
		if (this.intersectY(player) && this.prevX - Constants.BALL_RADIUS > player.prevX + Constants.PLAYER_SIZE_X && this.x - Constants.BALL_RADIUS <= player.x + Constants.PLAYER_SIZE_X) {
			this.speedX *= -1;
		}

		if (this.intersectY(player) && this.prevX + Constants.BALL_RADIUS < player.prevX && this.x + Constants.BALL_RADIUS >= player.x) {
			this.speedX *= -1;
		}

		if (this.intersectX(player) && this.prevY + Constants.BALL_RADIUS < player.prevY && this.y + Constants.BALL_RADIUS > player.y) {
			this.speedY *= -1;
			this.y = player.y - Constants.BALL_RADIUS - 1;
		}

		if (this.intersectX(player) && this.prevY - Constants.BALL_RADIUS > player.prevY + Constants.PLAYER_SIZE_Y && this.y - Constants.BALL_RADIUS <= player.y + Constants.PLAYER_SIZE_Y) {
			this.speedY *= -1;
			this.y = player.y + Constants.PLAYER_SIZE_Y + Constants.BALL_RADIUS + 1;
		}
	}

	calculate() {
		this.prevX = this.x;
		this.prevY = this.y;

		this.x = Math.max(Math.min(this.x + this.speedX, Constants.CANVAS_WIDTH - Constants.BALL_RADIUS), Constants.BALL_RADIUS);
		this.y = Math.max(Math.min(this.y + this.speedY, Constants.CANVAS_HEIGHT - Constants.BALL_RADIUS), Constants.BALL_RADIUS);

		if (this.x - Constants.BALL_RADIUS <= 0) {
			this.fireOnOutOfBounds(Constants.LEFT);
			this.reset();
		}

		if (this.x + Constants.BALL_RADIUS >= Constants.CANVAS_WIDTH) {
			this.fireOnOutOfBounds(Constants.RIGHT);
			this.reset();
		}

		if (this.y - Constants.BALL_RADIUS <= 0 || this.y + Constants.BALL_RADIUS >= Constants.CANVAS_HEIGHT) {
			this.speedY *= -1;
		}

		this.speedX += Math.sign(this.speedX) * Constants.BALL_ACCELERATION;
		this.speedY += Math.sign(this.speedY) * Constants.BALL_ACCELERATION;

		return { x: this.x, y: this.y };
	}

	fireOnOutOfBounds(side) {
		this.onOutOfBoundsCallback(side);
	}

	onOutOfBounds(callback) {
		this.onOutOfBoundsCallback = callback;
	}
}

module.exports = Ball;