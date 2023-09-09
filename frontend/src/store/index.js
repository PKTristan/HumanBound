import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import userReducer from "./user";
import booksReducer from "./book";
import approvalsReducer from "./approval";
import reviewsReducer from "./review";
import repliesReducer from "./reply";
import circlesReducer from "./circle";
import messagesReducer from "./reply";
import memberReducer from "./member";

const rootReducer = combineReducers({
  // add reducer functions here
  user: userReducer,
  book: booksReducer,
  approval: approvalsReducer,
  review: reviewsReducer,
  reply: repliesReducer,
  circle: circlesReducer,
  message: messagesReducer,
  member: memberReducer
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
