import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

import Constants from './Constants';
import Side from './Side';
import Scene from './Scene';
import RunnableQueue from './RunnableQueue';

import Player from './Player';

const app: express.Application = express();
const server: http.Server = new http.Server(app);
const io: socketIO.Server = socketIO(server);

const queue: RunnableQueue = new RunnableQueue();
const scene: Scene = new Scene();

app.use(express.static('public'));

scene.onScoreChange(score => io.emit('score', score));

let players: Array<Player> = [];
let interval: NodeJS.Timeout;

function initLeftPlayer(socket: socketIO.Socket) {
	if (!players.some(player => player.socket === socket || player.side === Side.LEFT)) {

		players = players.concat({ socket, side: Side.LEFT });

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
			players = players.filter(({side}) => side !== Side.LEFT);
			stopGame();
		});

		return true;
	}

	return false;
}

function initRightPlayer(socket: socketIO.Socket) {
	if (!players.some(player => player.socket === socket || player.side === Side.RIGHT)) {

		players = players.concat({ socket, side: Side.RIGHT });

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
			players = players.filter(({side}) => side !== Side.RIGHT);
			stopGame();
		});

		return true;
	}

	return false;
}

function stopGame() {
	queue.clear();
	clearInterval(interval);
	io.emit('waiting');
}

function startGame() {
	scene.reset();
	scene.fireOnScoreChange();

	const length = Constants.COUNTDOWN + 1;

	for (let i = 0; i < length; i++) {
		queue.nextRun(() => {
			io.emit('countdown', (i !== length - 1) ? Constants.COUNTDOWN - i : 'GO!');
		}, i === 0 ? 0 : Constants.MILLIS_PER_SECOND);
	}

	queue.nextRun(() => {
		interval = setInterval(() => {
			io.emit('refresh', scene.calculate());
		}, Constants.MILLIS_PER_SECOND / Constants.FRAMES_PER_SECOND);
	}, Constants.MILLIS_PER_SECOND);

	queue.start();
}

io.on('connection', socket => {
	const leftPlayerJoined = initLeftPlayer(socket);
	const rightPlayerJoined = initRightPlayer(socket);

	if (players.length == 2 && (leftPlayerJoined || rightPlayerJoined)) {
		startGame();
	}

	socket.emit('constants', Constants);
});

server.listen(3000);