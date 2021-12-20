import { clothesLocationActionTypes } from '../actions/actionTypes';

const clothesLocationInit = {
  loading: false,
  error: null,
  data: {},
};

const clothesLocation = (state = clothesLocationInit, action) => {
  switch (action.type) {
    case clothesLocationActionTypes.fetchStart: {
      return {
        ...state,
        loading: true,
      };
    }
    case clothesLocationActionTypes.fetchSuccess: {
      return {
        ...state,
        error: null,
        loading: false,
        data: action.data,
      };
    }
    case clothesLocationActionTypes.fetchError: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    default:
      return state;
  }
};

export default clothesLocation;
