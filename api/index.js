require('dotenv').config()

const http = require('./http');
const postgres = require('./lib/postgres');
const logger = require('./lib/logger');

const app = async () => {
  await postgres.init();

  await http.listen();
};


app()
  .then(() => logger.info(`Successfully booted`))
  .catch((error) => logger.error(`Failed to boot`, error));
