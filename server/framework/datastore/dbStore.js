const config = require("../../config");
const typeorm = require("typeorm");

module.exports = class DBStore {
  connection = null;
  //  entity = null;
  entitySchema = null;
  //repository = null;

  constructor(entitySchema, connectionName = "default") {
    this.entitySchema = entitySchema;
    this.connectionName = connectionName;
  }
  static async createConnection() {
    if (!this.connection) {
      this.connection = await typeorm.createConnection({
        ...config.dbConnection,
        name: this.connectionName,
        entities: [this.entitySchema],
      });
    }
    return this.connection;
  }
  //this.repository = await this.connection.getRepository(this.entity);
};
