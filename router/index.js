import clientAccessControl from '../utilities/client-access-control.js';
import log from '../utilities/log.js';
import { SOCKET_EVENTS } from '../configuration/index.js';

import disconnect from '../handlers/disconnect.handler.js';

/**
 * Router for the incoming events
 * @param {*} socket - socket object
 * @param {*} io - Socket.IO object
 * @returns {Promise<void>}
 */
export default async (socket, io) => {
  log(` > connected: ${socket.id} [ID: ${socket.user.id}, client: ${socket.user.client}]`);

  // client access control
  await clientAccessControl(socket, io);

  // join the room
  socket.join(socket.user.id);

  // TODO: notify others in the same room that a new client has connected

  // handlers
  socket.on('message', (data) => {
    log(`message: ${data}, ${JSON.stringify(socket.user)}`);
  });
  socket.on(SOCKET_EVENTS.playNext, () => log('play next'));

  // handle client disconnect
  socket.on(
    SOCKET_EVENTS.disconnect,
    (reason = '') => disconnect(socket, reason),
  );
};
