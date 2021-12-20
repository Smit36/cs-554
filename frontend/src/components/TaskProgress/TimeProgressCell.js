import React, { useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorIcon from '@mui/icons-material/Error';

import { getTimeLeftDisplay, useTaskTime } from './utils';

export default function TimeProgressCell({ start, end, refresh }) {
  const { progress, timeLeft } = useTaskTime({ start, end });
  const [error, setError] = useState(null);

  async function handleRefresh() {
    if (refresh) {
      try {
        setError(null);
        await refresh();
      } catch (error) {
        console.error(error);
        setError(error);
      }
    }
  }

  return (
    end > start && (
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress variant="determinate" value={progress} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
            >
              {`${Math.round(progress)}%`}
            </Typography>
          </Box>
        </Box>
        <Box>
          {timeLeft === 0 ? (
            'Done'
          ) : (
            <>
              {getTimeLeftDisplay(timeLeft)}
              {' remaining'}
            </>
          )}
        </Box>
        {error && (
          <Box>
            <Tooltip title={error?.message || 'Basket Status Error'}>
              <IconButton color="error">
                <ErrorIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        {(error || timeLeft === 0) && (
          <Tooltip title="Refresh Status">
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    )
  );
}
