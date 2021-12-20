import { DEFAULT_PAGINATION_LIMIT } from "../../constants";

const paginationStateInit = {
  page: 0,
  limit: DEFAULT_PAGINATION_LIMIT,
  total: 0,
  loading: false,
  error: null,
};

const byIdInit = {
  data: null,
  error: null,
  loading: false,
};

const stateInit = {
  stateById: {},
  idListByPage: {},
  pagination: paginationStateInit,
};

export const getDataReducer = ({ actionTypes, key = '_id' }) => {
  const stateById = (state, action) => {
    switch (action.type) {
      case actionTypes.createStart: {
        return {
          ...state,
          _create: { ...(state._create || byIdInit), loading: true },
        };
      }
      case actionTypes.fetchStart:
      case actionTypes.updateStart:
      case actionTypes.deleteStart: {
        return {
          ...state,
          [action.id]: { ...(state[action.id] || byIdInit), loading: true },
        };
      }

      case actionTypes.createSuccess: {
        return {
          ...state,
          _create: { ...byIdInit },
          [action.id]: {
            loading: false,
            data: action.data,
            error: null,
          },
        };
      }
      case actionTypes.fetchSuccess:
      case actionTypes.updateSuccess: {
        return {
          ...state,
          [action.id]: {
            loading: false,
            data: action.data,
            error: null,
          },
        };
      }
      case actionTypes.deleteSuccess: {
        const newState = { ...state };
        delete newState[action.id];
        return newState;
      }
      case actionTypes.fetchListSuccess: {
        return action.data.reduce(
          (result, item) => {
            result[item[key]] = {
              loading: false,
              data: item,
              error: null,
            };
            return result;
          },
          { ...state }
        );
      }
      case actionTypes.createError: {
        return {
          ...state,
          _create: {
            loading: false,
            data: null,
            error: action.error,
          },
        };
      }
      case actionTypes.fetchError:{
        return {
          ...state,
          [action.id]: {
            loading: false,
            data: null,
            error: action.error,
          },
        };
      }
      case actionTypes.updateError:
      case actionTypes.deleteError: {
        return {
          ...state,
          [action.id]: {
            ...state[action.id],
            loading: false,
            error: action.error,
          },
        };
      }
      default:
        return state;
    }
  };

  return (state = stateInit, action) => {
    switch (action.type) {
      case actionTypes.createStart:
      case actionTypes.fetchStart:
      case actionTypes.updateStart:
      case actionTypes.deleteStart:
      case actionTypes.createError:
      case actionTypes.fetchError:
      case actionTypes.updateError:
      case actionTypes.deleteError:
      case actionTypes.createSuccess:
      case actionTypes.fetchSuccess:
      case actionTypes.updateSuccess:
      case actionTypes.deleteSuccess: {
        return {
          ...state,
          stateById: stateById(state.stateById, action),
        };
      }
      case actionTypes.fetchListStart: {
        return {
          ...state,
          pagination: {
            ...state.pagination,
            loading: true,
            page: action.page || 0,
            limit: action.limit || DEFAULT_PAGINATION_LIMIT,
          },
        };
      }
      case actionTypes.fetchListSuccess: {
        return {
          ...state,
          stateById: stateById(state.stateById, action),
          pagination: {
            ...state.pagination,
            loading: false,
            error: null,
            page: action.page,
            limit: action.limit,
            total: action.total,
          },
          idListByPage: {
            ...state.idListByPage,
            [state.pagination.page]: action.data.map((item) => item[key]),
          },
        };
      }
      case actionTypes.fetchListError: {
        return {
          ...state,
          pagination: {
            ...state.pagination,
            loading: false,
            error: action.error,
            total: null,
          },
          idListByPage: {
            ...state.idListByPage,
            [state.pagination.page]: [],
          },
        };
      }
      default:
        return state;
    }
  };
};
