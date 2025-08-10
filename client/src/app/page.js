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

export default function HomePage() {
  
  const [alignment, setAlignment] = useState('chats');

const[pic,setPic]= useState('')
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
// console.log('pic',pic);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
    // console.log(alignment);
    
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
      <IconButton aria-label="settings" disabled color="primary">
        <Settings className="text-[#A9AAAA]" />
      </IconButton>
      <Avatar alt="Remy Sharp" src={pic}/>
    </div>

  </div>

  <div className="ml-[64px] flex-1">
    <Chats/>
  </div>

</div>

  );
}

