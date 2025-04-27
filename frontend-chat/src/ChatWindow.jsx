import React, { useEffect } from 'react';
import Prism from 'prismjs';  // Import PrismJS for code highlighting
import 'prismjs/themes/prism-tomorrow.css';  // Import a PrismJS theme

function ChatWindow({ messages }) {
  useEffect(() => {
    // Apply syntax highlighting when messages change
    Prism.highlightAll();
  }, [messages]);  // Runs every time messages update

  // Function to format messages (e.g., wrap code blocks in <pre><code>)
  const formatMessage = (message) => {
    // Match code blocks (enclosed by triple backticks) and wrap them in <pre><code> tags
    return message.replace(/```(.*?)```/gs, (match, code) => {
      return `<pre><code class="language-javascript">${code}</code></pre>`;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, idx) => (
        <div key={idx} className={`my-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
          <span
            className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-pink-500 text-white'}`}
            // Apply white-space pre-wrap for preserving line breaks
            style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}  // Insert formatted message with code
          />
        </div>
      ))}
    </div>
  );
}

export default ChatWindow;
