// HomePage.jsx
'use client'
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {CircleFadingPlus, MessageCircleCode, MessageSquareText, Settings, Users } from 'lucide-react';
import { useState,useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Chats from '@/components/Chats';
import secureFetch from '@/utils/securefetch';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Cookies from 'js-cookie';  // Make sure you have js-cookie installed

export default function HomePage() {
  
  const [alignment, setAlignment] = useState('chats');
  const [pic,setPic]= useState('')

  // For dropdown menu of settings
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    async function getPic(){
      try {
        let response = await secureFetch('/profilepic',{},'GET')
        let profilepic = response.data[0].profilePic
        setPic(profilepic)
      } catch (error) {
        console.log('error',error.message)
      }
    }
    getPic()
  }, []);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove('token_test');  // remove cookie
    window.location.href = '/login'; // redirect
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Side vertical nav bar */}
      <div className="fixed left-0 top-0 flex flex-col justify-between items-center bg-[#1D1F1F] h-[695.2px] w-[64px] px-[12px] py-[10px]">

        {/* Top icon stack */}
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <ToggleButtonGroup
            orientation="vertical"
            value={alignment}
            exclusive
            onChange={handleChange}
            sx={{
              '& .MuiToggleButton-root': {
                border: 'none',
                padding: '10px',
                borderRadius: '10px',
                color: '#A9AAAA',
                '&.Mui-selected': {
                  color: '#FAFAFA',
                },
              },
            }}
          >
            <ToggleButton value="chats" aria-label="chats">
              <MessageSquareText />
            </ToggleButton>
            <ToggleButton value="status" aria-label="status">
              <CircleFadingPlus />
            </ToggleButton>
            <ToggleButton value="channels" aria-label="channels">
              <MessageCircleCode />
            </ToggleButton>
            <ToggleButton value="community" aria-label="community">
              <Users />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        {/* Bottom settings + avatar */}
        <div className="flex flex-col justify-center items-center gap-4 text-[#A9AAAA]">
          <IconButton 
            aria-label="settings" 
            onClick={handleSettingsClick} 
            color="primary"
            // removed disabled so it can be clickable
          >
            <Settings className="text-[#A9AAAA]" />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleSettingsClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => { handleLogout(); handleSettingsClose(); }}>
              Logout
            </MenuItem>
          </Menu>

          <Avatar alt="Remy Sharp" src={pic} />
        </div>

      </div>

      <div className="ml-[64px] flex-1">
        <Chats/>
      </div>

    </div>
  );
}
