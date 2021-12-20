const { users: getUserCollection } = require('../config/mongoCollections');

const { QueryError, ValidationError } = require('../utils/errors');
const { idQuery, parseMongoData } = require('../utils/mongodb');
const {
  assertIsValuedString,
  assertRequiredObject,
  assertEmailString,
  assertObjectIdString,
} = require('../utils/assertion');

const getByObjectId = async (objectId) => {
  const collection = await getUserCollection();
  const user = await collection.findOne(idQuery(objectId));
  return parseMongoData(user);
};

const getAllUsers = async () => {
  const collection = await getUserCollection();

  let userList = {};
  userList = await collection.find({}).toArray();
  console.log('userList: \n', userList);
  return parseMongoData(userList);
};

const getUser = async (uid) => {
  const collection = await getUserCollection();
  const user = await collection.findOne({ uid });
  return parseMongoData(user);
};

const getUserByEmail = async (email) => {
  const collection = await getUserCollection();
  const user = await collection.findOne({ email });
  return parseMongoData(user);
};

const getUsersByGroup = async (groupId) => {
  assertIsValuedString(groupId, 'Group ID');

  const collection = await getUserCollection();
  const user = await collection.find({ groupId }).toArray();
  return parseMongoData(user);
};

const createUser = async (data) => {
  assertRequiredObject(data);

  let { uid, displayName, email, createdAt = new Date().getTime() } = data;

  assertIsValuedString(uid, 'Firebase user ID');
  assertIsValuedString(displayName, 'Display name');
  assertEmailString(email, 'Email Address');

  const userData = {
    uid: uid,
    name: displayName,
    email: email,
    groupId: null,
    createdAt: createdAt,
  };

  const collection = await getUserCollection();
  const { result, insertedCount, insertedId } = await collection.insertOne(userData);

  if (!result.ok || insertedCount !== 1) {
    throw new QueryError(`Could not create user`);
  }

  return await getByObjectId(insertedId);
};

const updateUser = async (id, updates) => {
  assertObjectIdString(id);
  assertRequiredObject(updates, 'User updates data');

  let { uid, name, email, groupId } = updates;

  assertIsValuedString(uid, 'User ID');
  assertIsValuedString(name, 'User name');
  assertEmailString(email, 'Email');
  email = email.toLowerCase();
  if (groupId) assertObjectIdString(groupId);

  const user = await getByObjectId(id);

  if (!user) {
    throw new QueryError(`User with ID\`${id}\` not found.`);
  }

  const options = { returnOriginal: false };
  const collection = await getUserCollection();

  const newUpdate = {
    uid: uid,
    name: name,
    email: email,
    groupId: groupId,
  };

  const ops = {
    $set: newUpdate,
  };

  const { value: updatedUser, ok } = await collection.findOneAndUpdate(idQuery(id), ops, options);

  if (!ok) {
    throw new QueryError(`Could not update user with ID \`${id}\``);
  }

  return parseMongoData(updatedUser);
};

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  getUsersByGroup,
  updateUser,
  getByObjectId,
  getUserByEmail,
};
