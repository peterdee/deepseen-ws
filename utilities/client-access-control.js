import {
  CLIENTS,
  REDIS,
  RESPONSE_MESSAGES,
  SOCKET_EVENTS,
  STATUS_CODES,
} from '../configuration/index.js';
import { del, get, set } from './redis.js';
import getConnections from './get-connections.js';
import keyFormatter from './key-formatter.js';

/**
 * Client access control: prevent multiple connections of the same client type
 * @param {*} socket - socket connection
 * @param {*} io - Socket.IO connection
 * @returns {Promise<void|Error>}
 */
export default async (socket, io) => {
  try {
    // get room record from Redis
    const key = keyFormatter(REDIS.PREFIXES.room, socket.user.id);
    const redisRoom = await get(key);

    // if there's no room, store it in Redis
    if (!redisRoom) {
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
        return set(
          key,
          JSON.stringify(room),
        );
      }

      // in any other case
      const clients = room.map((item) => item.client);
      if (clients.includes(socket.user.client)) {
        // get all of the connected Socket IDs
        const ids = getConnections(io);

        // check if this socket is still connected
        const [connection] = room.filter(({ client = '' }) => client === socket.user.client);
        if (ids.includes(connection.socketId)) {
          return socket.emit(
            SOCKET_EVENTS.CLIENT_TYPE_IS_ALREADY_ONLINE,
            {
              client: socket.user.client,
              info: RESPONSE_MESSAGES.clientTypeAlreadyOnline,
              status: STATUS_CODES.badRequest,
            },
          );
        }

        // renew the client
        room = room.filter(({ client = '' }) => client !== socket.user.client);
        room.push({
          client: socket.user.client,
          socketId: socket.id,
          userId: socket.user.id,
        });
        return set(
          key,
          JSON.stringify(room),
        );
      }

      room.push({
        client: socket.user.client,
        socketId: socket.id,
        userId: socket.user.id,
      });
      return set(
        key,
        JSON.stringify(room),
      );
    }

    // if it is not a string
    await del(key);
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
      SOCKET_EVENTS.INTERNAL_SERVER_ERROR,
      {
        client: socket.user.client,
        info: RESPONSE_MESSAGES.internalServerError,
        status: STATUS_CODES.internalServerError,
      },
    );
  }
};
