/**
 * Get all connected Socket IDs
 * @param {*} io - Socket.IO connection
 * @returns {string[]}
 */
export default (io) => {
  const ids = [];
  io.in('/').sockets.sockets.forEach(({ id }) => ids.push(id));
  return ids;
};
