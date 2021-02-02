const DBConnectionManager = require("../framework/datastore/dbConnectionManager");

module.exports = class DBInitializer {
  async init() {
    //add different schema definition file here
    let entities = ["../services/timeSheet/datastore/schema/*.js"];
    const connectionManager = new DBConnectionManager(entities);
    await connectionManager.createConnection();
  }
};
