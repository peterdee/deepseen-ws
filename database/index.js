import sequelize from 'sequelize';

import { DATABASE_CONNECTION_STRING } from '../configuration/index.js';
import log from '../utilities/log.js';

import UserModel from './models/User.model.js';

const connection = new sequelize.Sequelize(
  DATABASE_CONNECTION_STRING,
  {
    define: {
      freezeTableName: true,
    },
    dialect: 'postgres',
    logging: false,
  },
);

export const User = UserModel({
  model: sequelize.Model,
  sequelize: connection,
  types: sequelize.DataTypes,
});

/**
 * Synchronize the database with models
 * @param {*} connection - database connection
 * @returns {Promise<void>}
 */
export const synchronize = async (databaseConnection) => {
  await databaseConnection.sync({ force: true });
  return log('-- database: synchronized');
};

// sync if necessary
User.findOne().catch((error) => {
  if (error.message && error.message === 'relation "User" does not exist') {
    return synchronize(connection);
  }

  throw error;
});

export default connection;
