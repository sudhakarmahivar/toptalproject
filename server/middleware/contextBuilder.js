var httpContext = require("express-http-context");
const AuthenticationError = require("../framework/errors/authenticationError");
var { logger } = require("../framework/framework");

module.exports = function (req, res, next) {
  //TODO: read auth token
  if (!req.headers.accesstoken) {
    throw new AuthenticationError();
  }
  httpContext.set("userContext", {
    userId: (req.headers || {}).accesstoken,
    role: "u",
  });
  next && next();
};
