const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Constants = require('./Constants');
const Scene = require('./Scene');

app.use(express.static('public'));

io.on('connection', socket => {
	const scene = new Scene();

	setInterval(() => {
		io.emit('refresh', scene.calculate());
	}, 1000 / 60);

	socket.on('keydown', key => {
		if (key === 'ArrowDown') {
			scene.setPlayerSpeedY(Constants.PLAYER_SPEED_Y);
		} else if (key === 'ArrowUp') {
			scene.setPlayerSpeedY(-Constants.PLAYER_SPEED_Y);
		}
	});

	socket.on('keyup', key => {
		if (key === 'ArrowDown' || key === 'ArrowUp') {
			scene.setPlayerSpeedY(0);
		}
	});
});

http.listen(3000);