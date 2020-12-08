import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Update playback state
 * @param {*} socket - connection object
 * @param {*} data - playback state data
 * @returns {void}
 */
export default (socket, data) => {
  if (socket.user.client === CLIENTS.desktop) {
    const { isPlaying = false } = data;
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.UPDATE_PLAYBACK_STATE,
      {
        isPlaying,
        target: CLIENTS.mobile,
      },
    );
  }
};
