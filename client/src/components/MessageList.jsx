import React from "react";

const MessageList = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto mb-3 border rounded-lg p-3 bg-gray-50 h-64">
      {messages.length === 0 ? (
        <p className="text-gray-400 text-center">No messages yet...</p>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className="mb-1">
            <span className="text-gray-700">{msg}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;
