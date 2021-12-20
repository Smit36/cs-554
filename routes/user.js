const { Router } = require('express');
const router = Router();
const usersData = require('../data/user');

const {
  assertObjectIdString,
  assertIsValuedString,
  assertRequiredObject,
  assertEmailString,
  assertNonEmptyArray,
} = require('../utils/assertion');
const { QueryError, ValidationError, HttpError } = require('../utils/errors');

//add user
router.post('/', async (req, res, next) => {
  try {
    const reqBody = req.body;
    assertRequiredObject(reqBody);

    let { uid, displayName, email } = reqBody;
    assertIsValuedString(uid, 'User ID');
    assertIsValuedString(displayName, 'User name');
    assertEmailString(email, 'Email');
    const userPresent = await usersData.getUserByEmail(email);

    if (userPresent) {
      console.log('User present:', userPresent);
      req.session.user = userPresent;
      console.log('USer present Session: ', req.session.user);
      return res.status(200).json(userPresent);
    }

    const newUser = await usersData.createUser(reqBody);
    req.session.user = newUser;
    console.log('Session User => ', req.session.user);
    res.status(200).json(newUser);
  } catch (error) {
    next(error);
  }
});

//Get all users
router.get('/all', async (req, res, next) => {
  try {
    const allUsers = await usersData.getAllUsers();
    console.log('ALl Users: \n', allUsers);
    return res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});
//logout
router.post('/logout', async (req, res, next) => {
  try {
    req.session.user = req.body;
    console.log(res.session?.user);
    if (req.session?.user) {
      console.log('Session User (Before Logout) => ', req.session.user);
      req.session.destroy();
      console.log('Session User (After Logout) => ', req.session?.user);
      return res.json({ message: 'Log out successfully' });
    } else {
      console.log(res.session);
      throw new HttpError('No Session user available', 400);
    }
  } catch (error) {
    next(error);
  }
});
//end get all users
router.put('/:id', async (req, res, next) => {
  console.log(req.body);
});

// Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    assertObjectIdString(id, 'Group ID');
    const result = await usersData.getUser(id);

    if (!result) {
      throw new HttpError(`Could not get user for user id:${id}`, 404);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
