const moment = require("moment");
const Model = require("../../../framework/datastore/model");
const { utils, errorMessages } = require("../../../framework/framework");
const ValidationError = require("../../../framework/errors/validationError");

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - userName
 *        properties:
 *          userName:
 *            type: string
 *            description: Your loginid.
 *          name:
 *            type: string
 *          role:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user.
 *          workingHoursPerDay:
 *            type: number
 *            descriptoin: Less than or equal to 24
 *        example:
 *           name: Hello User
 *           userName: helloUser
 *           email: fake@email.com
 *           workingHoursPerDay: 6.5
 *           role: u
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
