import { userActionTypes } from "./actionTypes";

export const setUser = (data = {}) => ({
  type: userActionTypes.SET_USER,
  data,
});