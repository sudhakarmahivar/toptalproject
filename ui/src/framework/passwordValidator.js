import passwordValidator from "password-validator";

export default function validatePassword(password) {
  const schema = new passwordValidator();
  schema
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(12) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .digits() // Must have at least 2 digits
    .has()
    .not()
    .spaces()
    .has()
    .symbols();

  return schema.validate(password)
    ? null
    : "Password should be 8-25 chars length and should contain Upper case letter, number and digit";
}
