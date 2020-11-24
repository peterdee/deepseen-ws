import { sign } from 'jsonwebtoken';

import { CLIENTS, TOKENS } from '../configuration/index.js';

/**
 * Generate a session token
 * @param {string} client - client type
 * @param {string} userId - user ID
 * @returns {string}
 */
export default ({ client = CLIENTS.mobile, userId = '' }) => sign(
  {
    client,
    type: 'SESSION',
    userId,
  },
  TOKENS.SESSION.SECRET,
  {
    expiresIn: TOKENS.SESSION.EXPIRATION,
  },
);
