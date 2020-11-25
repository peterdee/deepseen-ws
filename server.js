import { createServer } from 'http';
import { Server } from 'socket.io';

import {
  ALLOWED_ORIGINS,
  ENV,
  PORT,
  SOCKET_EVENTS,
} from './configuration/index.js';
import authorize from './middlewares/authorize.js';
import { client as redis } from './utilities/redis.js';
import connection from './database/index.js';
import log from './utilities/log.js';
import router from './router/index.js';

const httpServer = createServer();
const io = new Server(
  httpServer,
  {
    cors: {
      origin: ALLOWED_ORIGINS,
      credentials: true,
    },
  },
);

io.use((socket, next) => authorize(socket, next));

io.on(SOCKET_EVENTS.connection, router);
// io.on(SOCKET_EVENTS.disconnect, (socket) => log(`disconnected ${socket.id} ${socket.user}`));

redis.on('connect', () => log('-- redis: connected'));
connection.authenticate()
  .then(() => log('-- database: connected'))
  .catch((error) => {
    throw error;
  });

httpServer.listen(
  PORT,
  () => log(`-- DEEPSEEN-WS is running on port ${PORT} [${ENV.toUpperCase()}]`),
);
