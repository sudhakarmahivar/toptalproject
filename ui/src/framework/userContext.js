import store from "../store";

function getUserContext() {
  return store.getState().authContext || {};
}
function getAccessToken() {
  return getUserContext().accessToken;
}
export { getUserContext, getAccessToken };
