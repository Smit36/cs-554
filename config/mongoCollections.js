const { getCollection } = require('./mongoConnection');

const USER_COLLECTION_NAME = 'users';
const CLOTH_COLLECTION_NAME = 'clothes';
const BASKET_COLLECTION_NAME = 'baskets';
const GROUP_COLLECTION_NAME = "groups";

module.exports = {
  users: () => getCollection(USER_COLLECTION_NAME),
  clothes: () => getCollection(CLOTH_COLLECTION_NAME),
  baskets: () => getCollection(BASKET_COLLECTION_NAME),
  groups: () => getCollection(GROUP_COLLECTION_NAME)
};
