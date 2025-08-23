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
import Cookies from 'js-cookie';  
import ChatHistory from '@/components/ChatHistory';
import {getSocket, disconnectSocket } from '@/libs/socket';

export default function HomePage() {
  const socket = getSocket();
  const [alignment, setAlignment] = useState('chats');
  const [pic,setPic]= useState('')

  // For dropdown menu of settings
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [selectWaId,setSelectedWaId] = useState('')
  useEffect(() => {
    async function getPic(){
      try {
        let response = await secureFetch('/profile',{},'GET')
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
      // Reset selected chat when switching tabs
      setSelectedWaId('');
    }
  };

  const renderContent = () => {
    switch (alignment) {
      case 'chats':
        return (
          <div className="flex w-full h-full">
            {/* Chat History - Full width on mobile, fixed width on larger screens */}
            <div className={`${selectWaId ? 'hidden md:flex' : 'flex'} w-full md:w-[462px] h-full overflow-hidden`}>
              <ChatHistory onSelectChat={(wa_id) => setSelectedWaId(wa_id)}/>
            </div>
            
            {/* Chat Component - Hidden on mobile when no chat selected */}
            <div className={`${selectWaId ? 'flex' : 'hidden md:flex'} flex-1 h-full overflow-hidden`}>
              <Chats wa_id={selectWaId}/>
            </div>
          </div>
        );
      case 'status':
        return (
          <div className="flex-1 flex items-center justify-center bg-[#161717] text-white">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Status</h2>
              <p className="text-gray-400">Status feature coming soon...</p>
            </div>
          </div>
        );
      case 'channels':
        return (
          <div className="flex-1 flex items-center justify-center bg-[#161717] text-white">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Channels</h2>
              <p className="text-gray-400">Channels feature coming soon...</p>
            </div>
          </div>
        );
      case 'community':
        return (
          <div className="flex-1 flex items-center justify-center bg-[#161717] text-white">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Community</h2>
              <p className="text-gray-400">Community feature coming soon...</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex w-full h-full">
            <div className={`${selectWaId ? 'hidden md:flex' : 'flex'} w-full md:w-[462px] h-full overflow-hidden`}>
              <ChatHistory onSelectChat={(wa_id) => setSelectedWaId(wa_id)}/>
            </div>
            <div className={`${selectWaId ? 'flex' : 'hidden md:flex'} flex-1 h-full overflow-hidden`}>
              <Chats wa_id={selectWaId}/>
            </div>
          </div>
        );
    }
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove('token_test');  
    disconnectSocket(); 
      socket.emit("leaveAllRooms"); 
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Side vertical nav bar - Hidden on mobile, visible on medium+ */}
      <div className="hidden md:flex fixed left-0 top-0 flex-col justify-between items-center bg-[#1D1F1F] h-full w-[64px] px-[12px] py-[10px] z-30">

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

   
        <div className="flex flex-col justify-center items-center gap-4 text-[#A9AAAA]">
          <IconButton 
            aria-label="settings" 
            onClick={handleSettingsClick} 
            color="primary"
 
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

      {/* Main content area */}
      <div className="flex w-full h-full md:ml-[64px]">
        {renderContent()}
      </div>

      {/* Mobile bottom navigation - Only visible on small screens */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1D1F1F] px-4 py-2 z-30">
        <div className="flex justify-between items-center">
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleChange}
            sx={{
              '& .MuiToggleButton-root': {
                border: 'none',
                padding: '8px 12px',
                borderRadius: '10px',
                color: '#A9AAAA',
                minWidth: 'auto',
                '&.Mui-selected': {
                  color: '#FAFAFA',
                },
              },
            }}
          >
            <ToggleButton value="chats" aria-label="chats">
              <MessageSquareText size={20} />
            </ToggleButton>
            <ToggleButton value="status" aria-label="status">
              <CircleFadingPlus size={20} />
            </ToggleButton>
            <ToggleButton value="channels" aria-label="channels">
              <MessageCircleCode size={20} />
            </ToggleButton>
            <ToggleButton value="community" aria-label="community">
              <Users size={20} />
            </ToggleButton>
          </ToggleButtonGroup>
          
          <div className="flex items-center gap-3">
            <IconButton 
              aria-label="settings" 
              onClick={handleSettingsClick} 
              color="primary"
              size="small"
            >
              <Settings className="text-[#A9AAAA]" size={20} />
            </IconButton>
            <Avatar alt="Remy Sharp" src={pic} sx={{ width: 32, height: 32 }} />
          </div>
        </div>
      </div>
    </div>
  );
}