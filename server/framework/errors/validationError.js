const errorCodes = require("./errorCodes");
const ServiceError = require("./serviceError");

/**
 * Base class for all service error
 */
class ValidationError extends ServiceError {
  constructor(error = "Validation failed") {
    super(errorCodes.validationError, error);
  }
}
module.exports = ValidationError;
