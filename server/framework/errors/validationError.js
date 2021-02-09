const errorCodes = require("./errorCodes");
const ServiceError = require("./serviceError");

class ValidationError extends ServiceError {
  constructor(error = "Validation failed") {
    super(errorCodes.validationError, error);
  }
}
module.exports = ValidationError;
