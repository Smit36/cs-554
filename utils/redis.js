const redis = require('redis');

const client = redis.createClient({ url: process.env.REDIS_URL });
const prepareClient = async () => {
  try {
    if (!client.isOpen) await client.connect();
  } catch (error) {
    console.error(error);
  }
};

const CLOTHES_BASKET_LOCATION_KEY = 'clothes_basket_location';

const getClothesBasketLocation = async (clothes) => {
  const clothesIdList = Array.isArray(clothes) ? clothes : [clothes];
  try {
    await prepareClient();
    const basketIdList = await Promise.all(
      clothesIdList.map((id) => client.hGet(CLOTHES_BASKET_LOCATION_KEY, id)),
    );
    return Array.isArray(clothes) ? basketIdList : basketIdList[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const setClothesBasketLocation = async (clothes, basketId) => {
  const clothesIdList = Array.isArray(clothes) ? clothes : [clothes];
  try {
    await prepareClient();
    await Promise.all(
      basketId
        ? clothesIdList.map((id) => client.hSet(CLOTHES_BASKET_LOCATION_KEY, id, basketId))
        : clothesIdList.map((id) => client.hDel(CLOTHES_BASKET_LOCATION_KEY, id)),
    );
    return basketId;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllClothesBasketLocations = async () => {
  try {
    await prepareClient();
    return await client.hGetAll(CLOTHES_BASKET_LOCATION_KEY);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  client,
  prepareClient,
  getClothesBasketLocation,
  setClothesBasketLocation,
  getAllClothesBasketLocations,
};
