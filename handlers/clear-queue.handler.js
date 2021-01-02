import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Clear playback queue (bidirectional)
 * @param {*} socket - connection object
 * @returns {void}
 */
export default (socket) => {
  if (socket.user.client === CLIENTS.desktop
    || socket.user.client === CLIENTS.mobile) {
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.CLEAR_QUEUE,
      {
        target: socket.user.client === CLIENTS.mobile ? CLIENTS.desktop : CLIENTS.mobile,
      },
    );
  }
};
