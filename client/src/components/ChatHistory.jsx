// 'use client';
// import { EllipsisVertical, MessageSquarePlus, Search } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import secureFetch from '@/utils/securefetch';
// import { List, ListItem, ListItemText } from "@mui/material";
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Avatar from '@mui/material/Avatar';
// import Cookies from 'js-cookie';
// import { jwtVerify } from 'jose';
// import { getSocket } from '../libs/socket';

// export default function ChatHistory({onSelectChat}) {
//       const socket = getSocket();       
//       const [conversation_id, setConversationId] = useState(null);
    
//       const [name, setName] = useState("");
//       const [profilePic, setProfilePic] = useState("");
//       const [from, setFrom] = useState(null);
//   const [chats, setChats] = useState([]);
//   const [role, setRole] = useState(null);
// const[waId,setWaID] = useState('')
//   useEffect(() => {
//     const decodeToken = async () => {
//       try {
//         const token = Cookies.get('token_test');
//         if (!token) return;

//         const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

//         const { payload } = await jwtVerify(token, secret);
//         setWaID(payload.wa_id)
//         // console.log('Decoded payload:', payload);
//         setRole(payload.r); 
//       } catch (err) {
//         console.error('Token verification failed:', err);
//       }
//     };
//         decodeToken();
//   }, []);
//   console.log('Role:', role, 'waId:', waId);
  

//   function truncateText(text, maxLength) {
//   if (!text) return "";
//   return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
// }

//   useEffect(() => {
//     async function getChats() {
//       try {
//         let response = await secureFetch('/getchats', {}, 'GET');
//         if (response.code === 1) {
//           setChats(response.data);
//           // console.log("Fetched chats:", response.data);
//         } else {
//           console.log('chat error', response.message.keyword);
//         }
//       } catch (error) {
//         console.log(error.message);
//       }
//     }
//     getChats();
//   }, []);

//   return (
// //   
//    <div className="w-full h-full flex flex-col bg-[#161717] overflow-hidden">
   
//       <nav className="bg-[#161717] flex-shrink-0 ">
//         <div className="flex justify-between items-center px-4 md:px-5 py-3 md:py-4">
//           <div className="font-semibold text-lg md:text-[20px] text-white font-sans">WhatsApp</div>
//           <div className="flex space-x-2 md:space-x-3">
//             <MessageSquarePlus className="text-white cursor-pointer w-5 h-5 md:w-6 md:h-6" />
//             <EllipsisVertical className="text-white cursor-pointer w-5 h-5 md:w-6 md:h-6" />
//           </div>
//         </div>
        
//         <div className="px-3 md:px-4 pb-3 md:pb-4">
//           <div className="flex items-center bg-[#2E2F2F] rounded-full px-3 py-2">
//             <Search className="text-gray-400 w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
//             <input
//               type="text"
//               placeholder="Search or start new chat"
//               className="bg-transparent outline-none text-white placeholder-gray-400 w-full text-sm md:text-base"
//             />
//           </div>
//         </div>
//    <div className="flex items-center gap-2 px-6 py-2  text-gray-400 rounded-full text-sm">
//       <span className='bg-[#103529] px-4 py-1 rounded-full border hover:bg-gray-300 '>All</span>
//             <span className=' px-4 py-1 rounded-full border hover:bg-gray-300'>Unread</span>
//                   <span className=' px-4 py-1 rounded-full border hover:bg-gray-300'>Favorites</span>
//                         <span className=' px-4 py-1 rounded-full border hover:bg-gray-300'>Groups</span>
//       </div>
//       </nav>


//       <div className="flex-1 overflow-y-auto">
//         <List sx={{ padding: 0 }}>
//           {chats.map((chat, index) => {
            
//     setName(chat?.name ||"Unknown");
//     let timestamp = chat?.timestamp;
//       setFrom(chat?.from)
//     //  console.log(from_wa_id,'from');
     
//     let formattedTime = timestamp
//       ? new Date(Number(timestamp) * 1000).toLocaleString():"";
//   let lastMessage = truncateText(chat?.text?.body,30 );
// setConversationId(chat?.conversationId)
// setProfilePic(chat?.profilePic)
// if(role=='customer'){
//   setName('Home Decor');
// setProfilePic('https://placehold.co/600x400?text=Home+Decor')
// }
// // console.log('loololoolo',wa_id);

//             return (
//               <ListItem
//                 key={index}
//                 onClick={() => {
                  
//     socket.emit("chatOpened", {
//       conversation_id: conversation_id,
//       waid: waId,

//     });
//     onSelectChat({conversation_id:conversation_id,waid:waId,name:name,profilePic:profilePic,role:role,from:from})
//   }}
//                 className="hover:bg-[#242626] cursor-pointer transition"
//                 sx={{ 
//                   display: "flex", 
//                   justifyContent: "space-between", 
//                   alignItems: "center",
//                   padding: { xs: '12px 16px', md: '16px 20px' },
                
//                 }}
//               >
//                 <ListItemAvatar sx={{ minWidth: { xs: '48px', md: '56px' } }}>
//                   <Avatar 
//                     alt="user" 
//                     src={profilePic} 
//                     sx={{ 
//                       width: { xs: 40, md: 48 }, 
//                       height: { xs: 40, md: 48 } 
//                     }}
//                   />
//                 </ListItemAvatar>
                
//                 <ListItemText
//                   primary={
//                     <span className="text-white font-semibold text-sm md:text-base line-clamp-1">
//                       {name}
//                     </span>
//                   }
//                   secondary={
//                     <span className="text-gray-400 text-xs md:text-sm line-clamp-1 mt-1">
//                       {lastMessage}
//                     </span>
//                   }
//                   sx={{ 
//                     margin: 0,
//                     '& .MuiListItemText-primary': {
//                       marginBottom: '2px'
//                     }
//                   }}
//                 />
                
