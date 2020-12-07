import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Update track progress (bidirectional)
 * @param {*} socket - connection object
 * @param {*} data - progress data
 * @returns {void}
 */
export default (socket, data) => {
  if (socket.user.client === CLIENTS.desktop
    || socket.user.client === CLIENTS.mobile) {
    const { progress = 0 } = data;
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.UPDATE_PROGRESS,
      {
        progress,
        target: socket.user.client === CLIENTS.mobile ? CLIENTS.desktop : CLIENTS.mobile,
      },
    );
  }
};
