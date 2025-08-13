'use client';
import { EllipsisVertical, MessageSquarePlus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import secureFetch from '@/utils/securefetch';
import { List, ListItem, ListItemText,Typography } from "@mui/material";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
export default function ChatHistory({onSelectChat}) {
  const [chats, setChats] = useState([]);

  function truncateText(text, maxLength) {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

  useEffect(() => {
    async function getChats() {
      try {
        let response = await secureFetch('/getchats', {}, 'GET');
        if (response.code === 1) {
          setChats(response.data);
          // console.log("Fetched chats:", response.data);
        } else {
          console.log('chat error', response.message.keyword);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getChats();
  }, []);

  return (
    <>
      <div className="w-[462px] flex flex-col bg-black">
        {/* Navbar */}
        <nav className="fixed top-0 bg-[#161717] h-[140px] w-[462px] z-10">
          <div className="flex justify-between items-center px-5 py-4">
            <div className="font-semibold text-[20px] text-white font-sans">WhatsApp</div>
            <div className="flex space-x-3 mr-[30px]">
              <MessageSquarePlus className="text-white cursor-pointer" />
              <EllipsisVertical className="text-white cursor-pointer" />
            </div>
          </div>
          <div className="w-full bg-[#161717] px-4 py-2">
            <div className="flex items-center bg-[#2E2F2F] rounded-full px-3 py-2">
              <Search className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Search or start new chat"
                className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
              />
            </div>
          </div>
        </nav>

        {/* Chat List */}
        <div className="w-[462px] border-r border-gray-300 h-screen overflow-y-auto bg-[#161717] mt-[140px]">
          <List>
            {chats.map((chat, index) => {
              const name =
                chat?.metaData?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name ||
             
                "Unknown";
                
    const timestamp = chat?.metaData?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.timestamp;
    const formattedTime = timestamp
      ? new Date(Number(timestamp) * 1000).toLocaleString():"";
                   
                   const lastMessage = truncateText(
  chat?.metaData?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body,
  30 // max characters before adding "..."
);
const wa_id =   chat?.metaData?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id;
// console.log('loololoolo',wa_id);

              return (
                <ListItem
                  key={index}
                  onClick={() => onSelectChat({wa_id:wa_id,name:name,profilePic:chat.profilePic})}
                  className=" hover:bg-[#242626] cursor-pointer transition "
                   sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
      <ListItemAvatar>
          <Avatar alt="user" src={chat.profilePic} />
        </ListItemAvatar>
                  <ListItemText
                     primary={<span className="text-white font-semibold">{name}</span>}
  secondary={<span className="text-gray-400 text-sm">{lastMessage}</span>}
                  />
                    <span className="text-gray-400 text-xs">{formattedTime}</span>
                </ListItem>
              );
            })}
          </List>
        </div>
      </div>
    </>
  );
}
