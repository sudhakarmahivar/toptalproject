const DBConnectionManager = require("../framework/datastore/dbConnectionManager");
/**
 * Establishes DB Connection and registers all entity schemas with connection manager
 * Invoked only once during app start,so connection shared across requests
 *
 */
module.exports = class DBInitializer {
  async init() {
    //add different schema definition file here
    let entities = ["services/timeSheet/datastore/schema/*.js", "services/user/datastore/schema/*.js"];
    const connectionManager = new DBConnectionManager(entities);
    await connectionManager.createConnection();
  }
};
