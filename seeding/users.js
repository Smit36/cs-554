const { ObjectId } = require("mongodb");
const { createUser } = require("../data/user");

const seedUsers = async ({
  timestamp1 = new Date().getTime(),
  timestamp2 = new Date().getTime(),
} = {}) => {
  const user1 = {
    uid: "123654987897456253140",
    displayName: "Vivian Dbritto",
    email: "vdbritto@gmail.com",
    createdAt: timestamp1,
  };

  const user2 = {
    uid: "123654987897456253141",
    displayName: "Ming Wei Hu",
    email: "mhu@gmail.com",
    createdAt: timestamp2,
  };

  const user3 = {
    uid: "123654987897456253143",
    displayName: "Dhruveel Doshi",
    email: "dhruveeldoshi@gmail.com",
    createdAt: timestamp2,
  };

  const user4 = {
    uid: "123654987897456253144",
    displayName: "Smit Gor",
    email: "sgor@gmail.com",
    createdAt: timestamp1,
  };

  const u1 = await createUser(user1);
  const u2 = await createUser(user2);
  const u3 = await createUser(user3);
  const u4 = await createUser(user4);

  return { u1, u2, u3, u4 };
};

module.exports = { seedUsers };
