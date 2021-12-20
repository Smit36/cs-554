const { Router } = require("express");
const router = Router();
const groupsData = require('../data/group');
const usersData = require('../data/user');
const clothesData = require('../data/clothes');

const {
  assertObjectIdString,
  assertIsValuedString,
  assertRequiredString,
  assertRequiredObject,
  assertEmailString,
  assertNonEmptyArray,
} = require("../utils/assertion");
const { QueryError, ValidationError, HttpError } = require("../utils/errors");

//add group
router.post("/", async (req, res, next) => {
  try {
    const reqBody = req.body;
    console.log(req.body);

    assertRequiredObject(reqBody);
    console.log(req.session.user);
    let { name, users } = reqBody;
    req.session.user = users[0];
    assertIsValuedString(name, "Group name");
    assertNonEmptyArray(users, "Users");

    const groupPresent = await groupsData.getGroupByName(name);

    if (groupPresent) {
      throw new ValidationError(`Group already exists.`);
    }

    const newGroup = await groupsData.createGroup(reqBody);
    console.log("new groups", newGroup);
    req.session.user.groupId = newGroup._id;
    res.status(200).json(newGroup);
  } catch (error) {
    next(error);
  }
});

//Get all groups
router.get("/", async (req, res, next) => {
  try {
    const allGroups = await groupsData.getAllGroups();

    return res.status(200).json(allGroups);
  } catch (error) {
    next(error);
  }
});

// Get group by ID
router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  console.log("group", id);
  try {
    assertObjectIdString(id, "Group ID");
    const result = await groupsData.getGroup(id);

    if (!result) {
      throw new HttpError(`Could not get group for group id:${id}`, 404);
    }
    console.log("Group with ID: ", result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    req.session.user = req.body;
    let id = req.params.id;
    req.session.user = req.body;
    let user = req.session.user;
    console.log("session User in group's PUT req:", user);

    assertRequiredObject(user);

    const group = await groupsData.getGroup(id);

    if (!group) {
      throw new HttpError(`Could not get group for group id: ${id}`, 404);
    }

    const isUserPresent = await usersData.getByObjectId(user._id);

    if (!isUserPresent) {
      throw new HttpError(`Could not get user for user id: ${user._id}`, 404);
    }

    const users = group.users;

    const anyUser = users.some((element) => element.email === user.email);

    if (anyUser) {
      throw new ValidationError(`User already in current group`, 404);
    }

    assertIsValuedString(user.uid, "User ID");
    assertIsValuedString(user.name, "User name");
    assertEmailString(user.email, "Email");

    if (user.groupId) {
      throw new ValidationError(`User already in another group`, 404);
    }

    user.groupId = id;
    usersData.updateUser(user._id, user);

    users.push(user);
    group.users = users;

    const updatedGroup = await groupsData.updateGroup(id, group);
    console.log(updatedGroup);
    res.status(200).json(updatedGroup);
  } catch (error) {
    next(error);
  }
});

router.post("/user/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const reqBody = req.body;
    assertRequiredObject(reqBody);

    let user = reqBody;
    assertObjectIdString(id);

    const group = await groupsData.getGroup(id);

    if (!group) {
      throw new HttpError(`Could not get group for group id: ${id}`, 404);
    }

    const isUserPresent = await usersData.getByObjectId(user._id);

    if (!isUserPresent) {
      throw new HttpError(`Could not get user for user id: ${user._id}`, 404);
    }

    const isClothPresent = await clothesData.isUserOperating(user._id);

    if (isClothPresent) {
      throw new HttpError(
        `Please remove all the clothes from basket to exit out from the group`
        , 400);
    }

    user.groupId = null;
    usersData.updateUser(user._id, user);

    let users = group.users;
    users = users.filter((el) => el._id !== user._id);
    group.users = users;

    const updatedGroup = await groupsData.updateGroup(id, group);
    console.log(updatedGroup);
    res.status(200).json(updatedGroup);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    assertObjectIdString(id);

    const result = await groupsData.deleteGroup(id);

    if (!result) {
      throw new HttpError(`Could not delete group for group id:${id}`, 404);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
