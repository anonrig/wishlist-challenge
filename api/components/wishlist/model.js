const {instance, Sequelize} = require('../../lib/postgres');
const Joi = require('joi');


const Model = instance.define('Wishlist', {
  url: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false
  },
  suggestion: {
    type: Sequelize.TEXT,
    required: true,
    allowNull: false
  },
  rating: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false
  },
  reviews: {
    type: Sequelize.STRING,
    required: true
  },
  subTitle: {
    type: Sequelize.STRING,
    required: true,
    allowNull: false
  },
  isPreorder: {
    type: Sequelize.STRING,
    required: true
  },
  salePrice: {
    type: Sequelize.FLOAT,
    required: true,
    allowNull: true,
    default: 0
  },
  standardPrice: {
    type: Sequelize.FLOAT,
    required: true,
    allowNull: false
  }
}, {
  paranoid: true,
  timestamps: true
});

Model.fieldPreconditions = {
  url: Joi.string().max(255).required(),
  image: Joi.string().max(255).required(),
  suggestion: Joi.string().required(),
  rating: Joi.string().max(255).required(),
  reviews: Joi.optional(),
  subTitle: Joi.string().max(255).required(),
  isPreorder: Joi.optional(),
  salePrice: Joi.optional(),
  standardPrice: Joi.number().required()
};

module.exports = Model;
