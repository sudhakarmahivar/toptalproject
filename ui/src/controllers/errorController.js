import actionTypes from "../actionTypes";
function clearError() {
  return { type: actionTypes.error.clearError };
}
export { clearError };
