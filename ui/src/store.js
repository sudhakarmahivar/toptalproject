import { composeWithDevTools } from "redux-devtools-extension";
import authReducer from "./reducers/authReducer";
import editUserReducer from "./reducers/editUserReducer";
import userListReducer from "./reducers/userListReducer";
import timeSheetListReducer from "./reducers/timeSheetListReducer";

import thunk from "redux-thunk";
import { createStore, applyMiddleware, combineReducers } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import serviceStatusReducer from "./reducers/serviceStatusReducer";
export const history = createBrowserHistory();

const rootReducer = combineReducers({
  authContext: authReducer,
  userList: userListReducer,
  serviceStatus: serviceStatusReducer,
  editUser: editUserReducer,
  timeSheetList: timeSheetListReducer,
  router: connectRouter(history),
});
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)));
export default store;
