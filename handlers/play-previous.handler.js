import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Play the previous track
 * @param {*} socket - connection object
 * @returns {Promise<*>}
 */
export default (socket) => {
  if (socket.user.client === CLIENTS.mobile) {
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.PLAY_PREVIOUS,
      {
        target: CLIENTS.desktop,
      },
    );
  }
};
