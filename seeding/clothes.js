const { ObjectId } = require('mongodb');
const { addCloth } = require('../data/clothes');

const seedClothes = async (
  user1,
  user2,
  user3,
  user4,
  group1,
  group2,
  { timestamp1 = new Date().getTime(), timestamp2 = new Date().getTime() } = {},
) => {

  // assume users have groups already
  const clothesData = [];
  const users = [user1, user2, user3, user4];
  for (const u of users) {
    clothesData.push({
      userId: u._id,
      groupId: u.groupId,
      name: u.name + '\'s Tshirt 1',
      weight: 2,
      type: 'tshirt',
    });
    clothesData.push({
      userId: u._id,
      groupId: u.groupId,
      name: u.name + '\'s Tshirt 2',
      weight: 3,
      type: 'tshirt',
    });
    clothesData.push({
      userId: u._id,
      groupId: u.groupId,
      name: u.name + '\'s Jeans',
      weight: 4,
      type: 'pants',
    });
    clothesData.push({
      userId: u._id,
      groupId: u.groupId,
      name: u.name + '\'s Shorts',
      weight: 3,
      type: 'pants',
    });
    clothesData.push({
      userId: u._id,
      groupId: u.groupId,
      name: u.name + '\'s Socks Red',
      weight: 1,
      type: 'socks',
    });
    clothesData.push({
      userId: u._id,
      groupId: u.groupId,
      name: u.name + '\'s Socks White',
      weight: 1,
      type: 'socks',
    });
    clothesData.push({
      userId: u._id,
      groupId: u.groupId,
      name: u.name + '\'s Socks Blue',
      weight: 1,
      type: 'socks',
    });
  }
  
  return await Promise.all(clothesData.map(addCloth));
};

module.exports = { seedClothes };
