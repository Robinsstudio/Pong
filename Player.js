const Constants = require('./Constants');

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

	calculate() {
		this.prevX = this.x;
		this.prevY = this.y;

		this.x = Math.max(Math.min(this.x + this.speedX, Constants.CANVAS_WIDTH - Constants.PLAYER_SIZE_X), 0);
		this.y = Math.max(Math.min(this.y + this.speedY, Constants.CANVAS_HEIGHT - Constants.PLAYER_SIZE_Y - 2 * Constants.BALL_RADIUS), 2 * Constants.BALL_RADIUS);

		return { x: this.x, y: this.y };
	}
}

module.exports = Player;