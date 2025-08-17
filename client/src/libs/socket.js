import { io } from "socket.io-client";

let socket;
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL
export const getSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      autoConnect: true,
    });
  }
  return socket;
};
