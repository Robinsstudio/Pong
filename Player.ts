import socketIO from 'socket.io';
import Side from './Side';

class Player {
	socket: socketIO.Socket;
	side: Side

	constructor(socket: socketIO.Socket, side: Side) {
		this.socket = socket;
		this.side = side;
	}
}

export default Player;