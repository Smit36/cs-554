import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paginatedBasketsSelector } from '../../application/redux/selectors';
import { getBasketList } from '../../application/redux/actions/basket';

import BasketOperation from '../Basket/BasketOperation';

import TaskSeries from './TaskSeries';

export default function TaskPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: recentBasketDataList,
    error,
    loading,
  } = useSelector(paginatedBasketsSelector);

  useEffect(() => {
    async function fetchRecentBaskets() {
      try {
        await dispatch(getBasketList({ page: 0, limit: 20 }));
      } catch (error) {
        console.error(error);
      }
    }
    fetchRecentBaskets();
  }, [dispatch]);

  const { workingBasketList, finishedBasketList } = useMemo(() => {
    const workingBasketList = [];
    const finishedBasketList = [];
    recentBasketDataList.forEach(({ data: basket, loading, error }) => {
      if (!loading && !error && basket) {
        const lastStatus = basket.history[basket.history.length - 1].status;
        if (['WASHING', 'DRYING'].includes(lastStatus)) {
          workingBasketList.push(basket);
        }
        if (['WASHING_DONE', 'DRYING_DONE'].includes(lastStatus)) {
          finishedBasketList.push(basket);
        }
      }
    });
    return {
      workingBasketList,
      finishedBasketList,
    };
  }, [recentBasketDataList]);

  function handleSeeMore() {
    navigate('/baskets');
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" component="h1">
        Laundry Tasks
      </Typography>
      {error && <>{error?.message || 'error'}</>}
      {loading && <>Loading</>}
      {!error && !loading && (
        <>
          <TaskSeries title="On-going Tasks" tasks={workingBasketList} />
          <TaskSeries title="Actions Required" tasks={finishedBasketList} />
        </>
      )}
      <Button variant="text" onClick={handleSeeMore}>
        See all baskets
      </Button>
      <Routes>
        <Route path="/:id/operate" element={<BasketOperation />} />
      </Routes>
    </Box>
  );
}
