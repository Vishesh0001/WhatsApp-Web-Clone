import secureFetch from "@/utils/securefetch";
import { useEffect,useState } from "react";
import { Clock,Check,CheckCheck } from "lucide-react";
import Avatar from '@mui/material/Avatar';
export default function Chats({wa_id}){
const[messages, setMessages] = useState([])
// console.log('wwwwaaaaaa',wa_id);
let waId = wa_id.wa_id
let name = wa_id.name
let profilePic = wa_id.profilePic
useEffect(()=>{
if(wa_id){
  async function getmessages(){
    const response = await secureFetch('/getmessages',{waId},'POST');
    console.log('mesage response',response);
    if(response.code == 1){
      setMessages(response.data)
    }
  }
  getmessages();
}

},[wa_id]);
 const formatTime = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
 const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };


if(!wa_id){
  return(
    <div className=" flex-1 flex items-center justify-center bg-black w-[1010px] h-auto">
      <img src='https://i.gadgets360cdn.com/large/whatsapp_multi_device_support_update_image_1636207150180.jpg'       alt="Placeholder"
          className="w-64 opacity-70"/>
    </div>
  )
}
return(
  <div className="relative bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-cover bg-center">
  <div className="flex-1 flex flex-col bg-[#161717]/80  w-[1010px] h-screen">
      
      <div className="bg-[#161717] h-[64px] px-6 py-4 flex items-center shadow-black">
        <Avatar alt="user" src={profilePic} />
        <div>
          <h3 className="ml-4 font-semibold text-white">{name}</h3>
          {/* <p className="text-sm text-gray-500">Online</p> */}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4  ">
        {messages.map((message) => {
          const isOwnMessage = message.from == waId;
          console.log('isown',message.from,waId,message.status)
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
                  isOwnMessage
                    ? 'bg-[#144D37] text-white'
                    : 'bg-[#242626] text-white'
                }`}
              >
                <p className="text-sm">{message.text.body}</p>
                
                <div className={`flex items-center justify-end mt-1 space-x-1 ${
                  isOwnMessage ? 'text-white' : 'text-gray-500'
                }`}>
                  <span className="text-xs">
                    {formatTime(message.timestamp)}
                  </span>
                  {isOwnMessage && (
                    <div className="flex items-center">
                      {getStatusIcon(message.status)}
                    </div>
                  )}
                </div>
                
            
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Input Placeholder */}
      <div className="  px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 bg-[#242626] rounded-full px-4 py-2">
            <span className="text-gray-500 rounded-full">Type a message...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)


}