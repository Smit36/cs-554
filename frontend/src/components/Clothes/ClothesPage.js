import React from 'react';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { useNavigate, createSearchParams } from 'react-router-dom';

import {
  createClothes,
  deleteClothes,
  getClothesList,
  updateClothes,
} from '../../application/redux/actions';
import {
  clothesPaginationSelector,
  getClothesDetailSelector,
} from '../../application/redux/selectors';
import DataPage from '../DataPage';
import ClothesBasketManagement from './ClothesBasketManagement';
import { useClothesLocation } from '../../application/hooks/data';

import ClothesStatusCell from './ClothesStatusCell';

const clothesColumns = [
  {
    field: 'name',
    label: 'Name',
  },
  {
    field: 'type',
    label: 'Type',
  },
  {
    field: 'weight',
    label: 'Weight',
  },
  {
    field: 'status',
    label: 'Status',
    render(_, data) {
      return <ClothesStatusCell clothes={data} />;
    },
  },
];

const clothesFormConfigs = [
  {
    name: 'name',
    label: 'Clothes Name',
    validation: {
      required: 'Name is Required',
      maxLength: {
        value: 30,
        message: 'Clothes Name should not be longer than 30 characters',
      },
    },
  },
  {
    name: 'weight',
    label: 'Weight',
    type: 'number',
    validation: {
      required: 'Weight is Required',
      max: {
        value: 10,
        message: 'Maximum weight of clothes is 10',
      },
      min: {
        value: 1,
        message: 'Minumum weight of clothes is 1',
      },
    },
  },
  {
    name: 'type',
    label: 'Type of Clothes',
    type: 'select',
    options: [
      {
        label: 'T-Shirts',
        value: 'tshirt',
      },
      {
        label: 'Pants',
        value: 'pants',
      },
      {
        label: 'Socks',
        value: 'socks',
      },
    ],
    validation: {
      required: 'Type of clothes is Required',
    },
  },
];

export default function ClothesPage() {
  const {
    data: clothesLocation,
    loading: clothesLocationLoading,
    error: clothesLocationError,
  } = useClothesLocation({ refresh: true });
  const navigate = useNavigate();

  function handleAddToBasket(selectedList) {
    navigate({
      pathname: '/clothes/manage-basket',
      search: `?${createSearchParams({
        clothes: selectedList,
      })}`,
    });
  }

  function validateEditCandidate(clothesData) {
    return clothesLocation[clothesData?._id]
      ? 'Cannot edit clothes when in basket'
      : '';
  }

  function validateDeleteCandidates(clothesIdList) {
    return clothesIdList.some((clothesId) => clothesLocation[clothesId])
      ? 'Cannot delete clothes in basket(s)'
      : '';
  }

  return (
    <DataPage
      title="Clothes"
      path="/clothes"
      columns={clothesColumns}
      paginationSelector={clothesPaginationSelector}
      getDataSelector={getClothesDetailSelector}
      fetchPaginationAction={getClothesList}
      updateAction={updateClothes}
      deleteAction={deleteClothes}
      createAction={createClothes}
      formConfigs={clothesFormConfigs}
      createFormTitle="Add New Clothes"
      editFormTitle="Edit Clothes Info"
      deleteFormTitle="Delete Clothes"
      validateEditCandidate={validateEditCandidate}
      validateDeleteCandidates={validateDeleteCandidates}
      customActions={[
        {
          icon: <ShoppingBasketIcon />,
          title: 'Manage Baskets',
          hidden(selectedList) {
            return selectedList.length < 1;
          },
          onClick(e, selectedList) {
            e.preventDefault();
            handleAddToBasket(selectedList);
          },
        },
      ]}
      customRoutes={[
        {
          path: '/manage-basket',
          element: <ClothesBasketManagement />,
        },
      ]}
    />
  );
}
