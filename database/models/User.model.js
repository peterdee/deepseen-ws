export default ({ model, sequelize, types }) => {
  class User extends model {}

  User.init(
    {
      email: types.STRING,
      name: types.STRING,
      image: types.STRING,
      created: types.INTEGER,
      updated: types.INTEGER,
    },
    {
      modelName: 'User',
      sequelize,
      timestamps: true,
    },
  );

  return User;
};
