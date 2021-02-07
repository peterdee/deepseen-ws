import { CLIENTS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Notify connected clients about a complete logout
 * @param {*} socket - connection object
 * @returns {void}
 */
export default (socket) => {
  if (socket.user.client === CLIENTS.web) {
    socket.to(socket.user.id).emit(SOCKET_EVENTS.COMPLETE_LOGOUT);
  }
};
