import { RESPONSE_MESSAGES, STATUS_CODES } from '../configuration/index.js';

/**
 * Create an error response object
 * @param {string} info - response information
 * @param {number} status - response status
 * @returns {error}
 */
export default ({
  info = RESPONSE_MESSAGES.internalServerError,
  status = STATUS_CODES.internalServerError,
}) => {
  const error = new Error(info);
  error.data = {
    datetime: Date.now(),
    info,
    status,
  };

  return error;
};
