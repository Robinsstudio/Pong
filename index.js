const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const Constants = require('./Constants');
const Scene = require('./Scene');

let scene = null;
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

function initScene() {
	scene = new Scene();
	setInterval(() => {
		io.emit('refresh', scene.calculate());
	}, 1000 / 60);
}

io.on('connection', socket => {
	if (peopleConnected == 0) {
		initScene();
		initLeftPlayer(socket);
	} else if (peopleConnected == 1) {
		initRightPlayer(socket);
	}
	peopleConnected++;
});

http.listen(3000);