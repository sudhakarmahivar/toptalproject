const config = require("../../config");
const typeorm = require("typeorm");
/**
 * Common db connection class.
 */
module.exports = class DBConnectionManager {
  entities = [];
  constructor(entities) {
    this.entities = entities;
  }
  async createConnection() {
    await typeorm.createConnection({
      ...config.dbConnection,
      entities: this.entities,
    });
  }
  static getRepository(entity) {
    return typeorm.getConnection().getRepository(entity);
  }
};
