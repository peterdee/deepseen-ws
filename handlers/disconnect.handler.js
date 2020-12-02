import { del, get, set } from '../utilities/redis.js';
import keyFormatter from '../utilities/key-formatter.js';
import log from '../utilities/log.js';
import { REDIS } from '../configuration/index.js';

/**
 * Handle client disconnect
 * @param {*} socket - connection object
 * @param {string} reason - disconnect reason
 * @returns {Promise<void>}
 */
export default async (socket, reason = '') => {
  log(` > disconnected: ${socket.id} [ID: ${
    socket.user.id
  }, client: ${socket.user.client}], reason: ${reason}`);

  // get user room from Redis
  const key = keyFormatter(REDIS.PREFIXES.room, socket.user.id);
  const userRoom = await get(key);
  if (!userRoom) {
    return del(key);
  }

  // make sure that there are clients in the Redis room
  const clients = JSON.parse(userRoom);
  if (!(clients && Array.isArray(clients) && clients.length > 0)) {
    return del(key);
  }

  // update the room in Redis
  return set(
    key,
    JSON.stringify(clients.filter((client) => client.socketId !== socket.id)),
  );
};
