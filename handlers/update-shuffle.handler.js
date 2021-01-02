import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Update shuffling option (bidirectional)
 * @param {*} socket - connection object
 * @param {*} data - shuffle data
 * @returns {void}
 */
export default (socket, data) => {
  if (socket.user.client === CLIENTS.desktop
    || socket.user.client === CLIENTS.mobile) {
    const { shuffle = false } = data;
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.UPDATE_SHUFFLE,
      {
        shuffle,
        target: socket.user.client === CLIENTS.mobile ? CLIENTS.desktop : CLIENTS.mobile,
      },
    );
  }
};
