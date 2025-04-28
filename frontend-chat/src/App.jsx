import React, { useState } from 'react';
import ChatWindow from './ChatWindow.jsx';
import InputBox from './InputBox.jsx';

function App() {
  const [messages, setMessages] = useState([]);
  const [model, setModel] = useState('tinyllama');

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message, model: model }),
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
    <div className="flex flex-col h-screen bg-pink-50">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-pink-600 text-white p-4 flex items-center justify-between shadow-md">
  	<div className="flex items-center space-x-4">
    	<img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
    	  <div className="text-2xl font-bold">
      		Smolibot
    	  </div>
  	</div>

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="ml-4 p-2 bg-white text-pink-600 rounded shadow"
        >
          <option value="tinyllama">TinyLlama</option>
          <option value="tinyphi">TinyPhi</option>
          {/* More models here if needed */}
        </select>
      </div>

      {/* Chat window and input */}
      <div className="flex flex-col flex-1 items-center justify-center overflow-hidden">
        <div className="flex flex-col w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden flex-1">
          {/* Chat scrollable area */}
          <div className="flex-1 overflow-y-auto">
            <ChatWindow messages={messages} />
          </div>

          {/* Input box fixed at bottom of card */}
          <InputBox onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}

export default App;

