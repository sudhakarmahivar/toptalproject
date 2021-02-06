import { composeWithDevTools } from "redux-devtools-extension";
import authReducer from "./reducers/authReducer";
import errorReducer from "./reducers/errorReducer";
import editUserReducer from "./reducers/editUserReducer";
import userListReducer from "./reducers/userListReducer";
import registrationReducer from "./reducers/registrationReducer";

import thunk from "redux-thunk";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
export const history = createBrowserHistory();

const rootReducer = combineReducers({
  authContext: authReducer,
  userList: userListReducer,
  error: errorReducer,
  editUser: editUserReducer,
  registration: registrationReducer,
  router: connectRouter(history),
});
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)));
export default store;
