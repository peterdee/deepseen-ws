import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Update current track
 * @param {*} socket - connection object
 * @param {*} data - track data
 * @returns {Promise<*>}
 */
export default (socket, data) => {
  if (socket.user.client === CLIENTS.desktop) {
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.UPDATE_CURRENT_TRACK,
      {
        target: CLIENTS.mobile,
        track: data.track,
      },
    );
  }
};
