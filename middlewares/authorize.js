import axios from 'axios';
import jwt from 'jsonwebtoken';

import {
  BACKEND_ORIGIN,
  CLIENTS,
  REDIS,
  RESPONSE_MESSAGES,
  STATUS_CODES,
  TOKEN_SECRET,
  WS_SECRET,
} from '../configuration/index.js';
import errorResponse from '../utilities/error-response.js';
import { expire, get, set } from '../utilities/redis.js';
import keyFormatter from '../utilities/key-formatter.js';

/**
 * Authorize a connection
 * @param {*} socket - a socket connection
 * @param {*} next - call the next handler
 * @returns {Promise<void>}
 */
export default async (socket, next) => {
  // check token
  const { handshake: { query: { token = '' } = {} } = {} } = socket;
  if (!token) {
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
    } = await jwt.verify(token, TOKEN_SECRET);

    // if some of the token data is missing
    if (!(client && image && userId)) {
      return next(errorResponse({
        info: RESPONSE_MESSAGES.invalidToken,
        status: STATUS_CODES.unauthorized,
      }));
    }

    // check if client is valid
    const clientList = Object.values(CLIENTS);
    if (!clientList.includes(client)) {
      return next(errorResponse({
        info: RESPONSE_MESSAGES.invalidToken,
        status: STATUS_CODES.unauthorized,
      }));
    }

    // find user image in Redis
    const userKey = keyFormatter(REDIS.PREFIXES.user, userId);
    const redisImage = await get(userKey);
    if (redisImage) {
      if (redisImage === image) {
        // update EXPIRE in Redis
        await expire(userKey, REDIS.TTL);

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

    // load user image from the backend server
    const { data: { data: { image: imageRecord = {} } = {} } = {} } = await axios({
      headers: {
        'X-WS-SECRET': WS_SECRET,
      },
      method: 'GET',
      url: `${BACKEND_ORIGIN}/api/services/image/${userId}`,
    });
    if (!(imageRecord.image && imageRecord.userId)) {
      return next(errorResponse({
        info: RESPONSE_MESSAGES.accessDenied,
        status: STATUS_CODES.unauthorized,
      }));
    }

    // compare images and User IDs
    if (imageRecord.image !== image || imageRecord.userId !== userId) {
      return next(errorResponse({
        info: RESPONSE_MESSAGES.accessDenied,
        status: STATUS_CODES.unauthorized,
      }));
    }

    // store user image in Redis
    await set(
      userKey,
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
      info: RESPONSE_MESSAGES.accessDenied,
      status: STATUS_CODES.unauthorized,
    }));
  }
};
