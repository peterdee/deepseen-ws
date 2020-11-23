// Run the server
(function launch() {
  // import dotenv module conditionally depending on the ENV
  const { env: { ENV = '' } = {} } = process;

  if (ENV && ENV === 'heroku') {
    return import('./server.js');
  }

  return import('dotenv').then(({ default: dotenv }) => {
    dotenv.config();
    return import('./server.js');
  }).catch((error) => {
    throw error;
  });
}());
