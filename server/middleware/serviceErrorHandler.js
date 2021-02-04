var { logger } = require("../framework/framework");
const serviceError = require("../framework/errors/serviceError");
const ResourceNotFoundError = require("../framework/errors/ResourceNotFoundError");
module.exports = function (err, req, res, next) {
  if (err instanceof ResourceNotFoundError) {
    logger.error(err);
    res.status(404).send(err);
  } else if (err instanceof serviceError) {
    logger.error(err);
    res.status(500).send(err);
  } else next(err);
};
