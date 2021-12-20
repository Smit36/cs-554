import React from 'react';
import { useNavigate } from 'react-router';

import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function SideBar({ navConfigs }) {
  const navigate = useNavigate();

  return (
    <Paper Paper square variant="outlined">
      <Typography
        variant="h6"
        component="h1"
        sx={{ padding: 2, cursor: 'pointer' }}
        onClick={() => {
          navigate('/');
        }}
      >
        WashTastic
      </Typography>
      <List>
        {navConfigs.map(({ key, icon, text, to }) => {
          return (
            <ListItem>
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
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
