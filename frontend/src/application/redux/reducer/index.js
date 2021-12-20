import { combineReducers } from 'redux';
import { clothesActionTypes, basketActionTypes } from '../actions/actionTypes';
import { getDataReducer } from './utils';

import clothesLocation from './clothesLocation';
import user from './user';

export default combineReducers({
  clothes: getDataReducer({ actionTypes: clothesActionTypes }),
  basket: getDataReducer({ actionTypes: basketActionTypes }),
  clothesLocation,
  user,
});
