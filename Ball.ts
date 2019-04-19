import Constants from './Constants';
import Side from './Side';
import Intervals from './Intervals';
import Paddle from './Paddle';

class Ball {
	x: number = 0;
	y: number = 0;
	prevX: number = 0;
	prevY: number = 0;
	speedX: number = 0;
	speedY: number = 0;

	onOutOfBoundsCallback: Function = () => {};

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

	intersectX(paddle: Paddle) {
		return Intervals.intersect(this.x - Constants.BALL_RADIUS, this.x + Constants.BALL_RADIUS, paddle.x, paddle.x + Constants.PLAYER_SIZE_X);
	}

	intersectY(paddle: Paddle) {
		return Intervals.intersect(this.y - Constants.BALL_RADIUS, this.y + Constants.BALL_RADIUS, paddle.y, paddle.y + Constants.PLAYER_SIZE_Y);
	}

	collideWith(paddle: Paddle) {
		if (this.intersectY(paddle) && this.prevX - Constants.BALL_RADIUS > paddle.prevX + Constants.PLAYER_SIZE_X && this.x - Constants.BALL_RADIUS <= paddle.x + Constants.PLAYER_SIZE_X) {
			this.speedX *= -1;
		}

		if (this.intersectY(paddle) && this.prevX + Constants.BALL_RADIUS < paddle.prevX && this.x + Constants.BALL_RADIUS >= paddle.x) {
			this.speedX *= -1;
		}

		if (this.intersectX(paddle) && this.prevY + Constants.BALL_RADIUS < paddle.prevY && this.y + Constants.BALL_RADIUS > paddle.y) {
			this.speedY *= -1;
			this.y = paddle.y - Constants.BALL_RADIUS - 1;
		}

		if (this.intersectX(paddle) && this.prevY - Constants.BALL_RADIUS > paddle.prevY + Constants.PLAYER_SIZE_Y && this.y - Constants.BALL_RADIUS <= paddle.y + Constants.PLAYER_SIZE_Y) {
			this.speedY *= -1;
			this.y = paddle.y + Constants.PLAYER_SIZE_Y + Constants.BALL_RADIUS + 1;
		}
	}

	calculate() {
		this.prevX = this.x;
		this.prevY = this.y;

		this.x = Math.max(Math.min(this.x + this.speedX, Constants.CANVAS_WIDTH - Constants.BALL_RADIUS), Constants.BALL_RADIUS);
		this.y = Math.max(Math.min(this.y + this.speedY, Constants.CANVAS_HEIGHT - Constants.BALL_RADIUS), Constants.BALL_RADIUS);

		if (this.x - Constants.BALL_RADIUS <= 0) {
			this.fireOnOutOfBounds(Side.LEFT);
			this.reset();
		}

		if (this.x + Constants.BALL_RADIUS >= Constants.CANVAS_WIDTH) {
			this.fireOnOutOfBounds(Side.RIGHT);
			this.reset();
		}

		if (this.y - Constants.BALL_RADIUS <= 0 || this.y + Constants.BALL_RADIUS >= Constants.CANVAS_HEIGHT) {
			this.speedY *= -1;
		}

		this.speedX += (this.speedX < 0 ? -1 : 1) * Constants.BALL_ACCELERATION;
		this.speedY += (this.speedY < 0 ? -1 : 1) * Constants.BALL_ACCELERATION;

		return { x: this.x, y: this.y };
	}

	fireOnOutOfBounds(side: Side) {
		this.onOutOfBoundsCallback(side);
	}

	onOutOfBounds(callback: (side: Side) => any) {
		this.onOutOfBoundsCallback = callback;
	}
}

export default Ball;