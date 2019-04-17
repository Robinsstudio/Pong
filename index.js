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
		});

		return true;
	}

	return false;
}

function startGame() {
	if (interval) {
		clearInterval(interval);
	}

	scene.reset();
	scene.fireOnScoreChange();

	interval = setInterval(() => {
		io.emit('refresh', scene.calculate());
	}, 1000 / 60);
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