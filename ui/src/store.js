import { composeWithDevTools } from "redux-devtools-extension";
import authReducer from "./reducers/authReducer";
import errorReducer from "./reducers/errorReducer";
import editUserReducer from "./reducers/editUserReducer";
import userListReducer from "./reducers/userListReducer";

import thunk from "redux-thunk";
import { createStore, applyMiddleware, combineReducers } from "redux";

const rootReducer = combineReducers({
  authContext: authReducer,
  userList: userListReducer,
  error: errorReducer,
  editUser: editUserReducer,
});
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
export default store;
