import { io } from "socket.io-client";

let socket;
const BACKEND_URL =  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000' 
export const getSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      autoConnect: true,
    });
  }
  return socket;
};
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
