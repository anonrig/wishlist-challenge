const Wishlist = require('./model');
const Boom = require('boom');
const request = require('request-promise');

class Controller {
  constructor() {
    this.model = Wishlist;
  }

  async create(payload) {
    await this.model.create(payload);

    return {};
  }

  get(whereQuery = {}) {
    return this.model.findAll({where: whereQuery});
  }

  async getOne(id) {
    const wishlist = await this.model.findById(id);

    if (!wishlist) {
      throw Boom.notFound('Wishlist item not found');
    }

    return wishlist;
  }

  async delete(id) {
    const item = await this.model.findById(id);

    if (!item) {
      throw Boom.notFound('Wishlist item not found');
    }

    await item.destroy();

    return {};
  }

  async search(keyword) {
    const response = await request({
      method: 'GET',
      uri: `https://www.adidas.co.uk/api/suggestions/${keyword}`,
      json: true
    });

    if (!response.products || !response.products.length) {
      throw Boom.notFound('Product not found');
    }

    return response.products;
  }
}

module.exports = new Controller();
