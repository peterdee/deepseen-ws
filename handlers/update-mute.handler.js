import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Update volume muting (bidirectional)
 * @param {*} socket - connection object
 * @param {*} data - muted data
 * @returns {void}
 */
export default (socket, data) => {
  if (socket.user.client === CLIENTS.desktop
    || socket.user.client === CLIENTS.mobile) {
    const { isMuted = true } = data;
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.UPDATE_MUTE,
      {
        isMuted,
        target: socket.user.client === CLIENTS.mobile ? CLIENTS.desktop : CLIENTS.mobile,
      },
    );
  }
};
