const DBEntitySchema = require("../../../../framework/datastore/dbEntitySchema");
const UserModel = require("../../model/userModel");

module.exports = new DBEntitySchema({
  name: "User",
  target: UserModel,
  tableName: "User",
  columns: {
    userId: {
      primary: true,
      type: "int",
      generated: true,
      unsigned: true,
    },
    userName: { type: "varchar" },
    role: { type: "varchar" }, //TODO: check other compact format
    password: { type: "varchar" },
    name: { type: "varchar" },
    email: { type: "varchar" },
    workingHoursPerDay: { type: "float" },
  },
});