//                 <div className="flex flex-col items-end justify-center ml-2">
//                   <span className="text-gray-400 text-xs whitespace-nowrap">
//                     {/* {new Date(Number(timestamp) * 1000).toLocaleTimeString([], { 
//                       hour: '2-digit', 
//                       minute: '2-digit' 
//                     })} */}
//                     {formattedTime}
//                   </span>
//                 </div>
//               </ListItem>
//             );
//           })}
//         </List>
//       </div>
      
//       {/* Mobile bottom padding to account for bottom navigation */}
//       <div className="md:hidden h-16 flex-shrink-0"></div>
//     </div>
//   );
// }
'use client';
import { EllipsisVertical, MessageSquarePlus, Search } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import secureFetch from '@/utils/securefetch';
import { List, ListItem, ListItemText } from "@mui/material";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Cookies from 'js-cookie';
import { jwtVerify } from 'jose';
import { getSocket } from '../libs/socket';

export default function ChatHistory({ onSelectChat }) {
  const socket = getSocket();
  const [chats, setChats] = useState([]);
  const [role, setRole] = useState(null);
  const [waId, setWaID] = useState('');

  useEffect(() => {
    const decodeToken = async () => {
      try {
        const token = Cookies.get('token_test');
        if (!token) return;

        const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        setWaID(payload.wa_id);
        setRole(payload.r);
      } catch (err) {
        console.error('Token verification failed:', err);
      }
    };
    decodeToken();
  }, []);

  const truncateText = useCallback((text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  }, []);

  useEffect(() => {
    async function getChats() {
      try {
        let response = await secureFetch('/getchats', {}, 'GET');
        if (response.code === 1) {
          setChats(response.data);
        } else {
          console.log('chat error', response.message.keyword);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getChats();
  }, []);

  const handleSelectChat = useCallback((conversation_id, waId, originalName, originalProfilePic, from, role) => {
    let name = originalName;
    let profilePic = originalProfilePic;

    // if (role === 'customer') {
    //   name = 'Home Decor';
    //   profilePic = 'https://placehold.co/600x400?text=Home+Decor';
    // }

    socket.emit("chatOpened", {
      conversation_id: conversation_id,
      waid: waId,
    });
    onSelectChat({ conversation_id: conversation_id, waid: waId, name: name, profilePic: profilePic, role: role, from: from });
  }, [socket, onSelectChat]);
  return (
    <div className="w-full h-full flex flex-col bg-[#161717] overflow-hidden">
      <nav className="bg-[#161717] flex-shrink-0 ">
        <div className="flex justify-between items-center px-4 md:px-5 py-3 md:py-4">
          <div className="font-semibold text-lg md:text-[20px] text-white font-sans">WhatsApp</div>
          <div className="flex space-x-2 md:space-x-3">
            <MessageSquarePlus className="text-white cursor-pointer w-5 h-5 md:w-6 md:h-6" />
            <EllipsisVertical className="text-white cursor-pointer w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>

        <div className="px-3 md:px-4 pb-3 md:pb-4">
          <div className="flex items-center bg-[#2E2F2F] rounded-full px-3 py-2">
            <Search className="text-gray-400 w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="bg-transparent outline-none text-white placeholder-gray-400 w-full text-sm md:text-base"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 px-6 py-2  text-gray-400 rounded-full text-sm">
          <span className='bg-[#103529] px-4 py-1 rounded-full border hover:bg-gray-300 '>All</span>
          <span className=' px-4 py-1 rounded-full border hover:bg-gray-300'>Unread</span>
          <span className=' px-4 py-1 rounded-full border hover:bg-gray-300'>Favorites</span>
          <span className=' px-4 py-1 rounded-full border hover:bg-gray-300'>Groups</span>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto">
        <List sx={{ padding: 0 }}>
         {role && chats.map((chat, index) => { // Conditionally render when role is available
            const conversationId = chat?.conversationId;
            let name = chat?.name || "Unknown";
            let timestamp = chat?.timestamp;
            let from = chat?.from;
            let formattedTime = timestamp ? new Date(Number(timestamp) * 1000).toLocaleString() : "";
            let lastMessage = truncateText(chat?.text?.body, 30);
            let profilePic = chat?.profilePic;


            return (
              <ListItem
                key={index}
                onClick={() => {
                  handleSelectChat(conversationId, waId, name, profilePic, role, from);
                }}
                className="hover:bg-[#242626] cursor-pointer transition"
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: { xs: '12px 16px', md: '16px 20px' },
                }}
              >
                <ListItemAvatar sx={{ minWidth: { xs: '48px', md: '56px' } }}>
                  <Avatar
                    alt="user"
                    src={profilePic}
                    sx={{
                      width: { xs: 40, md: 48 },
                      height: { xs: 40, md: 48 }
                    }}
                  />
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <span className="text-white font-semibold text-sm md:text-base line-clamp-1">
                      {name}
                    </span>
                  }
                  secondary={
                    <span className="text-gray-400 text-xs md:text-sm line-clamp-1 mt-1">
                      {lastMessage}
                    </span>
                  }
                  sx={{
                    margin: 0,
                    '& .MuiListItemText-primary': {
                      marginBottom: '2px'
                    }
                  }}
                />

                <div className="flex flex-col items-end justify-center ml-2">
                  <span className="text-gray-400 text-xs whitespace-nowrap">
                    {formattedTime}
                  </span>
                </div>
              </ListItem>
            );
          })}
        </List>
      </div>

      <div className="md:hidden h-16 flex-shrink-0"></div>
    </div>
  );
}