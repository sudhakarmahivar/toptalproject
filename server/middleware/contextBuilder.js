var httpContext = require("express-http-context");
const AuthenticationError = require("../framework/errors/authenticationError");
var { logger, utils } = require("../framework/framework");
var jwt = require("jsonwebtoken");
const config = require("../config");
var UserService = require("../services/user/userService");
module.exports = function (req, res, next) {
  //Authorization: `Bearer ${appJWTToken}`
  if (!req.headers.authorization) {
    throw new AuthenticationError("Authorization header missing");
  }
  const token = utils.extractAuthToken(req); //token excluding bearer and trim any spaces
  try {
    var user = jwt.verify(token, config.authSecret);
  } catch (ex) {
    logger.error(ex);
    throw new AuthenticationError("Access token invalid");
  }
  //verify if its expired token
  if (UserService.isLoggedOut(token)) throw new AuthenticationError("Access token inactivated");
  httpContext.set("userContext", {
    userId: user.userId,
    role: user.role,
    token,
  });
  next && next();
};
