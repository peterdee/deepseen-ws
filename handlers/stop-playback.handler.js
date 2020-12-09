import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Stop the playback (bidirectional)
 * @param {*} socket - connection object
 * @returns {Promise<*>}
 */
export default (socket) => {
  if (socket.user.client === CLIENTS.mobile
    || socket.user.client === CLIENTS.desktop) {
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.STOP_PLAYBACK,
      {
        target: socket.user.client === CLIENTS.mobile ? CLIENTS.desktop : CLIENTS.mobile,
      },
    );
  }
};
