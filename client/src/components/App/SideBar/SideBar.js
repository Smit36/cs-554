import React from 'react';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router';

const navConfigs = [
  {
    key: 'clothes',
    text: 'Clothes',
    to: '/clothes',
    icon: 'horizontal_split',
  },
  {
    key: 'baskets',
    text: 'Baskets',
    to: '/baskets',
    icon: 'shopping_basket',
  },
  {
    key: 'tasks',
    text: 'Tasks',
    to: '/tasks',
    icon: 'local_laundry_service',
  },
];

export default function SideBar() {
  const navigate = useNavigate();
  return (
    <Paper square variant="outlined">
      <Typography variant="h6">
        WashTastic
      </Typography>
      <List>
        {navConfigs.map(({ key, icon, text, to }) => {
          return (
            <ListItemButton
              key={key}
              onClick={() => {
                navigate(to);
              }}
            >
              <ListItemIcon>
                <Icon>{icon}</Icon>
              </ListItemIcon>
              <ListItemText>{text}</ListItemText>
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
}
