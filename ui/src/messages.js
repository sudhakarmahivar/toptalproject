const messages = {
  systemExceptionOccurred: "System exception occurred",
  timeSheetSavedSuccessfully: "Timesheet Saved successfully",
  userSavedSuccessfully: "User saved successfully",
  userDeletedSuccessfully: "User deleted successfully",
  userRegisteredSuccessfully: "User registered successfully. Login to continue",

  passwordSchemaError: "Password should be 8-25 chars length and should contain Upper case letter, number and digit",
  passwordMismatch: "Password mismatch", //on user registration

  userNameError: "User name should be 8-25 characters in length and only alphanumeric",
  nameError: "Name is required and should have only alphabets and spaces",
  emailError: "Provide valid email",

  //timesheet
  activityMissingHours: "One or more activities have missing hours",
  activityMissingName: "One or more rows missing activity name",
  totalHoursExceed24: "Total hours recorded cant exceed 24 hours",
};
//instructions. reuse the same error messages. If different provide the same
messages.userNameInstruction = messages.userNameError;
messages.passwordInstruction = messages.passwordSchemaError;

export default messages;
