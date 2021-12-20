import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from '../reducer';

const middlewares = [thunk];
if (process.env.NODE_ENV !== 'production') middlewares.push(logger);

const composeEnhancers =
  process.env.NODE_ENV === 'production'
    ? compose
    : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = () =>
  createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));

export default configureStore();
