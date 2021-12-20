import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getBasketDetailSelector } from '../../application/redux/selectors';

import { updateBasketStatus } from '../../application/redux/actions';
import DataModal from '../DataPage/DataModal';
import { fetchClothesLocations } from '../../application/redux/actions/clothesLocation';

const validNextStatus = {
  PENDING: 'WASHING',
  WASHING: 'WASHING_DONE',
  WASHING_DONE: 'DRYING',
  DRYING: 'DRYING_DONE',
  DRYING_DONE: 'PENDING',
};

export default function ChangeStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data: basket,
    loading,
    error,
  } = useSelector(getBasketDetailSelector(id));
  const nextStatus = validNextStatus[basket?.status];
  const [taskTime, setTaskTime] = useState();

  const canChange = nextStatus === 'PENDING' || nextStatus === 'WASHING_DONE' || nextStatus === 'PENDING'; 
  console.log(basket);
  function handleClose() {
    navigate(-1);
  }

  function handleTaskTimeChange(e) {
    setTaskTime(e.target.value);
  }

  async function handleChangeStatus() {
    await dispatch(
      updateBasketStatus(id, {
        status: nextStatus,
        time: taskTime,
        lastUpdateId: basket.history[basket.history.length - 1]._id,
      })
    );
    await dispatch(fetchClothesLocations());
    handleClose();
  }

  return (
    <DataModal open onClose={handleClose}>
      <p>Current Status: {basket.status}</p>
      <p>Next Status: {nextStatus}</p>

      <div>
        <label>Task Time</label>
        <input
          name="task-time"
          type="number"
          value={taskTime}
          onChange={handleTaskTimeChange}
        />
        {/* {error?.message && <div>{error.message}</div>} */}
      </div>
      <button
        onClick={(e) => {
          e.preventDefault();
          handleChangeStatus();
        }}
      >
        ok
      </button>
    </DataModal>
  );
}
