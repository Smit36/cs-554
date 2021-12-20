import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import DataModal from '../DataPage/DataModal';

export default function AddClothesToBasket() {
  const location = useLocation();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [basketId, setBasketId] = useState();

  const clothesSearchParam =
    new URLSearchParams(location.search).get('clothes') || '';
  const clothesIdList = clothesSearchParam ? clothesSearchParam.split(',') : [];
  // const baskets = useActiveBaskets();
  const baskets = ['1', '2', '3'];

  function handleSelectBasket(e) {
    setBasketId(e.target.value);
  }

  function handleClose() {
    navigate(-1);
  }

  function handlePutClothesToBasket() {
    console.log(clothesIdList, basketId);
    // dispatch(putClothesToBasket({ clothesIdList, basketId, }));
    handleClose();
  }

  return (
    <DataModal open onClose={handleClose}>
      put {clothesIdList.length} piece of clothes into basket
      <select value={basketId} onChange={handleSelectBasket}>
        {baskets.map((b) => (
          <option value={b}>{b}</option>
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
