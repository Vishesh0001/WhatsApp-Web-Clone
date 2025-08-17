import { io } from "socket.io-client";

let socket;
const BACKEND_URL = "https://whatsapp-web-clone-2ldr.onrender.com" || process.env.NEXT_PUBLIC_SERVER_URL 
export const getSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      autoConnect: true,
    });
  }
  return socket;
};
