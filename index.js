const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const Constants = require('./Constants');
const Scene = require('./Scene');

const scene = new Scene();
scene.onScoreChange(score => io.emit('score', score));

let players = [];
let interval = null;

function initLeftPlayer(socket) {
	if (!players.some(player => player.socket === socket || player.side === Constants.LEFT)) {

		players = players.concat({ socket, side: Constants.LEFT });

		socket.on('keydown', key => {
			if (key === 'ArrowDown') {
				scene.setLeftPlayerSpeedY(Constants.PLAYER_SPEED_Y);
			} else if (key === 'ArrowUp') {
				scene.setLeftPlayerSpeedY(-Constants.PLAYER_SPEED_Y);
			}
		});

		socket.on('keyup', key => {
			if (key === 'ArrowDown' || key === 'ArrowUp') {
				scene.setLeftPlayerSpeedY(0);
			}
		});

		socket.on('disconnect', () => {
			players = players.filter(({side}) => side !== Constants.LEFT);
			stopGame();
		});

		return true;
	}

	return false;
}

function initRightPlayer(socket) {
	if (!players.some(player => player.socket === socket || player.side === Constants.RIGHT)) {

		players = players.concat({ socket, side: Constants.RIGHT });

		socket.on('keydown', key => {
			if (key === 'ArrowDown') {
				scene.setRightPlayerSpeedY(Constants.PLAYER_SPEED_Y);
			} else if (key === 'ArrowUp') {
				scene.setRightPlayerSpeedY(-Constants.PLAYER_SPEED_Y);
			}
		});

		socket.on('keyup', key => {
			if (key === 'ArrowDown' || key === 'ArrowUp') {
				scene.setRightPlayerSpeedY(0);
			}
		});

		socket.on('disconnect', () => {
			players = players.filter(({side}) => side !== Constants.RIGHT);
			stopGame();
		});

		return true;
	}

	return false;
}

function stopGame() {
	if (interval) {
		clearInterval(interval);
		io.emit('waiting');
	}
}

function startGame() {
	stopGame();

	scene.reset();
	scene.fireOnScoreChange();

	const length = Constants.COUNTDOWN + 1;

	Array.from({ length }, (_, i) => setTimeout(() => {
		io.emit('countdown', (i !== length - 1) ? Constants.COUNTDOWN - i : 'GO!');
	}, i * Constants.MILLIS_PER_SECOND));

	setTimeout(() => {
		interval = setInterval(() => {
			io.emit('refresh', scene.calculate());
		}, Constants.MILLIS_PER_SECOND / Constants.FRAMES_PER_SECOND);
	}, length * Constants.MILLIS_PER_SECOND);
}

io.on('connection', socket => {
	const leftPlayerJoined = initLeftPlayer(socket);
	const rightPlayerJoined = initRightPlayer(socket);

	if (players.length == 2 && (leftPlayerJoined || rightPlayerJoined)) {
		startGame();
	}

	socket.emit('constants', Constants);
});

http.listen(3000);