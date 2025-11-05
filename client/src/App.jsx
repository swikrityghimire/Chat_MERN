import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

// Predefined colors for users
const colors = [
  "#d5879bff", "#043c0bff", "#02293eff", "#273155ff",
  "#483120ff", "#362f38ff", "#0d2d2dff", "#837d83ff",
  "#272b1cff", "#fabebe", "#008080", "#36273fff"
];

function App() {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [userColors, setUserColors] = useState({});
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("chat_history", (history) => {
      const formatted = history.map((msg) => {
        assignColor(msg.username);
        return msg;
      });
      setChat(formatted);
    });

    socket.on("receive_message", (data) => {
      assignColor(data.username);
      setChat((prev) => [...prev, data]);
    });

    socket.on("user_joined", (msg) => {
      setChat((prev) => [...prev, { message: `${msg}`, system: true }]);
    });
    socket.on("user_left", (msg) => {
      setChat((prev) => [...prev, { message: `${msg}`, system: true }]);
    });

    socket.on("online_users", (count) => {
      setOnlineUsers(count);
    });

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
      socket.off("user_joined");
      socket.off("user_left");
      socket.off("online_users");
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleLogin = () => {
    if (username.trim() === "") return;
    socket.emit("set_username", username);
    setLoggedIn(true);
    assignColor(username);
  };

  const assignColor = (name) => {
    setUserColors((prev) => {
      if (!prev[name]) {
        const availableColors = colors.filter((c) => !Object.values(prev).includes(c));
        prev[name] = availableColors.length > 0 ? availableColors[0] : "#000000";
      }
      return { ...prev };
    });
  };

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("send_message", message);
    setMessage("");
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Enter your username</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <button onClick={handleLogin}>Join Chat</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Chat Box</h2>
      <p>Online users: {onlineUsers}</p>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
          height: "300px",
          overflowY: "auto",
        }}
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            style={{
              color: msg.system ? "#888" : userColors[msg.username],
              textAlign: msg.username === username ? "right" : "left",
              fontWeight: msg.system ? "normal" : "bold",
              margin: "3px 0",
            }}
          >
            {msg.system ? msg.message : `${msg.username}: ${msg.message}`}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "80%", padding: "5px" }}
      />
      <button onClick={sendMessage} style={{ padding: "5px 10px", marginLeft: "5px" }}>
        Send
      </button>
    </div>
  );
}

export default App;
