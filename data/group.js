const { groups: getGroupCollection } = require("../config/mongoCollections");
let { ObjectId, ObjectID } = require("mongodb");

const userData = require("./user");

const { QueryError, ValidationError } = require("../utils/errors");
const {
  idQuery,
  parseMongoData,
  stringifyObjectId,
} = require("../utils/mongodb");
const {
  assertObjectIdString,
  assertRequiredString,
  assertRequiredObject,
  assertNonEmptyArray,
  assertRequiredNumber,
  assertEmailString,
  assertContactString,
} = require("../utils/assertion");

const getByObjectId = async (objectId) => {
  const collection = await getGroupCollection();
  const group = await collection.findOne(idQuery(objectId));
  return parseMongoData(group);
};

const getAllGroups = async () => {
  const collection = await getGroupCollection();

  let groupList = {};

  groupList = await collection.find({}).toArray();

  return groupList;
};

const getGroup = async (id) => {
  assertObjectIdString(id);
  return await getByObjectId(id);
};

const getGroupByName = async (name) => {
  assertRequiredString(name, "Group name");

  const collection = await getGroupCollection();
  const group = await collection.findOne({ name: name });
  return parseMongoData(group);
};

const createGroup = async (data) => {
  assertRequiredObject(data);

  let { name, users, createdAt = new Date().getTime() } = data;

  assertRequiredString(name, "Group name");
  assertNonEmptyArray(users, "Users");

  const groupData = {
    _id: new ObjectId(),
    name: name,
    users: users,
    createdAt: createdAt,
  };

  for (let user of users) {
    user.groupId = stringifyObjectId(groupData._id, "group ID");
    userData.updateUser(user._id, user);
  }

  const collection = await getGroupCollection();
  const { result, insertedCount, insertedId } = await collection.insertOne(
    groupData
  );

  if (!result.ok || insertedCount !== 1) {
    throw new QueryError(`Could not create group`);
  }

  return await getByObjectId(insertedId);
};

const updateGroup = async (id, updates) => {
  assertObjectIdString(id);

  let { name, users } = updates;

  assertRequiredString(name, "Group name");
  // assertNonEmptyArray(users, "Users");

  const group = await getGroup(id);

  if (!group) {
    throw new QueryError(`Group with ID\`${id}\` not found.`);
  }

  const options = { returnOriginal: false };
  const collection = await getGroupCollection();

  const newUpdate = {
    name: name,
    users: users,
  };

  const ops = {
    $set: newUpdate,
  };

  const { value: updatedGroup, ok } = await collection.findOneAndUpdate(
    idQuery(id),
    ops,
    options
  );

  if (!ok) {
    throw new QueryError(`Could not update user with ID \`${id}\``);
  }

  return parseMongoData(updatedGroup);
};

const deleteGroup = async (id) => {
  const collection = await getGroupCollection();

  const deletionInfo = await collection.deleteOne({ _id: new ObjectID(id) });

  if (deletionInfo.deletedCount === 0) {
    throw new QueryError(`Could not delete group with id of ${id}`);
  }

  if (deletionInfo.deletedCount > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  createGroup,
  getGroup,
  getAllGroups,
  getGroupByName,
  updateGroup,
  deleteGroup,
};
