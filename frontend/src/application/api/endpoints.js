export const BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3001/api';

export const GET_PAGINATED_CLOTHES = '/clothes';
export const POST_CLOTHES = '/clothes';

export const getPutClothesPath = (id) => `/clothes/${id}`;
export const getDeleteClothesPath = (id) => `/clothes/${id}`;
export const getClothesPath = (id) => `/clothes/${id}`;

export const GET_PAGINATED_BASKETS = '/baskets';
export const POST_BASKET = '/baskets';

export const getBasketPath = (id) => `/baskets/${id}`;
export const getPutBasketPath = (id) => `/baskets/${id}`;
export const getPatchBasketStatusPath = (id) => `/baskets/${id}/status`;
export const getPatchBasketClothesPath = (id) => `/baskets/${id}/clothes`;
export const getDeleteBasketPath = (id) => `/baskets/${id}`;

export const SUBSCRIBE_GROUP_TOPIC = '/messaging/subscribe';
export const UNSUBSCRIBE_GROUP_TOPIC = '/messaging/unsubscribe';

export const GET_CLOTHES_BASKET_LOCATIONS = '/clothes/locations';
export const PATCH_CLOTHES_BASKET_LOCATIONS = '/clothes/locations';
