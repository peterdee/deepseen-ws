import { createServer } from 'http';
import { Server } from 'socket.io';

import {
  ALLOWED_ORIGINS,
  ENV,
  PORT,
  SOCKET_EVENTS,
} from './configuration/index.js';
import authorize from './middlewares/authorize.js';
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

httpServer.listen(
  PORT,
  () => log(`-- DEEPSEEN-WS is running on port ${PORT} [${ENV.toUpperCase()}]`),
);
