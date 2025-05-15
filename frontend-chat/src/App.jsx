import React, { useState } from 'react';
import ChatWindow from './ChatWindow.jsx';
import InputBox from './InputBox.jsx';
import FileUploader from './FileUploader.jsx'
import ImageUploader from './ImageUploader.jsx';

function App() {
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState('tinyllama');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [recentChats, setRecentChats] = useState(() => {
    const saved = sessionStorage.getItem("recentChats");
    return saved ? JSON.parse(saved) : [];
  });
  const [isNewChat, setIsNewChat] = useState(true);
  const [currentChatIndex, setCurrentChatIndex] = useState(null);


  const sendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message, model: selectedModel, history: updatedMessages.slice(-5) }),
      });
      const data = await response.json();

      const botMessage = { sender: 'bot', text: data.response || "No response.", model: selectedModel };
      const fullMessages = [...updatedMessages, botMessage];
      setMessages(fullMessages);

    // Only save to recentChats if this is a new chat
    if (isNewChat) {
      const title = message.slice(0, 30);
      const newChat = { title, messages: fullMessages };
      const updatedChats = [...recentChats, newChat];
      setRecentChats(updatedChats);
      sessionStorage.setItem("recentChats", JSON.stringify(updatedChats));
      setCurrentChatIndex(updatedChats.length - 1);
      setIsNewChat(false);
    } else if (currentChatIndex !== null) {
      const updatedChats = [...recentChats];
      updatedChats[currentChatIndex].messages = fullMessages;
      setRecentChats(updatedChats);
      sessionStorage.setItem("recentChats", JSON.stringify(updatedChats));
    }


    } catch (error) {
      const errorMessage = { sender: 'bot', text: "Error contacting bot!", model: selectedModel  };
      const errorMessages = [...updatedMessages, errorMessage];
      setMessages(errorMessages);
    }
  };

const loadChat = (chat, index) => {
  try {
    if (chat && Array.isArray(chat.messages)) {
      setMessages(chat.messages);
      setIsNewChat(false);
      setCurrentChatIndex(index);
    } else {
      console.warn("Invalid chat format:", chat);
      setMessages([{ sender: 'bot', text: 'Oops, cannot load this chat.' }]);
    }
  } catch (err) {
    console.error("Error loading chat:", err);
    setMessages([{ sender: 'bot', text: 'An error occurred loading this chat.' }]);
  }
};

  return (
    <div className="flex h-screen bg-pink-50">
      {/* Sidebar */}
      <div className="w-64 bg-pink-100 p-4 shadow-inner">
        <h2 className="text-lg font-semibold mb-4">Recent Chats</h2>
        {recentChats.map((chat, idx) => (
          <div
            key={idx}
            className="cursor-pointer text-pink-700 hover:underline"
            onClick={() => loadChat(chat, idx)}
          >
            {chat.title}
          </div>
        ))}
      </div>

      {/* Main column */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-pink-600 text-white p-4 flex items-center justify-between shadow-md">
          <img src="/favicon.ico" alt="Logo" className="w-8 h-8" />
            <div className="text-2xl font-bold">
              Smolibot
            </div>
            <div className="items-center">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="ml-4 p-2 bg-white text-pink-600 rounded shadow"
              >
                <option value="tinyllama">TinyLlama</option>
                <option value="smollm2">SmolLm2</option>
                {/* More models here if needed */}
              </select>
              <button
              onClick={() => {
              setMessages([]);
              setIsNewChat(true);
              setCurrentChatIndex(null);
              fetch(`${'http://localhost:8000'}/reset`, { method: 'POST' }); // Call backend to reset context
              }}
            className="ml-4 px-3 py-1 bg-white text-pink-600 border border-pink-600 rounded hover:bg-pink-100"
              >
                New Chat
              </button>
            </div>
        </div>

      {/* Chat window and input */}
      <div className="flex flex-col flex-1 items-center justify-center overflow-hidden">
        <div className="flex flex-col w-full max-w-3xl bg-white shadow-lg rounded-lg overflow-hidden flex-1">
          <div className="flex-1 overflow-y-auto">
            <ChatWindow messages={messages} isBotTyping={isBotTyping} selectedModel={selectedModel} />
          </div>
          <InputBox onSend={sendMessage} />
          <FileUploader />
          <ImageUploader onExtractText={(text) => sendMessage(text)} />
        </div>
      </div>
    </div>
  </div>
  );
}



export default App;