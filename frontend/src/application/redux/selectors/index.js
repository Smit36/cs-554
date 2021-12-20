import { createSelector } from 'reselect';

const genPagingationSelector = (dataStateSelector) =>
  createSelector(dataStateSelector, ({ pagination, idListByPage }) => {
    return {
      idList: idListByPage[pagination.page] || [],
      ...pagination,
    };
  });

const genStateByIdSelector = (dataStateSelector) =>
  createSelector(dataStateSelector, ({ stateById }) => stateById);

const genGetDetailSelector = (dataStateSelector) => (id) =>
  createSelector(
    genStateByIdSelector(dataStateSelector),
    (stateById) => stateById[id] || {}
  );

export const clothesStateSelector = (state) => state.clothes;

export const basketStateSelector = (state) => state.basket;

export const clothesPaginationSelector =
  genPagingationSelector(clothesStateSelector);

export const basketPaginationSelector =
  genPagingationSelector(basketStateSelector);

export const getClothesDetailSelector =
  genGetDetailSelector(clothesStateSelector);

export const getBasketDetailSelector =
  genGetDetailSelector(basketStateSelector);

export const userSelector = (state) => state.user;

export const paginatedBasketsSelector = createSelector(
  [basketPaginationSelector, genStateByIdSelector(basketStateSelector)],
  (pagination, stateById) => ({
    ...pagination,
    data: pagination.idList.map((id) => stateById[id]), //.filter(data => data),
  })
);
