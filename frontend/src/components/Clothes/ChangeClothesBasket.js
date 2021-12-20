import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosGet } from '../../application/api/utils';
import { useClothesLocation } from '../../application/hooks/data';

import { updateBasketClothes } from '../../application/redux/actions/basket';
import { fetchClothesLocations } from '../../application/redux/actions/clothesLocation';

import DataModal from '../DataPage/DataModal';

export default function ChangeClothesBasket() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [basketId, setBasketId] = useState('');

  const clothesIdList =
    new URLSearchParams(location.search).getAll('clothes') || '';
  // const baskets = useActiveBaskets();
  const [baskets, setBaskets] = useState([]);

  const {
    data: clothesLocaiton,
    loading: clothesLocaitonLoading,
    error: clothesLocaitonError,
  } = useClothesLocation();

  const canClear = clothesIdList.some((id) => id in clothesLocaiton);

  useEffect(() => {
    async function getPendingBaskets() {
      const baskets = await axiosGet('/baskets/pending');
      setBaskets(baskets);
      setBasketId(baskets[0]._id);
    }
    getPendingBaskets();
  }, []);

  function handleSelectBasket(e) {
    setBasketId(e.target.value);
  }

  function handleClose() {
    navigate(-1);
  }

  async function handlePutClothesToBasket() {
    console.log(clothesIdList, basketId);
    if (clothesIdList.length > 0) {
      await dispatch(updateBasketClothes(basketId, clothesIdList));
      await dispatch(fetchClothesLocations());
    }
    handleClose();
  }

  async function handleRemoveClothesFromBaskets() {
    if (canClear) {
      await Promise.all(
        clothesIdList.map(
          (id) =>
            clothesLocaiton[id] &&
            dispatch(updateBasketClothes(clothesLocaiton[id], [id], true))
        )
      );
      await dispatch(fetchClothesLocations());
      handleClose();
    }
  }

  return (
    <DataModal open onClose={handleClose}>
      {canClear && (
        <button onClick={handleRemoveClothesFromBaskets}>
          Remove selected clothes from all current baskets
        </button>
      )}
      put {clothesIdList.length} piece of clothes into basket
      <select
        defaultValue={baskets[0]?._id}
        value={basketId}
        onChange={handleSelectBasket}
      >
        {baskets.map(({ _id, name }) => (
          <option key={_id} value={_id}>
            {name}
          </option>
        ))}
      </select>
      <button
        onClick={(e) => {
          e.preventDefault();
          handlePutClothesToBasket();
        }}
      >
        ok
      </button>
    </DataModal>
  );
}
