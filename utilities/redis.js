import redis from 'redis';
import { promisify } from 'util';

import { REDIS } from '../configuration/index.js';

const client = redis.createClient({
  host: REDIS.HOST,
  password: REDIS.PASSWORD,
  port: REDIS.PORT,
});

const del = promisify(client.del).bind(client);
const expire = promisify(client.expire).bind(client);
const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);

// if there's something wrong with Redis connection
client.on('error', (error) => {
  throw error;
});

export {
  client,
  del,
  expire,
  get,
  set,
};
