import passwordValidator from "password-validator";
import messages from "../messages";
/**
 * Validates password adheres to rules
 * @param {string} password password in plain text
 */
export default function validatePassword(password) {
  const schema = new passwordValidator();
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(25) // Maximum length 25
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .digits() // Must have at least 1 digit
    .has()
    .not()
    .spaces()
    .has()
    .symbols(); //has special character

  return schema.validate(password) ? null : messages.passwordSchemaError;
}
