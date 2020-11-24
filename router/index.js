import log from '../utilities/log.js';
import { SOCKET_EVENTS } from '../configuration/index.js';

const connections = {};

export default (socket) => {
  socket.on('message', (data) => {
    connections[socket.id] = socket.id;
    log(`message: ${data}, ${socket.userId}, ${JSON.stringify(connections)}`);
  });

  socket.on(SOCKET_EVENTS.playNext, () => log('play next'));
};
