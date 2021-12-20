import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import DataModal from './DataModal';

export default function DataDelete({
  deleteAction,
  fetchPaginationAction,
  title,
  description,
  validateDeleteCandidates = () => {},
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();

  const selectedIdList =
    new URLSearchParams(location.search).getAll('selected') || '';

  const disabledMessage = validateDeleteCandidates(selectedIdList);

  function handleCancel() {
    navigate(-1);
  }

  async function handleDelete() {
    if (disabledMessage) {
      return;
    }
    try {
      setError(null);
      setLoading(true);
      await Promise.all([
        ...selectedIdList.map((id) => dispatch(deleteAction(id))),
      ]);
      dispatch(fetchPaginationAction({ page: 0 }));
      handleCancel();
    } catch (error) {
      setError(error);
      console.log('error deleting data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DataModal
      open
      title={title}
      description={description}
      loading={loading}
      error={disabledMessage || (error ? error?.message || 'Error deleting clothes' : '')}
      disabled={disabledMessage}
    >
      <Box>
        <Typography>Confirm deleting {selectedIdList.length} items</Typography>
      </Box>

      <Box sx={{ margin: 2, display: 'flex', gap: 2, justifyContent: 'end' }}>
        <Button onClick={handleCancel} variant="outlined">
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={loading || !!disabledMessage}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>
    </DataModal>
  );
}
