const Constants = require('./Constants');
const Ball = require('./Ball');
const Player = require('./Player');

class Scene {
	constructor() {
		this.ball = new Ball(Constants.CANVAS_WIDTH / 2 - Constants.BALL_RADIUS, Constants.CANVAS_HEIGHT / 2 - Constants.BALL_RADIUS);
		this.leftPlayer = new Player(.125 * Constants.CANVAS_WIDTH - .5 * Constants.PLAYER_SIZE_X, .5 * Constants.CANVAS_HEIGHT - .5 * Constants.PLAYER_SIZE_Y);
		this.rightPlayer = new Player(.875 * Constants.CANVAS_WIDTH - .5 * Constants.PLAYER_SIZE_X, .5 * Constants.CANVAS_HEIGHT - .5 * Constants.PLAYER_SIZE_Y);
	}

	setLeftPlayerSpeedY(speedY) {
		this.leftPlayer.setSpeedY(speedY);
	}

	setRightPlayerSpeedY(speedY) {
		this.rightPlayer.setSpeedY(speedY)
	}

	calculate() {
		const ball = this.ball.calculate();
		const leftPlayer = this.leftPlayer.calculate();
		const rightPlayer = this.rightPlayer.calculate();

		this.ball.collideWith(this.leftPlayer);
		this.ball.collideWith(this.rightPlayer);

		return { ball, leftPlayer, rightPlayer };
	}
}

module.exports = Scene;