var httpContext = require("express-http-context");
const AuthenticationError = require("../framework/errors/authenticationError");
var { logger } = require("../framework/framework");

module.exports = function (req, res, next) {
  //TODO: read auth token
  if (!req.headers.accesstoken) {
    throw new AuthenticationError();
  }
  const userId = (req.headers || {}).accesstoken;

  httpContext.set("userContext", {
    userId: Number(userId.replace(/\D/g, "")),
    role: userId[0],
  });
  next && next();
};
