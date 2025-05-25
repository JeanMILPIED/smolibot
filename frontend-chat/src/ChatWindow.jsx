import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

function ChatWindow({ messages, isBotTyping, selectedModel}) {
  useEffect(() => {
    Prism.highlightAll();
  }, [messages]);

const formatMessage = (message) => {
  if (!message || typeof message !== 'string') return '';
  return message.replace(/```(.*?)```/gs, (match, code) => {
    return `<pre><code class="language-javascript">${code}</code></pre>`;
  });
};

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`my-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className="flex items-start gap-2 max-w-[80%]">
            {msg.sender === 'bot' && (
              <img
                src="/favicon.ico"
                alt="Bot icon"
                className="w-6 h-6"
              />
            )}
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-pink-500 text-white'
              }`}
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
            />
            {msg.sender === 'bot' && (
                <div className="text-xs italic text-gray-400 mt-1">
                  Generated locally by {selectedModel}
                </div>
              )}
          </div>
        </div>
      ))}

      {/* Typing indicator */}
      {isBotTyping && (
        <div className="flex justify-start items-center gap-2 my-2">
          <img src="/favicon.ico" alt="Bot typing..." className="w-6 h-6 animate-spin" />
          <div className="bg-pink-300 text-white px-3 py-1 rounded-lg animate-pulse">
            Smolibot is typing...
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWindow;


