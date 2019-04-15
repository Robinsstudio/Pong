const Constants = require('./Constants');
const Ball = require('./Ball');
const Player = require('./Player');

class Scene {
	constructor() {
		this.ball = new Ball(Constants.CANVAS_WIDTH / 2 - Constants.BALL_RADIUS, Constants.CANVAS_HEIGHT / 2 - Constants.BALL_RADIUS);
		this.player = new Player(.125 * Constants.CANVAS_WIDTH - .5 * Constants.PLAYER_SIZE_X, .5 * Constants.CANVAS_HEIGHT - .5 * Constants.PLAYER_SIZE_Y);
	}

	setPlayerSpeedY(speedY) {
		this.player.setSpeedY(speedY);
	}

	calculate() {
		const ball = this.ball.calculate();
		const player = this.player.calculate();

		this.ball.collideWith(this.player);

		return { ball, player };
	}
}

module.exports = Scene;