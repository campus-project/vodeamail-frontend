import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { auth } from "./reducers/auth.reducer";
import { sidebar } from "./reducers/sidebar.reducer";
import { menu } from "./reducers/menu.reducer";
import { preference } from "./reducers/preference.reducer";
import { formatter } from "./reducers/formatter.reducer";

const enhancer = compose(applyMiddleware(thunk));

export const store = createStore(
  combineReducers({
    auth,
    sidebar,
    menu,
    preference,
    formatter,
  }),
  enhancer
);
