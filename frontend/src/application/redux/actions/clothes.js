import {
  getPaginatedClothes,
  getClothes,
  postClothes,
  putClothes,
  deleteClothes as deleteClothesRequest,
} from '../../api';
import { DEFAULT_PAGINATION_LIMIT } from '../../constants';
import { clothesPaginationSelector, userSelector } from '../selectors';
import { clothesActionTypes } from './actionTypes';

export const getClothesList = (options) => async (dispatch, getState) => {
  try {
    const { _id: userId, groupId } = userSelector(getState());
    const currentPagination = clothesPaginationSelector(getState());
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
      type: clothesActionTypes.fetchListStart,
      page: nextPage,
      limit: nextLimit,
    });
    const {
      data,
      limit = nextLimit,
      skip = nextPage * nextLimit,
      total,
    } = await getPaginatedClothes(apiOptions);
    dispatch({
      type: clothesActionTypes.fetchListSuccess,
      data,
      limit,
      page: Math.floor(skip / limit),
      total,
    });
    return data;
  } catch (error) {
    dispatch({
      type: clothesActionTypes.fetchListError,
      error,
    });
    throw error;
  }
};

export const getClothesDetail = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: clothesActionTypes.fetchStart,
      id,
    });
    const { _id: userId, groupId } = userSelector(getState());
    const data = await getClothes(id, { userId, groupId });
    dispatch({
      type: clothesActionTypes.fetchSuccess,
      data,
      id,
    });
    return data;
  } catch (error) {
    dispatch({
      type: clothesActionTypes.fetchError,
      id,
      error,
    });
    throw error;
  }
};

export const createClothes = (clothesData) => async (dispatch, getState) => {
  try {
    dispatch({
      type: clothesActionTypes.createStart,
    });
    const { _id: userId, groupId } = userSelector(getState());
    const data = await postClothes({ ...clothesData, userId, groupId });
    dispatch({
      type: clothesActionTypes.createSuccess,
      id: data._id,
      data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: clothesActionTypes.createError,
      error,
    });
    throw error;
  }
};

export const deleteClothes = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: clothesActionTypes.deleteStart,
      id,
    });
    const { _id: userId, groupId } = userSelector(getState());
    const data = await deleteClothesRequest(id, { userId, groupId });
    dispatch({
      type: clothesActionTypes.deleteSuccess,
      id,
      data,
    });
    return data;
  } catch (error) {
    dispatch({
      type: clothesActionTypes.deleteError,
      id,
      error,
    });
    throw error;
  }
};

export const updateClothes =
  (id, clothesData) => async (dispatch, getState) => {
    try {
      dispatch({
        type: clothesActionTypes.updateStart,
        id,
        data: clothesData,
      });
      const { _id: userId, groupId } = userSelector(getState());
      const data = await putClothes(id, { ...clothesData, userId, groupId });
      dispatch({
        type: clothesActionTypes.updateSuccess,
        id,
        data,
      });
      return data;
    } catch (error) {
      dispatch({
        type: clothesActionTypes.updateError,
        id,
        error,
      });
      throw error;
    }
  };
