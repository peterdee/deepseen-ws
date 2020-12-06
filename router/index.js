import clientAccessControl from '../utilities/client-access-control.js';
import log from '../utilities/log.js';
import { SOCKET_EVENTS } from '../configuration/index.js';

import disconnect from '../handlers/disconnect.handler.js';
import newClientConnected from '../handlers/new-client-connected.handler.js';

/**
 * Router for the incoming events
 * @param {*} socket - socket object
 * @param {*} io - Socket.IO object
 * @returns {Promise<void>}
 */
export default async (socket, io) => {
  try {
    log(` > connected: ${socket.id} [ID: ${socket.user.id}, client: ${socket.user.client}]`);

    // client access control
    await clientAccessControl(socket, io);

    // join the room
    socket.join(socket.user.id);
    await newClientConnected(socket);

    // handlers TODO: move those to their respective files
    socket.on(SOCKET_EVENTS.PLAY_NEXT, () => {
      log('next');
      socket.to(socket.user.id).emit(SOCKET_EVENTS.PLAY_NEXT);
    });
    socket.on(SOCKET_EVENTS.PLAY_PAUSE, () => {
      log('play / pause');
      socket.to(socket.user.id).emit(SOCKET_EVENTS.PLAY_PAUSE);
    });
    socket.on(SOCKET_EVENTS.PLAY_PREVIOUS, () => {
      log('previous');
      socket.to(socket.user.id).emit(SOCKET_EVENTS.PLAY_PREVIOUS);
    });
    socket.on(SOCKET_EVENTS.STOP_PLAYBACK, () => {
      log('stop');
      socket.to(socket.user.id).emit(SOCKET_EVENTS.STOP_PLAYBACK);
    });

    // handle client disconnect
    socket.on(
      SOCKET_EVENTS.disconnect,
      (reason = '') => disconnect(socket, reason),
    );
  } catch (error) {
    log(error);
  }
};
