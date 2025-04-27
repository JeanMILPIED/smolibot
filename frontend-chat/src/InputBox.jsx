import React, { useState } from 'react';

function InputBox({ onSend }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex p-4 bg-white">
      <input
        type="text"
        className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 rounded-r-lg"
      >
        Send
      </button>
    </div>
  );
}

export default InputBox;
