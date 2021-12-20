const { defaultErrorHandling } = require('../utils/errors');
const userRouter = require('./user');
const clothesRouter = require('./clothes');
const basketRouter = require('./basket');
const groupRouter = require('./group');
const messagingRouter = require('./messaging');

const configRoutes = (app) =>
  app
    .use('/api/user', userRouter)
    .use('/api/clothes', clothesRouter)
    .use('/api/baskets', basketRouter)
    .use('/api/group', groupRouter)
    .use('/api/messaging', messagingRouter)
    .use(defaultErrorHandling);

module.exports = {
  configRoutes,
};
