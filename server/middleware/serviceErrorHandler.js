var { logger } = require("../framework/framework");
const ServiceError = require("../framework/errors/serviceError");
const ResourceNotFoundError = require("../framework/errors/ResourceNotFoundError");
const ValidationError = require("../framework/errors/validationError");
const AuthenticationError = require("../framework/errors/authenticationError");
/**
 * Handles exception centrally
 * Based on exception object, translates to right REST codes.
 * E.g ResourceNotFound would result in 404 error code
 * For unknown exceptions sends out 500 response code
 * In all scenarios, attaches err object in response
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = function (err, req, res, next) {
  const statusCodeMap = [
    {
      errorClass: AuthenticationError,
      status: 401,
    },
    {
      errorClass: ValidationError,
      status: 400,
    },
    {
      errorClass: ResourceNotFoundError,
      status: 404,
    },
    {
      errorClass: ServiceError,
      status: 500,
    },
  ];
  const match = statusCodeMap.find((scm) => {
    return err instanceof scm.errorClass;
  });
  logger.error(err);
  if (match) {
    res.status(match.status).send(err);
  }
  //should be unhabled exception
  else {
    logger.error("Detected error other than ServiceError/derivative");
    res.status(500).send("Sevice exception occurred");
  }
};
