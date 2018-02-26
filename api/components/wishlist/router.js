const PromiseRouter = require('express-router-wrapper');
const router = new PromiseRouter();
const Controller = require('./controller');
const {fieldPreconditions} = require('./model');

const Joi = require('joi');
const Boom = require('boom');

router
  .get('/', () => Controller.get());

router
  .get('/search', ({query}) => Controller.search(query.keyword));

router
  .get('/:id', ({params}) => Controller.getOne(params.id));

router
  .post('/', ({body}) => {
    const schema = Joi.object().keys(fieldPreconditions);

    const {error, value} = Joi.validate(body, schema);

    if (error) {
      throw Boom.badRequest(error.message);
    }

    return Controller.create(value);
  });

router
  .delete('/:id', ({params}) => Controller.delete(params.id));


module.exports = router.getOriginal();
