const Sequelize = require('sequelize');
const logger = require('./logger');


class Postgres {
  constructor() {
    this.instance = new Sequelize(process.env.POSTGRES, {
      dialect: 'postgres',
      logging: null,
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      operatorsAliases: Sequelize.Op
    });

    this.Sequelize = Sequelize;
  }

  async init(force = true) {
    logger.info(`Connecting to postgres`);
    const response = await this.instance.sync({force});
    logger.info(`Connected to postgres`);
    return response;
  }
}


module.exports = new Postgres();
