import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Stop the playback
 * @param {*} socket - connection object
 * @returns {Promise<*>}
 */
export default (socket) => {
  if (socket.user.client === CLIENTS.mobile) {
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.STOP_PLAYBACK,
      {
        target: CLIENTS.desktop,
      },
    );
  }
};
