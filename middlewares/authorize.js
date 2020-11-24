import jwt from 'jsonwebtoken';

import {
  CLIENTS,
  RESPONSE_MESSAGES,
  STATUS_CODES,
  TOKENS,
} from '../configuration/index.js';
import errorResponse from '../utilities/error-response.js';

export default async (socket, next) => {
  const {
    handshake: {
      query: {
        accessToken = '',
        sessionToken = '',
      } = {},
    } = {},
  } = socket;

  // check the session token
  if (sessionToken) {
    const {
      client = '',
      type = '',
      userId = '',
    } = await jwt.verify(sessionToken, TOKENS.SESSION.SECRET);

    // if some of the token data is missing
    if (!(client && type && type === TOKENS.TYPES.SESSION && userId)) {
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

    // continue
    // eslint-disable-next-line
    socket.user = {
      client,
      id: userId,
      sessionToken,
    };
    return next();
  }

  if (accessToken) {
    try {
      const {
        client = '',
        image = '',
        type = '',
        userId = '',
      } = await jwt.verify(accessToken, TOKENS.ACCESS.SECRET);

      // if some of the token data is missing
      if (!(client && image && type && type === TOKENS.TYPES.ACCESS && userId)) {
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

      // eslint-disable-next-line
      socket.userId = userId;
      return next();
    } catch (error) {
      return next();
    }
  }

  // send an error response if both tokens are missing
  return next(errorResponse({
    info: RESPONSE_MESSAGES.missingToken,
    status: STATUS_CODES.unauthorized,
  }));
};
