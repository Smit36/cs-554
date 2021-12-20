import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';

import { getStatusName } from '../../application/constants/data';
import { useClothesLocation } from '../../application/hooks/data';
import {
  createBasket,
  deleteBasket,
  getBasketDetail,
  getBasketList,
  updateBasket,
} from '../../application/redux/actions';
import {
  basketPaginationSelector,
  getBasketDetailSelector,
} from '../../application/redux/selectors';

import DataPage from '../DataPage';
import TimeProgressCell from '../TaskProgress/TimeProgressCell';

import BasketOperation from './BasketOperation';
import BasketClothesCell from './BasketClothesCell';
import { useDispatch } from 'react-redux';

const basketFormConfigs = [
  {
    name: 'name',
    label: 'Basket Name',
    validation: {
      required: 'Name is Required',
      maxLength: {
        value: 30,
        message: 'Basket Name should not be longer than 30 characters',
      },
    },
  },
  {
    name: 'weight',
    label: 'Max Weight',
    type: 'number',
    validation: {
      required: 'Max weight is Required',
      max: {
        value: 20,
        message: 'Maximum weight capacity of basket is 20',
      },
      min: {
        value: 1,
        message: 'Minumum weight capacity of basket is 1',
      },
    },
  },
];

export default function BasketPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: clothesLocation = {},
    loading: clothesLocationLoading,
    error: clothesLocationError,
  } = useClothesLocation();

  function handleOperateBasket(selectedList) {
    navigate(`/baskets/${selectedList[0]}/operate`);
  }

  function validateEditCandidate(basketData) {
    return !basketData
      ? 'No basket data'
      : basketData?.clothes?.length > 0
      ? 'Cannot edit when basket is not empty.'
      : '';
  }

  function validateDeleteCandidates(basketIdList) {
    const workingBasketIdSet = new Set(Object.values(clothesLocation));
    return basketIdList.some((basketId) => workingBasketIdSet.has(basketId))
      ? 'Cannot delete when basket is not empty'
      : '';
  }

  const refreshBasket = useCallback(
    (id) => dispatch(getBasketDetail(id)),
    [dispatch]
  );

  const basketColumns = useMemo(
    () => [
      {
        field: 'name',
        label: 'Name',
      },
      {
        field: 'status',
        label: 'Status',
        render: getStatusName,
      },
      {
        field: 'time',
        label: 'Task time',
        render(_, data) {
          const { createdAt, time } = data.history[data.history.length - 1];
          function handleFresh() {
            refreshBasket(data._id);
          }
          return (
            <TimeProgressCell
              start={createdAt}
              end={createdAt + (time || 0)}
              refresh={handleFresh}
            />
          );
        },
      },
      {
        field: 'weight',
        label: 'Weight',
        render(weight, data) {
          return `${data.currentWeight} / ${weight}`;
        },
      },
      {
        field: 'clothes',
        label: 'Clothes',
        render(clothes, data) {
          return <BasketClothesCell clothesIdList={clothes} />;
        },
      },
    ],
    [refreshBasket]
  );

  return (
    <DataPage
      title="Laundry Baskets"
      path="/baskets"
      columns={basketColumns}
      paginationSelector={basketPaginationSelector}
      getDataSelector={getBasketDetailSelector}
      fetchPaginationAction={getBasketList}
      updateAction={updateBasket}
      deleteAction={deleteBasket}
      createAction={createBasket}
      formConfigs={basketFormConfigs}
      createFormTitle="Add New Basket"
      editFormTitle="Edit Basket Info"
      deleteFormTitle="Delete Basket"
      validateEditCandidate={validateEditCandidate}
      validateDeleteCandidates={validateDeleteCandidates}
      customActions={[
        {
          icon: <LocalLaundryServiceIcon />,
          title: 'Operate Basket',
          hidden(selectedList) {
            return selectedList.length !== 1;
          },
          onClick(e, selectedList) {
            e.preventDefault();
            handleOperateBasket(selectedList);
          },
        },
      ]}
      customRoutes={[
        {
          path: '/:id/operate',
          element: <BasketOperation />,
        },
      ]}
    />
  );
}
