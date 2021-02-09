const httpContext = require("express-http-context");
const jwt = require("jsonwebtoken");

const AuthenticationError = require("../framework/errors/authenticationError");
const { logger, utils, errorMessages } = require("../framework/framework");

const UserService = require("../services/user/userService");
const config = require("../config");
/**
 * Middleware validates Auth token ( refers headers.authorization)
 * When valid builds http-context to share across app
 * When invalid ( either invalid toke or expired token or logged out token) throws Authentication Exception
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */

module.exports = function (req, res, next) {
  //Authorization: `Bearer ${appJWTToken}`
  if (!req.headers.authorization) {
    throw new AuthenticationError(errorMessages.authorizationHeaderMissing);
  }
  const token = utils.extractAuthToken(req); //token excluding bearer and trim any spaces
  try {
    var user = jwt.verify(token, config.authSecret);
  } catch (ex) {
    logger.error(ex);
    throw new AuthenticationError(errorMessages.accessTokenInvalid);
  }
  //verify if its expired token
  if (UserService.isLoggedOut(token)) throw new AuthenticationError(errorMessages.accessTokenInactivated);
  httpContext.set("userContext", {
    userId: user.userId,
    role: user.role,
    token,
  });
  next && next();
};
