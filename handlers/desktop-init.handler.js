import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Send an initial desktop data to the mobile client
 * @param {*} socket - connection object
 * @param {*} data - initial desktop data
 * @returns {void}
 */
export default (socket, data) => {
  if (socket.user.client === CLIENTS.desktop) {
    const {
      isMuted = false,
      isPlaying = false,
      progress = 0,
      track = {},
      volume = 0,
    } = data;
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.UPDATE_VOLUME,
      {
        isMuted,
        isPlaying,
        progress,
        target: CLIENTS.mobile,
        track,
        volume,
      },
    );
  }
};
