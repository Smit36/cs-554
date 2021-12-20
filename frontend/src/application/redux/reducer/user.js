import { userActionTypes } from '../actions/actionTypes';

const user = (state = {}, action) => {
  switch (action.type) {
    case userActionTypes.SET_USER: {
      return {
        ...action.data,
      };
    }
    default:
      return state;
  }
};

export default user;
