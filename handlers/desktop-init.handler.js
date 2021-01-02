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
      elapsed = 0,
      isMuted = false,
      isPlaying = false,
      loop = false,
      progress = 0,
      queue = 0,
      shuffle = false,
      track = {},
      volume = 0,
    } = data;
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.DESKTOP_INIT,
      {
        elapsed,
        isMuted,
        isPlaying,
        loop,
        progress,
        queue,
        shuffle,
        target: CLIENTS.mobile,
        track,
        volume,
      },
    );
  }
};
