export const nextStatus = {
  PENDING: 'WASHING',
  WASHING: 'WASHING_DONE',
  WASHING_DONE: 'DRYING',
  DRYING: 'DRYING_DONE',
  DRYING_DONE: 'PENDING',
};

export const statusName = {
  PENDING: 'Pending',
  WASHING: 'Washing',
  WASHING_DONE: 'Washing Done',
  DRYING: 'Drying',
  DRYING_DONE: 'Drying Done',
};

export const getNextStatus = (status) => nextStatus[status] || '';

export const getStatusName = (status) => statusName[status] || '';
