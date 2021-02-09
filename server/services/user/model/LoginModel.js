const moment = require("moment");
const Model = require("../../../framework/datastore/model");
const { utils, errorMessages } = require("../../../framework/framework");
const ValidationError = require("../../../framework/errors/validationError");

/**
 * @swagger
 *  components:
 *    schemas:
 *      Login:
 *        type: object
 *        required:
 *          - name
 *          - password
 *        properties:
 *          userName:
 *            type: string
 *            description: Your loginid.
 *          password:
 *            type: string
 *            description: Plain text password
 *          example:
 *           userName: helloUser
 *           password: mySecretPassword
 */
module.exports = class UserModel extends (
  Model
) {
  userId;
  userName;
  role;
  password;
  name;
  workingHoursPerDay;
};
