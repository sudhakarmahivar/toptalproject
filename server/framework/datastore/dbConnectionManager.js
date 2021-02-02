const config = require("../../config");
const typeorm = require("typeorm");

module.exports = class DBConnectionManager {
  //  entity = null;
  entities = [];
  //repository = null;

  constructor(entities) {
    this.entities = entities;
  }
  async createConnection() {
    await typeorm.createConnection({
      ...config.dbConnection,
      entities: this.entities,
    });
  }
  getRepository(entity) {
    return typeorm.getConnection().getRepository(entity);
  }
};
