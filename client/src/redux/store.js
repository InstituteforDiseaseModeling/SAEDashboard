import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './reducers';
import apiMiddleware from './middlewares/api';
// import {createLogger} from 'redux-logger';

// const loggerMiddleware = createLogger();

/**
 * configure Store
 * @param {*} preloadedState
 * @return {*} new store
 */
export default function configureStore(preloadedState) {
  return createStore(
      rootReducer,
      preloadedState,
      compose(
          applyMiddleware(apiMiddleware /* , loggerMiddleware */ ),
          window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f)=>f,
      ),
  );
}
