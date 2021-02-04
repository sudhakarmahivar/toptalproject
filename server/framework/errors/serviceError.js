/**
 * Base class for all service error
 */
class ServiceError {
  errorCode = null;
  error = null; //error object
  constructor(errorCode, error) {
    this.errorCode = errorCode;
    this.error = error;
  }
}
module.exports = ServiceError;
