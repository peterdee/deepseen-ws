import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Update playback queue
 * @param {*} socket - connection object
 * @param {*} data - queue data
 * @returns {void}
 */
export default (socket, data) => {
  if (socket.user.client === CLIENTS.desktop) {
    const { queue = 0 } = data;
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.UPDATE_QUEUE,
      {
        queue,
        target: CLIENTS.mobile,
      },
    );
  }
};
