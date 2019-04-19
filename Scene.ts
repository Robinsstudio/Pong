import Constants from './Constants';
import Side from './Side';
import Ball from './Ball';
import Paddle from './Paddle';
import Score from './Score';

class Scene {
	ball: Ball = new Ball();
	leftPaddle: Paddle = new Paddle(0, 0);
	rightPaddle: Paddle = new Paddle(0, 0);
	score: Score = new Score(0, 0);

	onScoreChangeCallback: Function = () => {};

	reset() {
		this.ball = new Ball();
		this.leftPaddle = new Paddle(.125 * Constants.CANVAS_WIDTH - .5 * Constants.PLAYER_SIZE_X, .5 * Constants.CANVAS_HEIGHT - .5 * Constants.PLAYER_SIZE_Y);
		this.rightPaddle = new Paddle(.875 * Constants.CANVAS_WIDTH - .5 * Constants.PLAYER_SIZE_X, .5 * Constants.CANVAS_HEIGHT - .5 * Constants.PLAYER_SIZE_Y);
		this.score = { leftPlayer: 0, rightPlayer: 0 };

		this.ball.onOutOfBounds(side => {
			if (side === Side.LEFT) {
				this.incrementScore({ leftPlayer: 0, rightPlayer: 1 });
			} else if (side === Side.RIGHT) {
				this.incrementScore({ leftPlayer: 1, rightPlayer: 0 });
			}
		});
	}

	setLeftPlayerSpeedY(speedY: number) {
		this.leftPaddle.setSpeedY(speedY);
	}

	setRightPlayerSpeedY(speedY: number) {
		this.rightPaddle.setSpeedY(speedY)
	}

	incrementScore(score: Score) {
		const { leftPlayer, rightPlayer } = score;
		this.score.leftPlayer += leftPlayer;
		this.score.rightPlayer += rightPlayer;
		this.fireOnScoreChange();
	}

	calculate() {
		const ball = this.ball.calculate();
		const leftPlayer = this.leftPaddle.calculate();
		const rightPlayer = this.rightPaddle.calculate();

		this.ball.collideWith(this.leftPaddle);
		this.ball.collideWith(this.rightPaddle);

		return { ball, leftPlayer, rightPlayer };
	}

	fireOnScoreChange() {
		this.onScoreChangeCallback(this.score);
	}

	onScoreChange(callback: (score: Score) => any) {
		this.onScoreChangeCallback = callback;
	}
}

export default Scene;