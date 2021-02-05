import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";
import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
export default store;
