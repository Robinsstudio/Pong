const Constants = require('./Constants');
const Intervals = require('./Intervals');

class Ball {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.speedX = Constants.BALL_SPEED_X;
		this.speedY = Constants.BALL_SPEED_Y;
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

		if (this.x - Constants.BALL_RADIUS <= 0 || this.x + Constants.BALL_RADIUS >= Constants.CANVAS_WIDTH) {
			this.speedX *= -1;
		}

		if (this.y - Constants.BALL_RADIUS <= 0 || this.y + Constants.BALL_RADIUS >= Constants.CANVAS_HEIGHT) {
			this.speedY *= -1;
		}

		return { x: this.x, y: this.y };
	}
}

module.exports = Ball;