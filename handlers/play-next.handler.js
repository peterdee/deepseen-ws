import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Play the next track
 * @param {*} socket - connection object
 * @returns {void}
 */
export default (socket) => {
  if (socket.user.client === CLIENTS.mobile) {
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.PLAY_NEXT,
      {
        target: CLIENTS.desktop,
      },
    );
  }
};
