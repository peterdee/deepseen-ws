import log from '../utilities/log.js';

const connections = {};

export default (socket) => {
  socket.on('message', (data) => {
    connections[socket.id] = socket.id;
    log(`message: ${data}, ${JSON.stringify(connections)}`);
  });
};
