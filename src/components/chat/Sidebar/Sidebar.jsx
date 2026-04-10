import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';

import SettingsModal from '../Modals/SettingsModal';
import CloudPanel from '../Modals/CloudPanel';
import ToolsPanel from '../Modals/ToolsPanel';
import { useChat } from '../../../services/context/ChatContext';
import { useNavigate } from 'react-router-dom';
const Sidebar = ({ conversations, selectedChat, onSelectChat, onViewChange, currentView }) => {
  const navigate = useNavigate();
  const { currentUser } = useChat(); //
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeNav, setActiveNav] = useState(currentView || 'messages');

    // Modal states
  const [showSettings, setShowSettings] = useState(false);
  const [showCloud, setShowCloud] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const handleLogout = () => {
    // clear any user data here if needed
    setShowSettings(false);
    // redirect or perform logout logic
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactsClick = () => {
    setActiveNav('contacts');
    if (onViewChange) {
      onViewChange('contacts');
    }
  };

  const handleMessagesClick = () => {
    setActiveNav('messages');
    if (onViewChange) {
      onViewChange('messages');
    }
  };

  const isContactsView = currentView === 'contacts';

  useEffect(() => {
    setActiveNav(currentView);
  }, [currentView]);

  return (
    <>
    <div className={styles.sidebarContainer}>
      {/* Left Navigation Bar */}
      <div className={styles.leftNav}>
        <div className={styles.navTop}>
          <div className={styles.userAvatar}>
         


<img
  src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'User')}&background=0084ff&color=fff`} 
    alt="User" 
  onClick={() => navigate('/profile')}
  style={{ cursor: 'pointer' }}
/>
          </div>
          
          <button 
            className={`${styles.navItem} ${activeNav === 'messages' ? styles.active : ''}`}
            onClick={handleMessagesClick}
            title="Tin nhắn"
          >
            <i className="fas fa-comment-dots"></i>
            <span className={styles.navBadge}>5+</span>
          </button>

          <button 
            className={`${styles.navItem} ${activeNav === 'contacts' ? styles.active : ''}`}
            onClick={handleContactsClick}
            title="Danh bạ"
          >
            <i className="fas fa-address-book"></i>
          </button>

        </div>

        <div className={styles.navBottom}>
            <button 
              className={styles.navItem} 
              title="Cloud của tôi"
              onClick={() => setShowCloud(true)}
            >
              <i className="fas fa-cloud"></i>
            </button>

            <button 
              className={styles.navItem} 
              title="Công cụ"
              onClick={() => setShowTools(true)}
            >
              <i className="fas fa-briefcase"></i>
            </button>

            <button 
              className={styles.navItem} 
              title="Cài đặt"
              onClick={() => setShowSettings(true)}
            >
              <i className="fas fa-cog"></i>
            </button>
          </div>
        
      </div>

      {!isContactsView && (
        <div className={styles.sidebar}>
          {/* Header */}
      <div className={styles.header}>
        <div className={styles.userProfile}>
          <div className={styles.avatar}>
            

<img
  src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'User')}&background=0084ff&color=fff`} 
    alt="User" 
  onClick={() => navigate('/profile')}
  style={{ cursor: 'pointer' }}
/>
           
            <div className={styles.onlineStatus}></div>
          </div>
        </div>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Action Icons */}
        <div className={styles.actions}>
          <button className={styles.actionBtn}>
            <i className="fas fa-user-plus"></i>
          </button>
          <button className={styles.actionBtn}>
            <i className="fas fa-users"></i>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Ưu tiên
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'other' ? styles.active : ''}`}
          onClick={() => setActiveTab('other')}
        >
          Khác
          {conversations.filter(c => c.unread).length > 0 && (
            <span className={styles.tabBadge}>
              {conversations.filter(c => c.unread).length}
            </span>
          )}
        </button>
        <button className={styles.filterBtn}>
          <i className="fas fa-filter"></i>
        </button>
        <button className={styles.moreBtn}>
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>

      {/* Conversation List */}
      <div className={styles.conversationList}>
        {filteredConversations.map((conv) => (
          <div
            key={conv.id}
            className={`${styles.conversationItem} ${
              selectedChat?.id === conv.id ? styles.selected : ''
            }`}
            onClick={() => onSelectChat(conv)}
          >
            <div className={styles.conversationAvatar}>
              <img src={conv.avatar} alt={conv.name} />
              {conv.online && <div className={styles.onlineBadge}></div>}
              {conv.group && <div className={styles.groupBadge}>{conv.group}</div>}
            </div>

            <div className={styles.conversationContent}>
              <div className={styles.conversationHeader}>
                <h3 className={styles.conversationName}>
                  {conv.name}
                  {conv.official && <i className={styles.verifiedBadge}>✓</i>}
                </h3>
                <span className={styles.conversationTime}>{conv.time}</span>
              </div>
              <div className={styles.conversationFooter}>
                <p className={styles.lastMessage}>{conv.lastMessage}</p>
                {conv.unread > 0 && (
                  <span className={styles.unreadBadge}>{conv.unread}</span>
                )}
              </div>
            </div>

            {conv.pinned && (
              <div className={styles.pinnedIcon}>
                <i className="fas fa-thumbtack"></i>
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
      )}
    </div>

      {/* Modals & Panels */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        onLogout={handleLogout}
      />
      <CloudPanel 
        isOpen={showCloud} 
        onClose={() => setShowCloud(false)} 
      />
      <ToolsPanel 
        isOpen={showTools} 
        onClose={() => setShowTools(false)} 
      />
    </>
  );
};

export default Sidebar;