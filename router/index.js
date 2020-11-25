import log from '../utilities/log.js';
import { SOCKET_EVENTS } from '../configuration/index.js';

const connections = {};

export default (socket) => {
  log(` > connection: ${socket.id} [ID: ${socket.user.id}, client: ${socket.user.client}]`);
  socket.on('message', (data) => {
    connections[socket.id] = socket.id;
    log(`message: ${data}, ${socket.user}, ${JSON.stringify(connections)}`);
  });

  socket.on(SOCKET_EVENTS.playNext, () => log('play next'));
};
