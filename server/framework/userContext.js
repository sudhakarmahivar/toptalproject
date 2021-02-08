/**
 * Responsible for sharing usercontext in all layers of the application
 * Utilizes http-context library to share the context. Can be replaced with different implementations
 *
 */
var httpContext = require("express-http-context");

class UserContext {
  static get() {
    return httpContext.get("userContext") || { userId: null, role: null, token: null }; //empty object when not set ( as in test runs)
  }
}
module.exports = UserContext;
