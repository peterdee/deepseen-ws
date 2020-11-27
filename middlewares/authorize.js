import jwt from 'jsonwebtoken';

import {
  CLIENTS,
  REDIS,
  RESPONSE_MESSAGES,
  STATUS_CODES,
  TOKENS,
} from '../configuration/index.js';
import errorResponse from '../utilities/error-response.js';
import keyFormatter from '../utilities/key-formatter.js';
import { get, set } from '../utilities/redis.js';

/**
 * Authorize a connection
 * @param {*} socket - a socket connection
 * @param {*} next - call the next handler
 * @returns {Promise<void>}
 */
export default async (socket, next) => {
  // check access token
  const { handshake: { query: { accessToken = '' } = {} } = {} } = socket;
  if (!accessToken) {
    return next(errorResponse({
      info: RESPONSE_MESSAGES.missingToken,
      status: STATUS_CODES.unauthorized,
    }));
  }

  try {
    const {
      client = '',
      image = '',
      userId = '',
    } = await jwt.verify(accessToken, TOKENS.ACCESS.SECRET);

    // if some of the token data is missing
    if (!(client && image && userId)) {
      return next(errorResponse({
        info: RESPONSE_MESSAGES.invalidToken,
        status: STATUS_CODES.unauthorized,
      }));
    }

    // if the client is invalid
    const clientList = Object.values(CLIENTS);
    if (!clientList.includes(client)) {
      return next(errorResponse({
        info: RESPONSE_MESSAGES.invalidToken,
        status: STATUS_CODES.unauthorized,
      }));
    }

    // find user in Redis
    const redisImage = await get(userId);
    if (redisImage) {
      if (redisImage === image) {
        // eslint-disable-next-line
        socket.user = {
          client,
          id: userId,
        };
        return next();
      }
      return next(errorResponse({
        info: RESPONSE_MESSAGES.invalidToken,
        status: STATUS_CODES.unauthorized,
      }));
    }

    // TODO: load user from the main server

    await set(
      keyFormatter(REDIS.PREFIXES.user, userId),
      image,
      'EX',
      REDIS.TTL,
    );

    // eslint-disable-next-line
    socket.user = {
      client,
      id: userId,
    };
    return next();
  } catch {
    return next(errorResponse({
      info: RESPONSE_MESSAGES.invalidToken,
      status: STATUS_CODES.unauthorized,
    }));
  }
};
