## deepseen-ws

A Websockets server for the Deepseen project

Stack: Node, Socket.IO, Redis, PostgreSQL, Sequelize, JWT

DEV: http://localhost:9500

### Deploy

```shell script
git clone https://github.com/peterdee/deepseen-ws
cd ./deepseen-ws
nvm use 14
npm i
```

### Environment variables

The `.env` file is required, see the [.env.example](.env.example) for details

### Launch

```shell script
npm run dev
```

### Lint

The `airbnb` preset is used in conjunction with `ESLint`

```shell script
npm run lint
```
