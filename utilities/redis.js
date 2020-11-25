import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

const del = promisify(client.del).bind(client);
const get = promisify(client.get).bind(client);
const set = promisify(client.set).bind(client);

// if there's something wrong with Redis connection
client.on('error', (error) => {
  throw error;
});

export {
  client,
  del,
  get,
  set,
};
