/**
 * Base class for all service error
 */
class ServiceError {
  errorCode = null;
  message = null; //error object
  constructor(errorCode, message) {
    this.errorCode = errorCode;
    this.message = message;
  }
}
module.exports = ServiceError;
