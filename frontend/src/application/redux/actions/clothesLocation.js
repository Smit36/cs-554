import {
  getClothesBasketLocations,
  patchClothesBasketLocations,
} from '../../api';
import { userSelector } from '../selectors';

import { clothesLocationActionTypes } from './actionTypes';

export const fetchClothesLocations = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: clothesLocationActionTypes.fetchStart,
    });
    const { _id: userId, groupId } = userSelector(getState());
    const data = await getClothesBasketLocations({ userId, groupId });
    dispatch({
      type: clothesLocationActionTypes.fetchSuccess,
      data,
    });
  } catch (error) {
    dispatch({
      type: clothesLocationActionTypes.fetchError,
      error,
    });
  }
};

export const removeClothesFromBaskets =
  (clothesIdList) => async (dispatch, getState) => {
    try {
      dispatch({
        type: clothesLocationActionTypes.fetchStart,
      });
      const { _id: userId, groupId } = userSelector(getState());
      const data = await patchClothesBasketLocations({
        clothesIdList,
        basketId: '',
        userId,
        groupId,
      });
      dispatch({
        type: clothesLocationActionTypes.fetchSuccess,
        data,
      });
    } catch (error) {
      dispatch({
        type: clothesLocationActionTypes.fetchError,
        error,
      });
    }
  };
