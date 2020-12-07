import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Play / pause the track
 * @param {*} socket - connection object
 * @returns {Promise<*>}
 */
export default (socket) => {
  if (socket.user.client === CLIENTS.mobile) {
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.PLAY_PAUSE,
      {
        target: CLIENTS.desktop,
      },
    );
  }
};
