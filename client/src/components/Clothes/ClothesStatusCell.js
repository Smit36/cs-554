import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';

import { getBasketDetailSelector } from '../../application/redux/selectors';
import { useClothesLocation } from '../../application/hooks/data';
import { getBasketDetail } from '../../application/redux/actions/basket';

export default function ClothesStatusCell({ clothes }) {
  const dispatch = useDispatch();
  const {
    data: clothesLocation = {},
    error: clothesLocationError,
    loading: clothesLocationLoading,
  } = useClothesLocation();
  const basketId = clothesLocation[clothes._id];
  const basketData = useSelector(getBasketDetailSelector(basketId));

  useEffect(() => {
    if (
      basketId &&
      (!basketData ||
        (!basketData.data && !basketData.loading && !basketData.error))
    ) {
      try {
        dispatch(getBasketDetail(basketId));
      } catch (error) {
        console.error('error fetching basket detail:', error);
      }
    }
  }, [dispatch, basketId, basketData]);

  const {
    data: basket,
    error: basketError,
    loading: basketLoading,
  } = basketData;
  return (
    <>
      {basketError && (
        <Tooltip title={basketError?.message || 'basket error'}>
          <IconButton color="error">
            <ErrorIcon />
          </IconButton>
        </Tooltip>
      )}
      {clothesLocationError && (
        <Tooltip
          title={
            clothesLocationError?.message || 'clothes location cache error'
          }
        >
          <IconButton color="error">
            <ErrorIcon />
          </IconButton>
        </Tooltip>
      )}
      {(basketLoading || clothesLocationLoading) && (
        <CircularProgress size="1rem" />
      )}
      {!basketError && !clothesLocationError && (
        <>{basket ? `${basket.status} (${basket.name})` : '-'}</>
      )}
    </>
  );
}
