const { ObjectId } = require('mongodb');
const { connect, disconnect } = require('../config/mongoConnection');
const { seedGroups } = require('./groups');
const { seedUsers } = require('./users');
const { seedClothes } = require('./clothes');
const { seedBaskets } = require('./baskets');

const unseed = async (db) => {
  if (!!db) {
    console.log('cleaning up database..');
    await db.dropDatabase();
  }
};

const seed = async () => {
  let db = await connect();

  try {
    await unseed(db);

    const { u1, u2, u3, u4 } = await seedUsers();
    const { g1, g2 } = await seedGroups(u1, u2, u3, u4);
    await seedClothes(u1, u2, u3, u4, g1, g2);
    await seedBaskets(
      u1,
      u2,
      u3,
      u4,
    );

    console.log('Seeding Completed.');
    return {
      // ...seedData,
    };
  } catch (error) {
    console.log('Seeding error:', error);
    await unseed(db);
    await disconnect();
  }
};

module.exports = seed;
