import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Message from './Message';

const socket = io('http://localhost:4000');

const Chat = ({ username }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join', username);

    socket.on('chat message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('chat message');
    };
  }, [username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', { message });
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <Message key={index} user={msg.user} message={msg.message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;