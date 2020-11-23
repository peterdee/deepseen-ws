import { createServer } from 'http';
import { Server } from 'socket.io';

import {
  ALLOWED_ORIGINS,
  ENV,
  PORT,
} from './configuration/index.js';
import log from './utilities/log.js';

import connection from './handlers/connection.js';

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

io.on('connection', connection);

httpServer.listen(
  PORT,
  () => log(`-- DEEPSEEN-WS is running on port ${PORT} [${ENV.toUpperCase()}]`),
);
