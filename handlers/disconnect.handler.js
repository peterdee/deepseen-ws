import { del, get, set } from '../utilities/redis.js';
import keyFormatter from '../utilities/key-formatter.js';
import log from '../utilities/log.js';
import { REDIS, SOCKET_EVENTS } from '../configuration/index.js';

/**
 * Handle client disconnect
 * @param {*} socket - connection object
 * @param {string} reason - disconnect reason
 * @returns {Promise<*>}
 */
export default async (socket, reason = '') => {
  log(` > disconnected: ${socket.id} [ID: ${
    socket.user.id
  }, client: ${socket.user.client}], reason: ${reason}`);

  // create room key
  const key = keyFormatter(REDIS.PREFIXES.room, socket.user.id);

  try {
    // notify the room
    socket.to(socket.user.id).emit(
      SOCKET_EVENTS.CLIENT_DISCONNECTED,
      {
        client: socket.user.client,
      },
    );

    // get room record from Redis
    const redisRoom = await get(key);

    // if there's no room
    if (!redisRoom) {
      return null;
    }

    // if there's a room and it is a string
    if (typeof redisRoom === 'string') {
      const room = JSON.parse(redisRoom);

      // if it's not an array or if it is an empty array
      if (!Array.isArray(room) || room.length === 0) {
        return del(key);
      }

      // if it's an array with items
      const cleanedRoom = room.filter(({ socketId = '' }) => socket.id !== socketId);
      if (cleanedRoom.length === 0) {
        return del(key);
      }
      return set(
        key,
        JSON.stringify(cleanedRoom),
        'EX',
        REDIS.TTL_ROOM,
      );
    }

    // delete the room record in all other cases
    return del(key);
  } catch (error) {
    // show an error
    log(error);

    // delete the room if something goes wrong
    return del(key);
  }
};
