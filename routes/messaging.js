const { Router } = require('express');
const { messaging } = require('../config/firebaseAdmin');
const router = Router();

router.post('/subscribe', async (req, res, next) => {
  try {
    const { groupId, token } = req.body;
    console.log(req.body);
    const subResponse = await messaging.subscribeToTopic(token, groupId);
    console.log('Successfully subscribed to topic:', subResponse);
    try {
      const messageResponse = await messaging.send({
        data: {
          hello: 'world',
        },
        topic: groupId,
      });
      console.log('Successfully sent message:', messageResponse);
    } catch (error) {
      console.log('Error sending message:', error);
    };
    res.send({ ok: true });
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    next(error);
  }
});


router.post('/unsubscribe', async (req, res, next) => {
  try {
    const { groupId, token } = req.body;
    const unsubResponse = await messaging.unsubscribeFromTopic(token, groupId);
    console.log('Successfully unsubscribed to topic:', unsubResponse);
    res.send({ ok: true });
  } catch (error) {
    console.error('Error unsubscribing to topic:', error);
    next(error);
  }
});

module.exports = router;
