import store from "../store";
/**
 * Helper method to get user context in non react functions
 * Retrieves user context from store
 */
function getUserContext() {
  return store.getState().authContext || {};
}
function getAccessToken() {
  return getUserContext().accessToken;
}
export { getUserContext, getAccessToken };
