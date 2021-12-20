const { Router } = require('express');
const { messaging } = require('../config/firebaseAdmin');
const router = Router();
const basketsData = require('../data/basket');

const {
  assertIsValuedString,
  assertRequiredNumber,
  assertObjectIdString,
  assertNonEmptyArray,
} = require('../utils/assertion');
const { getNextBasketStatus } = require('../utils/data');
const { HttpError, ValidationError } = require('../utils/errors');

//add basket
router.post('/', async (req, res, next) => {
  try {
    const { name, users, clothes = [], status = 'PENDING', time = 0, userId, groupId } = req.body;
    const weight = parseInt(req.body.weight);

    assertIsValuedString(userId, 'User Id');
    assertIsValuedString(name, 'Basket name');
    assertRequiredNumber(weight, 'Basket max weight');
    assertIsValuedString(groupId, 'Group Id');
    assertIsValuedString(status, 'Basket status');
    assertRequiredNumber(time, 'Time');

    const basket = await basketsData.getBasketByName(name);

    if (basket) {
      throw new ValidationError(`Basket already exists.`);
    }

    const result = await basketsData.addBasket({
      name,
      weight,
      userId,
      groupId,
      users,
      clothes,
      status,
      time,
    });
    if (!result) {
      throw new HttpError(`Could not add basket for id`, 400);
    }
    try {
      const messageResponse = await messaging.send({
        data: {
          type: 'BASKET_STATUS',
          basketId,
          message: `Basket ${autoResult.name} created.`,
          status: autoResult.status,
        },
        topic: 'abc', //groupId,
      });
      console.log('basket created messaging response:', messageResponse);
    } catch (error) {
      console.error('basket created messaging error:', error);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { userId, groupId } = req.query;
    assertIsValuedString(userId, 'User Id');
    assertIsValuedString(groupId, 'Group Id');
    const { skip, limit } = req.query;
    let result = await basketsData.getBasketByGroupId({
      userId,
      groupId,
      skip: parseInt(skip),
      limit: parseInt(limit),
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/pending', async (req, res, next) => {
  try {
    const { userId, groupId } = req.query;
    assertIsValuedString(userId, 'User Id');
    assertIsValuedString(groupId, 'Group Id');
    let result = await basketsData.getGroupBasketsByStatus(groupId, 'PENDING');
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

//get basket by basketId
router.get('/:id', async (req, res, next) => {
  try {
    const { userId, groupId } = req.query;
    const { id } = req.params;
    assertIsValuedString(id, 'basket Id');
    const result = await basketsData.getBasket(userId, id);
    if (!result) {
      throw new HttpError(`Could not get basket for basket id:${id}`, 400);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

//delete basket
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, groupId } = req.body;
    const result = await basketsData.deleteBasket(userId, groupId, id);
    if (!result) {
      throw new HttpError(`Could not delete basket for basket id:${id}`, 400);
    }
    try {
      const messageResponse = await messaging.send({
        data: {
          type: 'BASKET_DELETE',
          basketId,
          message: `Basket ${autoResult.name} deleted.`,
        },
        topic: 'abc', //groupId,
      });
      console.log('basket deleted messaging response:', messageResponse);
    } catch (error) {
      console.error('basket deleted messaging error:', error);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

//update basket
router.put('/:id', async (req, res, next) => {
  try {
    const { id: basketId } = req.params;
    const isBasketEditable = await basketsData.isBasketEditable(basketId);
    if (!isBasketEditable) {
      throw new ValidationError(`Could not edit basket for id:${basketId}`, 404);
    }

    const { name, users, clothes, status, time, userId, groupId } = req.body;
    const weight = parseInt(req.body.weight);
    assertIsValuedString(userId, 'User Id');
    const result = await basketsData.updateBasket(basketId, {
      name,
      weight,
      userId,
      groupId,
      users,
      clothes,
      status,
      time,
    });
    if (!result) {
      throw new HttpError(`Could not update basket for basket id:${id}`, 400);
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// update basket status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id: basketId } = req.params;
    const { lastUpdateId, status, userId, groupId } = req.body;

    const time = parseInt(req.body.time || 0);
    assertRequiredNumber(time, 'Status Time');
    assertObjectIdString(userId, 'User ID');
    assertObjectIdString(groupId, 'Group ID');
    const result = await basketsData.updateBasketStatus(basketId, {
      userId,
      groupId,
      status,
      time,
      lastUpdateId,
    });
    if (!result) {
      throw new HttpError(`Could not update basket for basket id:${id}`, 400);
    }

    const messageResponse = await messaging.send({
      data: {
        type: 'BASKET_STATUS',
        basketId,
        message: `Basket ${result.name} updated to ${result.status}`,
        status: result.status,
      },
      topic: groupId,
    });
    console.log('basket status messaging response:', messageResponse);

    const nextAutoStatus = getNextBasketStatus(result.status);

    if (nextAutoStatus === 'WASHING_DONE' || nextAutoStatus === 'DRYING_DONE') {
      setTimeout(async () => {
        try {
          const autoResult = await basketsData.updateBasketStatus(basketId, {
            userId,
            groupId,
            status: nextAutoStatus,
            time: 0,
            lastUpdateId: result.history[result.history.length - 1]._id,
          });
          const messageResponse = await messaging.send({
            data: {
              type: 'BASKET_STATUS',
              basketId,
              message: `Basket ${autoResult.name} updated to ${autoResult.status}`,
              status: autoResult.status,
            },
            topic: groupId,
          });
          console.log('basket auto status messaging response:', messageResponse);
        } catch (error) {
          console.error('basket auto status messaging error:', error);
        }
      }, time);
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// update basket clothes
router.patch('/:id/clothes', async (req, res, next) => {
  try {
    const { id: basketId } = req.params;
    const { clothesIdList = [], remove = false, userId, groupId } = req.body;
    assertNonEmptyArray(clothesIdList);
    assertObjectIdString(userId, 'User ID');
    assertObjectIdString(groupId, 'Group ID');

    const result = await basketsData.updateBasketClothes(
      basketId,
      { userId, clothesIdList },
      remove
    );

    if (!result) {
      throw new HttpError(`Could not update basket for basket id:${id}`, 400);
    }
  
    const messageResponse = await messaging.send({
      data: {
        type: 'BASKET_STATUS',
        basketId,
        message: `Basket ${result.name} clothes updated`,
        status: result.status,
      },
      topic: groupId,
    });
    console.log('basket clothes update messaging response:', messageResponse);
  
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
