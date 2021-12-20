const { ObjectId } = require("mongodb");
const { createGroup } = require("../data/group");

const seedGroups = async (
  user1,
  user2,
  user3,
  user4,
  { timestamp1 = new Date().getTime(), timestamp2 = new Date().getTime() } = {}
) => {
  const group1 = {
    name: "Group 1",
    users: [user1, user2],
    createdAt: timestamp1,
  };

  const group2 = {
    name: "Group 2",
    users: [user3, user4],
    createdAt: timestamp1,
  };

  const g1 = await createGroup(group1);
  const g2 = await createGroup(group2);

  return { g1, g2 };
};

module.exports = { seedGroups };
