import {
  getDeleteClothesPath,
  getDeleteBasketPath,
  GET_PAGINATED_CLOTHES,
  GET_PAGINATED_BASKETS,
  POST_CLOTHES,
  POST_BASKET,
  getPutClothesPath,
  getPutBasketPath,
  getPatchBasketStatusPath,
  getPatchBasketClothesPath,
  SUBSCRIBE_GROUP_TOPIC,
  UNSUBSCRIBE_GROUP_TOPIC,
  GET_CLOTHES_BASKET_LOCATIONS,
  PATCH_CLOTHES_BASKET_LOCATIONS,
  getBasketPath,
  getClothesPath,
} from './endpoints';
import {
  axiosDelete,
  axiosGet,
  axiosPost,
  axiosPut,
  axiosPatch,
} from './utils';
import { DEFAULT_PAGINATION_LIMIT } from '../constants';
// import testClothes from './test-data/clothes.json';

// let tempClothes = [...testClothes];

// const delay = (data, time = 500) =>
//   new Promise((resolve) => setTimeout(() => resolve(data), time));
export const getPaginatedClothes = (options) => {
  const { page = 0, limit = DEFAULT_PAGINATION_LIMIT, groupId, userId } = options;
  const skip = page * limit;
  // const testResult = {
  //   data: tempClothes.slice(start, start + limit),
  //   page,
  //   limit,
  //   total: tempClothes.length,
  // };
  // return delay(testResult);
  return axiosGet(GET_PAGINATED_CLOTHES, { params: { skip, limit, groupId, userId } });
};

export const postClothes = (data) => {
  // tempClothes.unshift(newClothes);
  // return delay({
  //   data: newClothes,
  // });
  return axiosPost(POST_CLOTHES, data);
};

export const putClothes = (id, data) => {
  // let updatingClothes = null;
  // let i = 0;
  // while (i < tempClothes.length && tempClothes[i].id !== id) {
  //   i++;
  // }
  // if (i < tempClothes.length) {
  //   updatingClothes = {
  //     ...tempClothes[i],
  //     ...data,
  //   };
  //   tempClothes[i] = updatingClothes;
  // }
  // return delay({
  //   data: updatingClothes,
  // });
  return axiosPut(getPutClothesPath(id), data);
};

export const deleteClothes = (id, { userId, groupId }) => {
  // let deletedClothes = null;
  // let i = 0;
  // while (i < tempClothes.length && tempClothes[i].id !== id) {
  //   i++;
  // }
  // if (i < tempClothes.length) {
  //   deletedClothes = tempClothes[i];
  //   tempClothes.splice(i, 1);
  // }
  // return delay({
  //   data: deletedClothes,
  // });
  return axiosDelete(getDeleteClothesPath(id), { userId, groupId });
};

export const getClothes = (id, { userId, groupId }) => {
  // let data = null;
  // let i = 0;
  // while (i < tempClothes.length && tempClothes[i].id !== id) {
  //   i++;
  // }
  // if (i < tempClothes.length) {
  //   data = tempClothes[i];
  // }
  // return delay({ data });
  return axiosGet(getClothesPath(id), { params: { userId, groupId }});
};

export const getPaginatedBasket = (options) => {
  const { page = 0, limit = DEFAULT_PAGINATION_LIMIT, groupId, userId } = options;
  const skip = page * limit;
  return axiosGet(GET_PAGINATED_BASKETS, { params: { skip, limit, groupId, userId } });
};

export const getBasket = (id, { userId, groupId }) => {
  return axiosGet(getBasketPath(id), { params: { userId, groupId }});
};

export const postBasket = (data) => {
  return axiosPost(POST_BASKET, data);
};

export const putBasket = (id, data) => {
  return axiosPut(getPutBasketPath(id), data);
};
export const patchBasketStatus = (id, data) => {
  return axiosPatch(getPatchBasketStatusPath(id), data);
};
export const patchBasketClothes = (id, data) => {
  return axiosPatch(getPatchBasketClothesPath(id), data);
};
export const deleteBasket = (id, { userId, groupId }) => {
  return axiosDelete(getDeleteBasketPath(id), { userId, groupId });
};

export const subscribeGroupTopic = ({ groupId, token }) => {
  return axiosPost(SUBSCRIBE_GROUP_TOPIC, { groupId, token });
};

export const unsubscribeGroupTopic = ({ groupId, token }) => {
  return axiosPost(UNSUBSCRIBE_GROUP_TOPIC, { groupId, token });
};

export const getClothesBasketLocations = ({ userId, groupId }) => {
  return axiosGet(GET_CLOTHES_BASKET_LOCATIONS, { userId, groupId });
};

export const patchClothesBasketLocations = (data) => {
  return axiosPatch(PATCH_CLOTHES_BASKET_LOCATIONS, data);
};
