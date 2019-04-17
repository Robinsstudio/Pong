const Constants = require('./Constants');
const Ball = require('./Ball');
const Player = require('./Player');

class Scene {
	reset() {
		this.ball = new Ball();
		this.leftPlayer = new Player(.125 * Constants.CANVAS_WIDTH - .5 * Constants.PLAYER_SIZE_X, .5 * Constants.CANVAS_HEIGHT - .5 * Constants.PLAYER_SIZE_Y);
		this.rightPlayer = new Player(.875 * Constants.CANVAS_WIDTH - .5 * Constants.PLAYER_SIZE_X, .5 * Constants.CANVAS_HEIGHT - .5 * Constants.PLAYER_SIZE_Y);
		this.score = { leftPlayer: 0, rightPlayer: 0 };

		this.ball.onOutOfBounds(side => {
			if (side === Constants.LEFT) {
				this.incrementScore({ leftPlayer: 0, rightPlayer: 1 });
			} else if (side === Constants.RIGHT) {
				this.incrementScore({ leftPlayer: 1, rightPlayer: 0 });
			}
		});
	}

	setLeftPlayerSpeedY(speedY) {
		this.leftPlayer.setSpeedY(speedY);
	}

	setRightPlayerSpeedY(speedY) {
		this.rightPlayer.setSpeedY(speedY)
	}

	incrementScore(score) {
		const { leftPlayer, rightPlayer } = score;
		this.score.leftPlayer += leftPlayer;
		this.score.rightPlayer += rightPlayer;
		this.fireOnScoreChange();
	}

	calculate() {
		const ball = this.ball.calculate();
		const leftPlayer = this.leftPlayer.calculate();
		const rightPlayer = this.rightPlayer.calculate();

		this.ball.collideWith(this.leftPlayer);
		this.ball.collideWith(this.rightPlayer);

		return { ball, leftPlayer, rightPlayer };
	}

	fireOnScoreChange() {
		this.onScoreChangeCallback(this.score);
	}

	onScoreChange(callback) {
		this.onScoreChangeCallback = callback;
	}
}

module.exports = Scene;