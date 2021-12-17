import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import DataForm from './DataForm';

export default function DataCreate({
  title,
  description,
  formConfigs,
  createAction,
  fetchPaginationAction,
  getDataSelector,
}) {
  const [id, setId] = useState('_create');
  const { data: createdData, loading, error } = useSelector(getDataSelector(id));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleFormSubmit(formData) {
    try {
      setId('_created');
      const { _id } = await dispatch(createAction(formData));
      dispatch(fetchPaginationAction({ page: 0 }));
      setId(_id);
      navigate(-1);
    } catch (error) {
      console.log('error creating data:', error);
    }
  }

  return (
    <DataForm
      formConfigs={formConfigs}
      onSubmit={handleFormSubmit}
      submitText="Add"
      title={title}
      description={description}
      loading={loading}
      error={error}
    />
  );
}
