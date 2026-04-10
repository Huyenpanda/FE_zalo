//Chat.jsx
import React, { useEffect, useState } from 'react';
import { useChat } from '../services/context/ChatContext';
import styles from './Chat.module.css';
import Sidebar from '../components/chat/Sidebar/Sidebar';
import ChatWindow from '../components/chat/ChatWindow/ChatWindow';
import Contacts from '../components/chat/Contacts/Contacts';

const Chat = () => {
  const { 
    conversations, 
    selectedChat, 
    selectChat,
    loading 
  } = useChat();
  // BỎ fetchConversations ở đây — ChatContext đã fetch trong useEffect rồi

  const [currentView, setCurrentView] = useState('messages');

  return (
    <div className={styles.chatContainer}>
      <Sidebar 
        conversations={conversations}
        selectedChat={selectedChat}
        onSelectChat={selectChat} // đảm bảo đây là selectChat từ context
        loading={loading}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      {currentView === 'messages' && (
        <ChatWindow 
          selectedChat={selectedChat}
          loading={loading}
        />
      )}
      {currentView === 'contacts' && <Contacts onViewChange={setCurrentView} />}
    </div>
  );
};

export default Chat;