import { applyMiddleware, compose, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import { schoolSelection, entities, login, modal, userregistration, programs, assessments, passwordreset, users, boundaries} from './reducers';
import promiseMiddleware from 'redux-promise-middleware';

const reducer = combineReducers({
  schoolSelection,
  entities,
  login,
  routing: routerReducer,
  modal,
  userregistration,
  users,
  programs,
  assessments,
  passwordreset,
  boundaries
});

const middleware = compose(
  applyMiddleware(thunk),
  applyMiddleware(promiseMiddleware()),
  applyMiddleware(routerMiddleware(browserHistory)),
  window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

export default middleware(reducer);
