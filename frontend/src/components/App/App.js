import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import Box from '@mui/system/Box';
import { useMediaQuery, useTheme } from '@mui/material';

import { AuthContext } from '../../application/firebase/auth';
import { useBasketMonitor } from '../../application/hooks/data';
import Clothes from '../Clothes';
import Basket from '../Basket';
import { Group } from '../Group';
import Task from '../Task';
import { SignUp } from '../Users';

import NoPageFound from './NoPageFound';
import HomePage from './HomePage';
import NavBar from './NavBar';
import SideBar from './SideBar';
import ProtectedRoute from './ProtectedRoute';

import CheckroomIcon from '@mui/icons-material/Checkroom';
import GroupIcon from '@mui/icons-material/Group';
import LocalLaundryService from '@mui/icons-material/LocalLaundryService';
import ShoppingBasket from '@mui/icons-material/ShoppingBasket';

const navConfigs = [
  {
    key: 'clothes',
    text: 'Clothes',
    to: '/clothes',
    icon: <CheckroomIcon />,
  },
  {
    key: 'baskets',
    text: 'Baskets',
    to: '/baskets',
    icon: <ShoppingBasket />,
  },
  {
    key: 'group',
    text: 'Group',
    to: '/group',
    icon: <GroupIcon />,
  },
  {
    key: 'tasks',
    text: 'Tasks',
    to: '/tasks',
    icon: <LocalLaundryService />,
  },
];

export default function App() {
  const { currentUser } = useContext(AuthContext);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));

  useBasketMonitor();

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'stretch',
      }}
    >
      {matches && currentUser && currentUser.groupId && (
        <SideBar navConfigs={navConfigs} />
      )}
      <Box sx={{ flexGrow: 1 }}>
        {currentUser && <NavBar navConfigs={navConfigs} />}
        <Routes>
          <Route
            path="/group"
            element={
              <ProtectedRoute isGroup>
                <Group />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<SignUp />} />
          <Route
            path="/clothes/*"
            element={
              <ProtectedRoute>
                <Clothes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/baskets/*"
            element={
              <ProtectedRoute>
                <Basket />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/*"
            element={
              <ProtectedRoute>
                <Task />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </Box>
    </Box>
  );
}
