function apiError(message, errorCode) {
  this.errorCode = errorCode || "";
  this.message = message || "";
  this.toString = function () {
    return this.errorCode + this.message;
  };
}
export default apiError;
