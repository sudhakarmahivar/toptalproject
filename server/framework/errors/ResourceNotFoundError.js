const errorCodes = require("./errorCodes");
const ServiceError = require("./serviceError");

/**
 * Base class for all service error
 */
class ResourceNotFoundError extends ServiceError {
  constructor(error = "Requested resource not found") {
    super(errorCodes.resourceNotFoundError, error);
  }
}
module.exports = ResourceNotFoundError;
