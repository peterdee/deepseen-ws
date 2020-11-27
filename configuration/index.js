import { env as environment } from 'process';

// Array of the allowed origins for the CORS
export const ALLOWED_ORIGINS = environment.ALLOWED_ORIGINS
  ? environment.ALLOWED_ORIGINS.split(',')
  : '';

// Available client types
export const CLIENTS = {
  desktop: 'desktop',
  mobile: 'mobile',
  web: 'web',
};

// Available application environments
export const ENVS = {
  development: 'development',
  heroku: 'heroku',
  production: 'production',
};

// Current application environment
export const ENV = environment.ENV || ENVS.development;

// Database connection
export const { DATABASE_CONNECTION_STRING = '' } = environment;

// Application port
export const PORT = Number(environment.PORT) || 9500;

// Redis
export const REDIS = {
  HOST: environment.REDIS_HOST || '',
  PASSWORD: environment.REDIS_PASSWORD || '',
  PORT: Number(environment.REDIS_PORT) || 6379,
  PREFIXES: {
    room: 'room',
    user: 'user',
  },
  TTL: 8 * 60 * 60, // 8 hours
};

// Response messages
export const RESPONSE_MESSAGES = {
  internalServerError: 'INTERNAL_SERVER_ERROR',
  invalidToken: 'INVALID_TOKEN',
  missingToken: 'MISSING_TOKEN',
  ok: 'OK',
};

// Socket event names
export const SOCKET_EVENTS = {
  connection: 'connection',
  disconnect: 'disconnect',
  playNext: 'play-next',
};

// Status codes
export const STATUS_CODES = {
  badRequest: 400,
  created: 201,
  internalServerError: 500,
  ok: 200,
  unauthorized: 401,
};

// Tokens
export const TOKENS = {
  ACCESS: {
    SECRET: environment.TOKENS_ACCESS_SECRET || 'secret',
  },
};
