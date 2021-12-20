import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import AirIcon from '@mui/icons-material/Air';
import CheckIcon from '@mui/icons-material/Check';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import LocalLaundryService from '@mui/icons-material/LocalLaundryService';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

import { getStatusName } from '../../application/constants/data';
import { getTimeLeftDisplay, useTaskTime } from '../TaskProgress/utils';

function TaskProgressBar({ icon, progress }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box>{icon}</Box>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={progress} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        {progress < 100 ? (
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            progress
          )}%`}</Typography>
        ) : (
          <CheckIcon color="success" />
        )}
      </Box>
    </Box>
  );
}

function TaskCard({ task: basket }) {
  const navigate = useNavigate();

  const { name } = basket;
  const { status, time, createdAt } = basket.history[basket.history.length - 1];

  const { timeLeft, progress } = useTaskTime({
    start: createdAt,
    end: createdAt + (time || 0),
  });

  function handleOperateBasket() {
    navigate(`/tasks/${basket._id}/operate`);
  }

  return (
    <Card sx={{ margin: 2, width: 300, flex: '0 0 auto', flexWrap: 'wrap' }}>
      <CardContent>
        <Typography
          sx={{
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
          color="text.secondary"
          gutterBottom
        >
          <ShoppingBasketIcon size="small" /> {name}
        </Typography>
        <Typography variant="h5" component="div">
          {status === 'WASHING' || status === 'DRYING' ? getTimeLeftDisplay(timeLeft) : '- - : - -'}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {getStatusName(status)}
        </Typography>
        <TaskProgressBar
          icon={<InvertColorsIcon />}
          progress={status === 'WASHING' ? progress : 100}
        />
        <TaskProgressBar
          icon={<AirIcon />}
          progress={
            status === 'DRYING' ? progress : status === 'DRYING_DONE' ? 100 : 0
          }
        />
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        {status === 'WASHING_DONE' && (
          <Button
            size="small"
            startIcon={<LocalLaundryService />}
            onClick={handleOperateBasket}
          >
            Dry Clothes
          </Button>
        )}
        {status === 'DRYING_DONE' && (
          <Button
            size="small"
            startIcon={<ShoppingBasketIcon />}
            onClick={handleOperateBasket}
          >
            Reset Basket
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default function TaskSeries({ title, tasks }) {
  return (
    <Container sx={{ marginBottom: 2 }}>
      <Typography variant="h6" component="h2" p={2}>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', width: '100%' }}>
        {tasks.map((basket) => (
          <TaskCard task={basket} />
        ))}
      </Box>
      {tasks.length === 0 && (
        <Typography variant="h6" component="h2" color="text.secondary">
          No {title} at the Moment
        </Typography>
      )}
    </Container>
  );
}
