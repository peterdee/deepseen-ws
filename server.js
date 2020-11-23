import { createServer } from 'http';
import { Server } from 'socket.io';

import { ENV, PORT } from './configuration/index.js';
import log from './utilities/log.js';

const httpServer = createServer();
const io = new Server(
  httpServer,
  {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  },
);

io.on('connection', (socket) => log(`connected ${socket.id}`));

httpServer.listen(
  PORT,
  () => log(`-- DEEPSEEN-WS is running on port ${PORT} [${ENV.toUpperCase()}]`),
);
