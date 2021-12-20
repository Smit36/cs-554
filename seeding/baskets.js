const { ObjectId } = require('mongodb');
const { addBasket } = require('../data/basket');

const seedBaskets = async (
  user1,
  user2,
  user3,
  user4,
  { timestamp1 = new Date().getTime(), timestamp2 = new Date().getTime() } = {}
) => {
  const basket1 = {
    name: 'Basket 1',
    weight: 20,
    currentWeight: 0,
    userId: user1._id,
    groupId: user1.groupId,
    clothes: [],
    status: 'PENDING',
    time: 0,
    createdAt: timestamp1,
    history: [
      {
        userId: user1._id,
        time: 0,
        status: 'PENDING',
        createdAt: timestamp1,
      },
    ],
  };

  const basket2 = {
    name: 'Basket 2',
    weight: 10,
    currentWeight: 0,
    userId: user1._id,
    groupId: user1.groupId,
    clothes: [],
    status: 'PENDING',
    time: 0,
    createdAt: timestamp1,
    history: [
      {
        userId: user1._id,
        time: 0,
        status: 'PENDING',
        createdAt: timestamp1,
      },
    ],
  };

  const basketA = {
    name: 'Basket A',
    weight: 33,
    currentWeight: 0,
    userId: user3._id,
    groupId: user3.groupId,
    clothes: [],
    status: 'PENDING',
    time: 0,
    createdAt: timestamp1,
    history: [
      {
        userId: user3._id,
        time: 0,
        status: 'PENDING',
        createdAt: timestamp1,
      },
    ],
  };

  const basketB = {
    name: 'Basket B',
    weight: 15,
    currentWeight: 0,
    userId: user3._id,
    groupId: user3.groupId,
    clothes: [],
    status: 'PENDING',
    time: 0,
    createdAt: timestamp1,
    history: [
      {
        userId: user3._id,
        time: 0,
        status: 'PENDING',
        createdAt: timestamp1,
      },
    ],
  };

  const b1 = await addBasket(basket1);
  const b2 = await addBasket(basket2);
  const ba = await addBasket(basketA);
  const bb = await addBasket(basketB);

  return { b1, b2, ba, bb };
};

module.exports = { seedBaskets };
