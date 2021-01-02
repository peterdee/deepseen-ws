import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Update playlist looping (bidirectional)
 * @param {*} socket - connection object
 * @param {*} data - loop data
 * @returns {void}
 */
export default (socket, data) => {
  if (socket.user.client === CLIENTS.desktop
    || socket.user.client === CLIENTS.mobile) {
    const { loop = false } = data;
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.UPDATE_LOOP,
      {
        loop,
        target: socket.user.client === CLIENTS.mobile ? CLIENTS.desktop : CLIENTS.mobile,
      },
    );
  }
};
