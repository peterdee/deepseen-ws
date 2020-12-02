import clientAccessControl from '../utilities/client-access-control.js';
import log from '../utilities/log.js';
import { SOCKET_EVENTS } from '../configuration/index.js';

import disconnect from '../handlers/disconnect.handler.js';

export default async (socket) => {
  log(` > connected: ${socket.id} [ID: ${socket.user.id}, client: ${socket.user.client}]`);

  // client access control
  await clientAccessControl(socket);

  socket.on('message', (data) => {
    log(`message: ${data}, ${
      JSON.stringify(socket.user)
    }, ${JSON.stringify(socket.rooms)}`);
  });

  socket.on(SOCKET_EVENTS.playNext, () => log('play next'));

  // handle client disconnect
  socket.on(
    SOCKET_EVENTS.disconnect,
    (reason = '') => disconnect(socket, reason),
  );
};
