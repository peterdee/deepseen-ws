import {
  CLIENTS,
  EVENTS,
  REDIS,
  RESPONSE_MESSAGES,
  STATUS_CODES,
} from '../configuration/index.js';
import { del, get, set } from './redis.js';
import keyFormatter from './key-formatter.js';

/**
 * Client access control: prevent multiple connections of the same client type
 * @param {*} socket - socket connection
 * @returns {Promise<void|Error>}
 */
export default async (socket) => {
  try {
    // get room record from Redis
    const key = keyFormatter(REDIS.PREFIXES.room, socket.user.id);
    const redisRoom = await get(key);

    // if there's no room, store it in Redis
    if (!redisRoom) {
      socket.join(socket.user.id);
      return set(
        key,
        JSON.stringify([{
          client: socket.user.client,
          socketId: socket.id,
          userId: socket.user.id,
        }]),
      );
    }

    // if room is there and it's a string
    if (typeof redisRoom === 'string') {
      let room;
      try {
        room = JSON.parse(redisRoom);
      } catch {
        // if it cannot be parsed, re-write it
        await del(key);
        socket.join(socket.user.id);
        return set(
          key,
          JSON.stringify([{
            client: socket.user.client,
            socketId: socket.id,
            userId: socket.user.id,
          }]),
        );
      }

      // if it's not an array or if it is an empty array
      if (!Array.isArray(room) || room.length === 0) {
        await del(key);
        socket.join(socket.user.id);
        return set(
          key,
          JSON.stringify([{
            client: socket.user.client,
            socketId: socket.id,
            userId: socket.user.id,
          }]),
        );
      }

      // if it's an array with items
      if (socket.user.client === CLIENTS.web) {
        room.push({
          client: socket.user.client,
          socketId: socket.id,
          userId: socket.user.id,
        });
        socket.join(socket.user.id);
        return set(
          key,
          JSON.stringify(room),
        );
      }

      // in any other case
      const clients = room.map((item) => item.client);
      if (clients.includes(socket.user.client)) {
        return socket.emit(
          EVENTS.OUTGOING.clientTypeAlreadyOnline,
          {
            client: socket.user.client,
            info: RESPONSE_MESSAGES.clientTypeAlreadyOnline,
            status: STATUS_CODES.badRequest,
          },
        );
      }

      room.push({
        client: socket.user.client,
        socketId: socket.id,
        userId: socket.user.id,
      });
      socket.join(socket.user.id);
      return set(
        key,
        JSON.stringify(room),
      );
    }

    // if it is not a string
    await del(key);
    socket.join(socket.user.id);
    return set(
      key,
      JSON.stringify([{
        client: socket.user.client,
        socketId: socket.id,
        userId: socket.user.id,
      }]),
    );
  } catch {
    return socket.emit(
      EVENTS.OUTGOING.internalServerError,
      {
        client: socket.user.client,
        info: RESPONSE_MESSAGES.internalServerError,
        status: STATUS_CODES.internalServerError,
      },
    );
  }
};
