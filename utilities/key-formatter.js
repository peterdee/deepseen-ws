/**
 * Create a formatted Redis key with prefix
 * @param {string} prefix - key prefix
 * @param {number|string} value - key value
 * @returns {string}
 */
export default (prefix = '', value) => `${prefix}-${String(value)}`;
