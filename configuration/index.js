import { env as environment } from 'process';

// Array of the allowed origins for the CORS
export const ALLOWED_ORIGINS = environment.ALLOWED_ORIGINS
  ? environment.ALLOWED_ORIGINS.split(',')
  : '';

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
