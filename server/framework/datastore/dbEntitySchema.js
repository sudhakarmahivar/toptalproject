const EntitySchema = require("typeorm").EntitySchema;

module.exports = class DBEntitySchema {
  constructor(schema) {
    Object.assign(schema.columns, {
      createdDate: {
        type: "datetime",
        createDate: true,
      },
      createdBy: {
        type: "varchar",
      },
      updatedDate: {
        type: "datetime",
        updateDate: true,
      },
      updatedBy: {
        type: "varchar",
      },
      deleted: {
        type: "bool",
        default: false,
      },
    });
    return new EntitySchema(schema);
  }
};
