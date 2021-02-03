var httpContext = require("express-http-context");
var { logger } = require("../framework/framework");

module.exports = function (req, res, next) {
  //TODO: read auth token
  httpContext.set("userContext", {
    userId: 1234,
    role: "u",
  });
  next && next();
};
