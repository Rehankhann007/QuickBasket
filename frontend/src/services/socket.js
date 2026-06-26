import { io } from "socket.io-client";

let socket = null;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const connectSocket = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ["websocket"],
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};