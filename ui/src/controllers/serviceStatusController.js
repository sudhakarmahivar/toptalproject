import actionTypes from "../actionTypes";
function clearError() {
  return { type: actionTypes.serviceStatus.clearError };
}
function clearSuccess() {
  return { type: actionTypes.serviceStatus.clearSuccess };
}
function clearAll() {
  return { type: actionTypes.serviceStatus.clearAll };
}
export { clearError, clearSuccess, clearAll };
