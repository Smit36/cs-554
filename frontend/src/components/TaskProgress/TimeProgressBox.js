import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useTaskTime } from './utils';

export default function TimeProgressBox({ start, end }) {
  const { progress, timeLeft } = useTaskTime({ start, end });
  return (
    end > start && (
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 2 }}>
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
          {timeLeft < 60000
            ? `${Math.ceil(timeLeft / 1000)}s`
            : `${Math.ceil(timeLeft / 60000)}min`}{' '}
          remaining
        </Box>
      </Box>
    )
  );
}
