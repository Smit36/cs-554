const { ObjectId } = require('mongodb');
const { clothes: getClothesCollection } = require('../config/mongoCollections');

const { QueryError, ValidationError } = require('../utils/errors');
const { idQuery, parseMongoData } = require('../utils/mongodb');
const {
  assertObjectIdString,
  assertIsValuedString,
  assertRequiredObject,
  assertRequiredNumber,
} = require('../utils/assertion');

const usersData = require('./user');
const { getGroup } = require('./group');

const {
  getAllClothesBasketLocations,
  setClothesBasketLocation,
  getClothesBasketLocation,
} = require('../utils/redis');

const getByObjectId = async (objectId) => {
  const collection = await getClothesCollection();
  let cloth = await collection.findOne(idQuery(objectId));
  return parseMongoData(cloth);
};

const getClothByGroupId = async ({ userId, groupId, skip, limit }) => {
  assertObjectIdString(userId, 'User Id');
  assertObjectIdString(groupId, 'Group Id');
  assertRequiredNumber(skip, 'Pagination Skip');
  assertRequiredNumber(limit, 'Pagination Limit');

  // We can only do this once we have group routes.
  const user = await usersData.getByObjectId(userId);
  if (!user) {
    throw new QueryError(`Could not get user for (${userId})`);
  }

  const group = await getGroup(groupId);
  if (!group) {
    throw new QueryError(`Could not get group for (${groupId})`);
  }

  const collection = await getClothesCollection();
  const data = await collection
    .find({ groupId: new ObjectId(groupId) })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip)
    .toArray();

  const total = await collection.find({ groupId: new ObjectId(groupId) }).count();

  if (data == null) {
    throw new QueryError(`Could not get cloth for (${groupId})`);
  }
  return { data: parseMongoData(data), skip, limit, total };
};

const getClothesByUserId = async ({ userId }) => {
  assertObjectIdString(userId, 'User Id');

  const user = await usersData.getByObjectId(userId);
  if (!user) {
    throw new QueryError(`Could not get user for (${userId})`);
  }

  const collection = await getClothesCollection();
  const data = await collection.find({ userId: new ObjectId(userId) }).toArray();

  if (data == null) {
    throw new QueryError(`Could not get cloth for (${userId})`);
  }

  return parseMongoData(data);
};

const getCloth = async (userId, id) => {
  assertObjectIdString(id, 'Cloth Id');
  assertObjectIdString(userId, 'User Id');

  const user = await usersData.getByObjectId(userId);
  if (!user) {
    throw new QueryError(`Could not get user for (${userId})`);
  }
  let cloth = await getByObjectId(id);
  if (cloth == null) {
    throw new QueryError(`Could not get cloth for (${id})`);
  }
  return cloth;
};

const addCloth = async (data) => {
  assertRequiredObject(data);
  const { userId, groupId, name, type, weight } = data;
  const createdAt = new Date().getTime();

  assertObjectIdString(userId, 'Cloth added by user ID');
  assertIsValuedString(name, 'Cloth name');
  assertIsValuedString(type, 'Cloth type');
  assertRequiredNumber(weight, 'Weight');
  assertIsValuedString(groupId, 'Group');

  const user = await usersData.getByObjectId(userId);
  if (!user) {
    throw new QueryError(`User not exist for user id (${userId})`);
  }

  const group = await getGroup(groupId);
  if (!group) {
    throw new QueryError(`Group not exist for group id (${userId})`);
  }

  data.clothId = new ObjectId().toHexString();

  const collection = await getClothesCollection();

  const clothData = {
    _id: new ObjectId(data.clothId),
    userId: new ObjectId(userId),
    groupId: new ObjectId(groupId),
    name,
    type,
    weight,
    createdAt,
    updatedAt: createdAt,
    createdBy: new ObjectId(userId),
    updatedBy: new ObjectId(userId),
  };
  const { result, insertedCount, insertedId } = await collection.insertOne(clothData);
  if (!result.ok || insertedCount !== 1) {
    throw new QueryError(`Could not add cloth for user ID(${userId})`);
  }

  return await getByObjectId(insertedId);
};

