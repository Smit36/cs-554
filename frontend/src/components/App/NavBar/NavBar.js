import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/system/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { AuthContext } from '../../../application/firebase/auth';
import { doSignOut } from '../../../application/firebase/firebaseFunctions';
import { axiosPost } from '../../../application/api/utils';

const accountMenuId = 'account-menu';

function NavDropMenu({ navConfigs }) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="open menu"
        sx={{ display: { xs: 'block', sm: 'none' } }}
        id="menu-button"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="mobile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {navConfigs.map(({ key, icon, text, to }) => {
          return (
            <MenuItem
              key={key}
              onClick={() => {
                navigate(to);
              }}
            >
              {icon}
              {text}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

export default function NavBar({ navConfigs }) {
  //Dhruveel's Changes
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  async function handleSignOut(e) {
    console.log('Before Prevent');
    e.preventDefault();

    const user = await axiosPost('/user/logout', currentUser);
    console.log(user);
    setCurrentUser(null);
    console.log('in SIgnout handleSIgnout', currentUser);
    doSignOut();
    navigate('/login');
    console.log(currentUser);
  }

  // Dhruveel's Changes ends here

  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const accountMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={accountMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
    </Menu>
  );
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <NavDropMenu navConfigs={navConfigs} />
          <Typography
            onClick={() => {
              navigate('/');
            }}
            sx={{
              cursor: 'pointer',
              display: { xs: 'block', sm: 'none' },
            }}
          >
            WashTastic
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={accountMenuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ gap: 1 }}
            >
              {currentUser.name}
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {accountMenu}
    </>
  );
}
