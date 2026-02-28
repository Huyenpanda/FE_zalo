import React, { useEffect } from 'react';
import { useChat } from '../services/context/ChatContext';
import styles from './Chat.module.css';
import Sidebar from '../components/chat/Sidebar/Sidebar';
import ChatWindow from '../components/chat/ChatWindow/ChatWindow';

const Chat = () => {
  const { 
    conversations, 
    selectedChat, 
    selectChat,
    fetchConversations,
    loading 
  } = useChat();

  useEffect(() => {
    // Fetch conversations khi component mount
    fetchConversations();
  }, []);

  return (
    <div className={styles.chatContainer}>
      <Sidebar 
        conversations={conversations}
        selectedChat={selectedChat}
        onSelectChat={selectChat}
        loading={loading}
      />
      <ChatWindow 
        selectedChat={selectedChat}
        loading={loading}
      />
    </div>
  );
};

export default Chat;