import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Update track volume (bidirectional)
 * @param {*} socket - connection object
 * @param {*} data - volume data
 * @returns {void}
 */
export default (socket, data) => {
  if (socket.user.client === CLIENTS.desktop
    || socket.user.client === CLIENTS.mobile) {
    const { volume = 0 } = data;
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.UPDATE_VOLUME,
      {
        target: socket.user.client === CLIENTS.mobile ? CLIENTS.desktop : CLIENTS.mobile,
        volume,
      },
    );
  }
};
