var { logger } = require("../framework/framework");
const ServiceError = require("../framework/errors/serviceError");
const ResourceNotFoundError = require("../framework/errors/ResourceNotFoundError");
const ValidationError = require("../framework/errors/validationError");
const AuthenticationError = require("../framework/errors/authenticationError");
const AuthorizationError = require("../framework/errors/authorizationError");

const { authorizationError } = require("../framework/errors/errorMessages");
module.exports = function (err, req, res, next) {
  if (err instanceof AuthenticationError) {
    logger.error(err);
    logger.error("Detected auth errors");
    res.status(401).send(err);
  } else if (err instanceof ValidationError) {
    logger.error(err);
    res.status(400).send(err);
  } else if (err instanceof ResourceNotFoundError) {
    logger.error(err);
    res.status(404).send(err);
  } else if (err instanceof ServiceError) {
    logger.error("Detected general service errors");

    logger.error(err);
    res.status(500).send(err);
  }
  //not a custom error
  else next(err);
};
