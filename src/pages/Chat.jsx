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
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    try {
      const user = JSON.parse(userStr);
      const userId = user.id || user._id;
      fetchConversations(userId);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSelectChat = (conv) => {
    selectChat(conv);
    if (window.innerWidth < 640) setShowSidebar(false);
  };

  if (isInitializing) {
    return (
      <div className={styles.chatContainer}>
        <div className={styles.loadingText}>
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  const isMobile = window.innerWidth < 640;

  return (
    <div className={styles.chatContainer}>
      {isMobile && showSidebar ? (
        <Sidebar
          conversations={conversations}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
          loading={loading}
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      ) : isMobile ? (
        <div className={styles.mobileChatWrap}>
          {currentView === 'messages' && <ChatWindow selectedChat={selectedChat} loading={loading} onBack={() => setShowSidebar(true)} />}
          {currentView === 'contacts' && <Contacts onViewChange={setCurrentView} />}
          {currentView === 'diary' && <Diary />}
        </div>
      ) : (
        <>
          <Sidebar
            conversations={conversations}
            selectedChat={selectedChat}
            onSelectChat={selectChat}
            loading={loading}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
          {currentView === 'messages' && <ChatWindow selectedChat={selectedChat} loading={loading} />}
          {currentView === 'contacts' && <Contacts onViewChange={setCurrentView} />}
          {currentView === 'diary' && <Diary />}
        </>
      )}
    </div>
  );
};

export default Chat;