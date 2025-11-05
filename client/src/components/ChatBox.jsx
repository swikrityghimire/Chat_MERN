import React, { useEffect, useState } from "react";
import socket from "../socket"; 

function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [usersOnline, setUsersOnline] = useState(0);
  const [totalChats, setTotalChats] = useState(0);

  useEffect(() => {
    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setTotalChats((prev) => prev + 1);
    });

    socket.on("users count", (count) => {
      setUsersOnline(count);
    });

    return () => {
      socket.off("chat message");
      socket.off("users count");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h3>Total Users Online: {usersOnline}</h3>

      <div
        style={{
          border: "1px solid black",
          height: "200px",
          overflowY: "scroll",
          margin: "10px",
          padding: "5px",
        }}
      >
        {messages.length === 0 ? (
          <p>No messages yet...</p>
        ) : (
          messages.map((msg, index) => <p key={index}>{msg}</p>)
        )}
      </div>

      <p>👥 Users Online: {usersOnline}  Total Chats: {totalChats}</p>

      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatBox;
