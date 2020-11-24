// import { decode } from 'jsonwebtoken';

import log from '../utilities/log.js';
import { RESPONSE_MESSAGES, STATUS_CODES } from '../configuration/index.js';

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
    // TODO: session token validation logic
    log('is here st');
    return next();
  }

  if (accessToken) {
    // TODO: access token validation logic
    log('is here at', accessToken);
    return next();
  }

  // send an error response if both tokens are missing
  const error = new Error(RESPONSE_MESSAGES.missingToken);
  error.data = {
    datetime: Date.now(),
    info: RESPONSE_MESSAGES.missingToken,
    status: STATUS_CODES.unauthorized,
  };
  return next(error);
};
