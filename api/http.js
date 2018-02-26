const path = require('path');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const Boom = require('boom');

const logger = require('./lib/logger');


class Server {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app); //eslint-disable-line
    this.port = process.env.PORT;

    this.initialize();
    this.setRoutes();
    this.setErrorHandlers();
  }

  initialize() {
    this.app.enable('trust proxy');
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(methodOverride('X-HTTP-Method'));
    this.app.use(methodOverride('X-HTTP-Method-Override'));
    this.app.use(methodOverride('X-Method-Override'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
  }

  setRoutes() {
    this.app.get('/', (req, res) => res.json({status: 200}));
  }

  setErrorHandlers() {
    /**
     * 404 pages.
     */
    this.app.use((req, res) => {
      const message = Boom.notFound('Not found');
      res.status(404).json(message.output.payload);
    });

    /* Handle errors */
    this.app.use(function(err, req, res, next) {
      if (err) {
        logger.error(err);
        const {
          statusCode,
          payload
        } = err.isBoom ? err.output : Boom.wrap(err).output;

        return res
          .status(statusCode)
          .json(Object.assign({}, payload, {payload: err.data}));
      }

      const {
        statusCode, payload
      } = Boom.badImplementation('Server error').output;
      res.status(statusCode).json(payload);
    });
   }

   listen() {
    logger.info(`Starting HTTP server. port=${this.port}`);
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (error) => {
        if (error) return reject(error);

        logger.info(`Server started`);
        resolve();
      });
    });
  }
}

module.exports = new Server();
