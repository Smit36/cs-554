import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBasketDetail } from '../redux/actions';
import { fetchClothesLocations } from '../redux/actions/clothesLocation';
import { useGroupTopic } from './messaging';

export function useClothesLocation(options = {}) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (options.refresh) dispatch(fetchClothesLocations());
  }, [dispatch, options.refresh]);

  return useSelector((state) => state.clothesLocation);
}
export function useBasketMonitor(options = {}) {
  const dispatch = useDispatch();

  const onMessage = useCallback(
    async (payload) => {
      const { data = {} } = payload;
      const { type, message, basketId, status } = data;
      if (type === 'BASKET_STATUS' && basketId) {
        await dispatch(getBasketDetail(basketId));
        await dispatch(fetchClothesLocations());
      }
    },
    [dispatch]
  );

  useGroupTopic({ onMessage });
}
