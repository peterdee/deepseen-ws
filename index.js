// import dotenv module conditionally depending on the ENV
if (process.env.ENV !== 'heroku') {
  import('dotenv').then(({ default: dotenv }) => {
    dotenv.config();

    return import('./server.js');
  }).catch((error) => {
    throw error;
  });
} else {
  import('./server.js');
}
