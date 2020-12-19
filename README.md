## deepseen-ws

A Websockets server for the [Deepseen](https://github.com/peterdee/deepseen-desktop) project

Stack: [Node](https://nodejs.org), [Socket.IO](https://socket.io), [Redis](https://www.npmjs.com/package/redis), [JWT](https://www.npmjs.com/package/jsonwebtoken)

DEV: http://localhost:9500

STAGE: https://deepseen-ws.herokuapp.com

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

### Heroku

The `staging` branch is auto-deployed to Heroku

### License

[MIT](LICENSE)
