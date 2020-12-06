import { get } from '../utilities/redis.js';
import keyFormatter from '../utilities/key-formatter.js';
import log from '../utilities/log.js';
import { REDIS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Notify others that a new client connected
 * @param {*} socket - connection object
 * @returns {Promise<*>}
 */
export default async (socket) => {
  // create room key
  const key = keyFormatter(REDIS.PREFIXES.room, socket.user.id);

  try {
    // get room record
    const redisRoom = await get(key);
    const room = JSON.parse(redisRoom);

    // provide information about the room to the connected client
    socket.emit(SOCKET_EVENTS.ROOM_STATUS, { room });

    // notify other clients
    return socket.to(socket.user.id).emit(
      SOCKET_EVENTS.NEW_CLIENT_CONNECTED,
      {
        client: socket.user.client,
        room,
      },
    );
  } catch (error) {
    return log(error);
  }
};
