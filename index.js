const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const Constants = require('./Constants');
const Scene = require('./Scene');

let scene = new Scene();
let peopleConnected = 0;

function initLeftPlayer(socket) {
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
}

function initRightPlayer(socket) {
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
}

function startGame() {
	setInterval(() => {
		io.emit('refresh', scene.calculate());
	}, 1000 / 60);

	scene.onScoreChange(score => io.emit('score', score));
}

io.on('connection', socket => {
	if (peopleConnected == 0) {
		initLeftPlayer(socket);
	} else if (peopleConnected == 1) {
		initRightPlayer(socket);
		startGame();
	}

	socket.emit('constants', Constants);

	peopleConnected++;
});

http.listen(3000);