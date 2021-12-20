import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { getNextStatus, getStatusName } from '../../application/constants/data';
import { updateBasketStatus } from '../../application/redux/actions';
import { updateBasketClothes } from '../../application/redux/actions/basket';
import { fetchClothesLocations } from '../../application/redux/actions/clothesLocation';
import { getBasketDetailSelector } from '../../application/redux/selectors';

import DataModal from '../DataPage/DataModal';

export default function BasketOperation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: basket,
    loading,
    error,
  } = useSelector(getBasketDetailSelector(id));
  const { name = '', status = '', clothes = [] } = basket || {};
  const isEmpty = basket && basket.clothes && basket.clothes.length === 0;
  const nextStatus = getNextStatus(status);
  const canOperate =
    !isEmpty && (status === 'PENDING' || status === 'WASHING_DONE');
  const canReset = status === 'DRYING_DONE';
  const canClear = status === 'PENDING' && !isEmpty;
  const isWorking = status === 'WASHING' || status === 'DRYING';

  const [taskTime, setTaskTime] = useState();
  const [taskTimeError, setTaskTimeError] = useState();
  function handleTaskTimeChange(e) {
    setTaskTimeError('');
    setTaskTime(e.target.value);
  }

  function goBack() {
    navigate(-1);
  }

  function validateTaskTime() {
    if (!taskTime) {
      setTaskTimeError('Task duration is required for this operation');
      return false;
    }
    const taskTimeNumber = parseInt(taskTime);
    if (!Number.isInteger(taskTimeNumber) || taskTimeNumber <= 0) {
      setTaskTimeError('Task duration should be a positive integer');
      return false;
    }

    if (taskTimeNumber > 10800) {
      setTaskTimeError('Task duration should be less than 3 hours');
      return false;
    }

    return true;
  }

  async function handleBasketOperation() {
    if ((canOperate && validateTaskTime()) || canReset) {
      try {
        await dispatch(
          updateBasketStatus(id, {
            status: nextStatus,
            time: parseInt(taskTime) * 1000,
            lastUpdateId: basket.history[basket.history.length - 1]._id,
          })
        );
        if (canReset) {
          await dispatch(updateBasketClothes(id, basket.clothes, true));
        }
        await dispatch(fetchClothesLocations());
        goBack();
      } catch (error) {
        console.error('error operating basket', error);
      }
    }
  }

  async function handleClearBasket() {
    if (canClear) {
      try {
        await dispatch(updateBasketClothes(id, basket.clothes, true));
        await dispatch(fetchClothesLocations());
        goBack();
      } catch (error) {
        console.error('error clearing basket', error);
      }
    }
  }

  return (
    <DataModal
      open
      title={`${name} (${getStatusName(status)})`}
      loading={loading}
      error={error?.message}
    >
      {isEmpty && (
        <Box>
          <Typography>Basket is empty</Typography>
        </Box>
      )}
      {isWorking && (
        <Box>
          <Typography>{`Still ${getStatusName(status)} ${clothes.length} laundry items`}</Typography>
        </Box>
      )}
      {canOperate && (
        <Box>
          <div>
            {status === 'PENDING' && (
              <Typography>Washing Task Ready</Typography>
            )}
            {status === 'WASHING_DONE' && (
              <Typography>Drying Task Ready</Typography>
            )}
          </div>
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <TextField
                m={4}
                error={!!taskTimeError}
                helperText={taskTimeError}
                label="Duration (s)"
                placeholder="enter task duration"
                id="basket-operation-duration-input"
                name="task-time"
                type="number"
                value={taskTime}
                onChange={handleTaskTimeChange}
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                onClick={(e) => {
                  e.preventDefault();
                  handleBasketOperation();
                }}
              >
                Start{' '}
                {status === 'PENDING'
                  ? 'Washing'
                  : status === 'WASHING_DONE'
                  ? 'Drying'
                  : ''}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      {canReset && (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Box>
            <Typography>Clear basket of all clothes and set to pending</Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                handleBasketOperation();
              }}
            >
              Reset Basket
            </Button>
          </Box>
        </Box>
      )}

      {canClear && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography>Remove all clothes from basket</Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                handleClearBasket();
              }}
            >
              Clear Basket
            </Button>
          </Box>
        </Box>
      )}
    </DataModal>
  );
}