const getOwnedCloth = async (userId, clothId) => {
  const cloth = await getCloth(userId, clothId);
  if (cloth == null) {
    throw new ValidationError(`Cloth not found for cloth ID(${clothId})`);
  }

  if (cloth.userId !== userId) {
    throw new ValidationError(`Clothes does not belong to user`);
  }

  return cloth;
};

const updateCloth = async (clothId, data) => {
  assertRequiredObject(data);
  const { userId, groupId, name, type, weight } = data;
  assertObjectIdString(clothId, 'Cloth id');
  assertObjectIdString(userId, 'Cloth added by user ID');
  assertObjectIdString(groupId, 'Group id');
  assertIsValuedString(name, 'Cloth name');
  assertIsValuedString(type, 'Cloth type');
  assertRequiredNumber(weight, 'Weight');

  const group = await getGroup(groupId);
  if (!group) {
    throw new QueryError(`Could not get group for (${groupId})`);
  }

  const ownedCloth = await getOwnedCloth(userId, clothId);

  const newUpdate = {
    ...ownedCloth,
    userId: new ObjectId(userId),
    groupId: new ObjectId(groupId),
    name,
    type,
    weight,
    updatedAt: new Date().getTime(),
    updatedBy: new ObjectId(userId),
  };
  delete newUpdate['_id'];

  const collection = await getClothesCollection();
  const { modifiedCount, matchedCount } = await collection.updateOne(idQuery(clothId), {
    $set: newUpdate,
  });

  if (!modifiedCount && !matchedCount) {
    throw new QueryError(`Could not update cloth ID(${clothId})`);
  }
  return await getCloth(userId, clothId);
};

const deleteCloth = async (userId, id) => {
  assertObjectIdString(id, 'Cloth id');
  assertObjectIdString(userId, 'User Id');

  const ownedCloth = await getOwnedCloth(userId, id);

  const collection = await getClothesCollection();
  let { deletedCount } = await collection.deleteOne(idQuery(id));

  if (deletedCount === 0) {
    throw new QueryError(`Could not delete cloth for (${id})`);
  }
  return deleteCloth;
};

const deleteClothByGroupId = async (userId, groupId) => {
  assertObjectIdString(userId, 'User Id');
  assertObjectIdString(groupId, 'Group Id');

  const user = await usersData.getByObjectId(userId);
  if (!user) {
    throw new QueryError(`Could not get user for (${userId})`);
  }

  const group = await getGroup(groupId);
  if (!group) {
    throw new QueryError(`Could not get group for (${groupId})`);
  }
  const collection = await getClothesCollection();
  const { deletedCount } = await collection.deleteMany({
    userId: new ObjectId(userId),
    groupId: new ObjectId(groupId),
  });
  if (deletedCount === 0) {
    throw new QueryError(`Could not delete all clothes for (${userId})`);
  }
  const message = 'Successfully deleted all clothes.';
  return parseMongoData({ message });
};

const getClothesLocations = async () => {
  return await getAllClothesBasketLocations();
};

const setClothesLocation = async (clothes, basketId = '') => {
  await setClothesBasketLocation(clothes, basketId);
  return await getClothesLocations();
};

const clearClothesLocation = async (clothes) => {
  return await setClothesLocation(clothes, '');
};

const isClothesEditable = async (clothesId) => {
  return !(await getClothesBasketLocation(clothesId));
};

const isUserOperating = async (userId) => {
  assertObjectIdString(userId, 'User ID');
  const clothes = await getClothesByUserId({userId: userId});
  return (await Promise.all(clothes.map(({ _id }) => isClothesEditable(_id)))).some(
    (editable) => !editable
  );
};

module.exports = {
  getClothByGroupId,
  addCloth,
  getCloth,
  getClothesByUserId,
  updateCloth,
  deleteCloth,
  deleteClothByGroupId,
  getClothesLocations,
  setClothesLocation,
  clearClothesLocation,
  isClothesEditable,
  isUserOperating,
};
