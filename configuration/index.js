import { env as environment } from 'process';

// Array of the allowed origins for the CORS
export const ALLOWED_ORIGINS = environment.ALLOWED_ORIGINS
  ? environment.ALLOWED_ORIGINS.split(',')
  : '';

// Backend origin
export const { BACKEND_ORIGIN = '' } = environment;

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
  TTL_ROOM: 24 * 60 * 60, // 24 hours
};

// Response messages
export const RESPONSE_MESSAGES = {
  accessDenied: 'ACCESS_DENIED',
  clientTypeAlreadyOnline: 'CLIENT_TYPE_IS_ALREADY_ONLINE',
  internalServerError: 'INTERNAL_SERVER_ERROR',
  invalidToken: 'INVALID_TOKEN',
  missingToken: 'MISSING_TOKEN',
  ok: 'OK',
};

// Socket events
export const SOCKET_EVENTS = {
  CLEAR_QUEUE: 'CLEAR_QUEUE',
  CLIENT_TYPE_IS_ALREADY_ONLINE: 'CLIENT_TYPE_IS_ALREADY_ONLINE',
  CLIENT_DISCONNECTED: 'CLIENT_DISCONNECTED',
  CONNECTION: 'connection',
  DESKTOP_INIT: 'DESKTOP_INIT',
  DISCONNECT: 'disconnect',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NEW_CLIENT_CONNECTED: 'NEW_CLIENT_CONNECTED',
  PLAY_NEXT: 'PLAY_NEXT',
  PLAY_PAUSE: 'PLAY_PAUSE',
  PLAY_PREVIOUS: 'PLAY_PREVIOUS',
  ROOM_STATUS: 'ROOM_STATUS',
  STOP_PLAYBACK: 'STOP_PLAYBACK',
  UPDATE_CURRENT_TRACK: 'UPDATE_CURRENT_TRACK',
  UPDATE_LOOP: 'UPDATE_LOOP',
  UPDATE_MUTE: 'UPDATE_MUTE',
  UPDATE_PLAYBACK_STATE: 'UPDATE_PLAYBACK_STATE',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  UPDATE_QUEUE: 'UPDATE_QUEUE',
  UPDATE_SHUFFLE: 'UPDATE_SHUFFLE',
  UPDATE_VOLUME: 'UPDATE_VOLUME',
};

// Status codes
export const STATUS_CODES = {
  badRequest: 400,
  created: 201,
  internalServerError: 500,
  ok: 200,
  unauthorized: 401,
};

// Token secret
export const { TOKEN_SECRET = 'secret' } = environment;

// Secret for the backend
export const { WS_SECRET = 'secret' } = environment;
