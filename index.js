const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Ball = require('./Ball');

app.use(express.static('public'));

io.on('connection', socket => {
	const ball = new Ball(100, 100);

	setInterval(() => {
		io.emit('ball', ball.calculate());
	}, 1000 / 60);
});

http.listen(3000);