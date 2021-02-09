const errorCodes = require("./errorCodes");
const ServiceError = require("./serviceError");

/**
 * Thrown when specified resource ( e.g user, timesheet) is not available
 */
class ResourceNotFoundError extends ServiceError {
  constructor(error = "Requested resource not found") {
    super(errorCodes.resourceNotFoundError, error);
  }
}
module.exports = ResourceNotFoundError;
