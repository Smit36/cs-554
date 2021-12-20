import {
  getPaginatedBasket,
  getBasket,
  postBasket,
  putBasket,
  deleteBasket as deleteBasketRequest,
  patchBasketStatus,
  patchBasketClothes,
} from '../../api';
import { DEFAULT_PAGINATION_LIMIT } from '../../constants';
import { basketPaginationSelector, userSelector } from '../selectors';
import { basketActionTypes } from './actionTypes';
import { fetchClothesLocations } from './clothesLocation';

export const getBasketList = (options) => async (dispatch, getState) => {
  try {
    const { _id: userId, groupId } = userSelector(getState());
    const currentPagination = basketPaginationSelector(getState());
    if (currentPagination.loading) {
      return;
    }

    const nextPage =
      (options.page !== undefined ? options.page : currentPagination.page) || 0;
    const nextLimit =
      (options.limit !== undefined ? options.limit : currentPagination.limit) ||
      DEFAULT_PAGINATION_LIMIT;
    const apiOptions = {
      groupId,
      userId,
      page: nextPage,
      limit: nextLimit,
    };

    dispatch({
      type: basketActionTypes.fetchListStart,
      page: nextPage,
      limit: nextLimit,
    });
    const {
      data,
      limit = nextLimit,
      skip = nextPage * nextLimit,
      total,
    } = await getPaginatedBasket(apiOptions);
    dispatch({
      type: basketActionTypes.fetchListSuccess,
      data,
      limit,
      page: Math.floor(skip / limit),
      total,
    });
    return data;
  } catch (error) {
    dispatch({
      type: basketActionTypes.fetchListError,
      error,
    });
    throw error;
  }
};

export const getBasketDetail = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: basketActionTypes.fetchStart,
      id,
    });
    const { _id: userId, groupId } = userSelector(getState());
    const data = await getBasket(id, { userId, groupId });
    dispatch({
      type: basketActionTypes.fetchSuccess,
      id: data._id,
      data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: basketActionTypes.fetchError,
      id,
      error,
    });
    throw error;
  }
};

export const createBasket = (basketData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: basketActionTypes.createStart,
    });
    const { _id: userId, groupId } = userSelector(getState());
    const data = await postBasket({ ...basketData, userId, groupId });
    dispatch({
      type: basketActionTypes.createSuccess,
      id: data._id,
      data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: basketActionTypes.createError,
      error,
    });
    throw error;
  }
};

export const deleteBasket = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: basketActionTypes.deleteStart,
      id,
    });
    const { _id: userId, groupId } = userSelector(getState());
    const data = await deleteBasketRequest(id, { userId, groupId });
    dispatch({
      type: basketActionTypes.deleteSuccess,
      id,
      data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: basketActionTypes.deleteError,
      id,
      error,
    });
    throw error;
  }
};

export const updateBasket = (id, clothesData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: basketActionTypes.updateStart,
      id,
      data: clothesData,
    });
    const { _id: userId, groupId } = userSelector(getState());
    const data = await putBasket(id, { ...clothesData, userId, groupId });
    dispatch({
      type: basketActionTypes.updateSuccess,
      id,
      data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: basketActionTypes.updateError,
      id,
      error,
    });
    throw error;
  }
};

export const updateBasketStatus =
  (id, statusUpdate) => async (dispatch, getState) => {
    try {
      // const basket = getBasketDetailSelector(id)(getState());
      dispatch({
        type: basketActionTypes.updateStart,
        id,
      });
      const { _id: userId, groupId } = userSelector(getState());
      const data = await patchBasketStatus(id, {
        ...statusUpdate,
        userId,
        groupId,
      });
      dispatch({
        type: basketActionTypes.updateSuccess,
        id,
        data,
      });
      dispatch(fetchClothesLocations());
      return data;
    } catch (error) {
      dispatch({
        type: basketActionTypes.updateError,
        id,
        error,
      });
      throw error;
    }
  };

export const updateBasketClothes =
  (id, clothesIdList, isRemove = false) =>
  async (dispatch, getState) => {
    try {
      // const basket = getBasketDetailSelector(id)(getState());
      dispatch({
        type: basketActionTypes.updateStart,
        id,
      });

      const { _id: userId, groupId } = userSelector(getState());
      const data = await patchBasketClothes(id, {
        clothesIdList,
        remove: isRemove,
        userId,
        groupId,
      });
      dispatch({
        type: basketActionTypes.updateSuccess,
        id,
        data,
      });
      return data;
    } catch (error) {
      dispatch({
        type: basketActionTypes.updateError,
        id,
        error,
      });
      throw error;
    }
  };
