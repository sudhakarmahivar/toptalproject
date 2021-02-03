/**
 * Responsible for sharing usercontext in all layers of the application
 * Utilizes http-context library to share the context. Can be replaced with different implementations
 *
 */
var httpContext = require("express-http-context");

class UserContext {
  static get() {
    return httpContext.get("userContext");
  }
}
module.exports = UserContext;
