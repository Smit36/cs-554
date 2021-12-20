
const nextStatus = {
  'PENDING': 'WASHING',
  'WASHING': 'WASHING_DONE',
  'WASHING_DONE': 'DRYING',
  'DRYING': 'DRYING_DONE',
  'DRYING_DONE': 'PENDING',
};

const getNextBasketStatus = (currentStatus) => nextStatus[currentStatus];

module.exports = {
  getNextBasketStatus,
};
