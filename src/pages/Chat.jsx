// Chat.jsx
import React, { useEffect, useState } from 'react';
import { useChat } from '../services/context/ChatContext';
import styles from './Chat.module.css';
import Sidebar from '../components/chat/Sidebar/Sidebar';
import ChatWindow from '../components/chat/ChatWindow/ChatWindow';
import Contacts from '../components/chat/Contacts/Contacts';
import Diary from '../components/chat/Diary/Diary';

const Chat = () => {
  const { conversations, selectedChat, selectChat, loading, isInitializing, fetchConversations, currentUser } = useChat();
  const [currentView, setCurrentView] = useState('messages');

  // Khi Chat mount (sau login), nếu context chưa có data thật thì fetch lại
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    try {
      const user = JSON.parse(userStr);
      const userId = user.id || user._id;
      // Fetch lại mỗi khi vào trang Chat để đảm bảo có API data
      fetchConversations(userId);
    } catch (e) {
      console.error(e);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isInitializing) {
    return (
      <div className={styles.chatContainer}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <Sidebar
        conversations={conversations}
        selectedChat={selectedChat}
        onSelectChat={selectChat}
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
      {currentView === 'diary' && <Diary />}
    </div>
  );
};

export default Chat;