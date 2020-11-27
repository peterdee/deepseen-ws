import { get, set } from '../utilities/redis.js';
import keyFormatter from '../utilities/key-formatter.js';
import log from '../utilities/log.js';
import { REDIS, SOCKET_EVENTS } from '../configuration/index.js';

import disconnect from '../handlers/disconnect.handler.js';

const connections = {};

export default async (socket) => {
  log(` > connected: ${socket.id} [ID: ${socket.user.id}, client: ${socket.user.client}]`);

  // store online status in Redis
  const key = keyFormatter(REDIS.PREFIXES.room, socket.user.id);
  const userRoom = await get(key);
  await set(
    key,
    JSON.stringify([
      ...(userRoom ? JSON.parse(userRoom) : []),
      {
        client: socket.user.client,
        socketId: socket.id,
        userId: socket.user.id,
      },
    ]),
    'EX',
    REDIS.TTL,
  );

  // join a room for a specific User ID
  socket.join(socket.user.id);

  socket.on('message', (data) => {
    connections[socket.id] = socket.id;
    log(`message: ${data}, ${
      JSON.stringify(socket.user)
    }, ${JSON.stringify(connections)}, ${JSON.stringify(socket.rooms)}`);
  });

  socket.on(SOCKET_EVENTS.playNext, () => log('play next'));

  // handle client disconnect
  socket.on(
    SOCKET_EVENTS.disconnect,
    (reason = '') => disconnect(socket, reason),
  );
};
