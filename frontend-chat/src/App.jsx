import React, { useState } from 'react';
import ChatWindow from './ChatWindow.jsx';
import InputBox from './InputBox.jsx';

function App() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await response.json();

      const botMessage = { sender: 'bot', text: data.response || "No response." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'bot', text: "Error contacting bot!" };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-pink-50">
      <div className="flex flex-col w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="text-2xl font-bold p-4 bg-pink-600 text-white">
          Welcome to Smolibot
        </div>
        <ChatWindow messages={messages} />
        <InputBox onSend={sendMessage} />
      </div>
    </div>
  );
}

export default App;
