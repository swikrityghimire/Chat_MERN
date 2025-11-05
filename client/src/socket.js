import { io } from "socket.io-client";

export const socket = io("http://localhost:8000", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
