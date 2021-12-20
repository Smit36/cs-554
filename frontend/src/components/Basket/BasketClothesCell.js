import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';

import { getClothesDetailSelector } from '../../application/redux/selectors';
import { getClothesDetail } from '../../application/redux/actions/clothes';

function BasketClothesPiece({ id }) {
  const dispatch = useDispatch();
  const clothesData = useSelector(getClothesDetailSelector(id));

  useEffect(() => {
    if (
      !clothesData ||
      (!clothesData.data && !clothesData.loading && !clothesData.error)
    ) {
      dispatch(getClothesDetail(id));
    }
  }, [dispatch, id, clothesData]);

  const { data: clothesItem, loading, error } = clothesData;
  return (
    <>
      {error && (
        <Tooltip title={error?.message || 'clothes error'}>
          <IconButton color="error">
            <ErrorIcon />
          </IconButton>
        </Tooltip>
      )}
      {loading && <CircularProgress size="1rem" />}
      {!loading && !error && clothesItem && (
        <Chip size="small" label={clothesItem.name} />
      )}
    </>
  );
}

export default function BasketClothesCell({ clothesIdList }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {clothesIdList.map((id) => (
        <BasketClothesPiece id={id} key={`basket-clothes-${id}`} />
      ))}
    </Box>
  );
}
