import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let chatHistory = [];
let onlineUsers = 0; 
io.on("connection", (socket) => {
  onlineUsers++;
  console.log("New client connected:", socket.id);

  socket.emit("chat_history", chatHistory);
  io.emit("online_users", onlineUsers);

  socket.on("set_username", (username) => {
    socket.username = username;
    console.log(`${username} joined the chat.`);
    io.emit("user_joined", `${username} joined the chat.`);
  });

  socket.on("send_message", (message) => {
    const data = {
      id: socket.id,
      username: socket.username || "Anonymous",
      message,
    };
    chatHistory.push(data);
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    onlineUsers--;
    console.log("Client disconnected:", socket.id);
    if (socket.username) {
      io.emit("user_left", `${socket.username} left the chat.`);
    }
    io.emit("online_users", onlineUsers);
  });
});

server.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
