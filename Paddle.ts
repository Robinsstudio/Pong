import Constants from './Constants';

class Paddle {
	x: number;
	y: number;
	prevX: number;
	prevY: number;
	speedX: number;
	speedY: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.prevX = x;
		this.prevY = y;
		this.speedX = 0;
		this.speedY = 0;
	}

	setSpeedX(speedX: number) {
		this.speedX = speedX;
	}

	setSpeedY(speedY: number) {
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

export default Paddle;