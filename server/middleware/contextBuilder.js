var httpContext = require("express-http-context");
const AuthenticationError = require("../framework/errors/authenticationError");
var { logger } = require("../framework/framework");
var jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = function (req, res, next) {
  //Authorization: `Bearer ${appJWTToken}`
  if (!req.headers.authorization) {
    throw new AuthenticationError("Authorization header missing");
  }
  try {
    const token = req.headers.authorization.replace(/^bearer/gi, "").replace(" ", ""); //token excluding bearer and trim any spaces
    var user = jwt.verify(token, config.authSecret);

    logger.debug(user);
  } catch (ex) {
    logger.error(ex);
    throw new AuthenticationError("Access token invalid");
  }
  httpContext.set("userContext", {
    userId: user.userId,
    role: user.role,
  });
  next && next();
};
