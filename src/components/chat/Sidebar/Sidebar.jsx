import React, { useState } from 'react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { AiOutlineEllipsis } from 'react-icons/ai';
import styles from './Sidebar.module.css';

const Sidebar = ({ conversations, activeConversation, onSelectConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Tin nhắn</h1>
        <div className={styles.headerActions}>
          <button className={styles.iconButton} title="Thêm cuộc hội thoại">
            <FiPlus size={20} />
          </button>
          <button className={styles.iconButton} title="Thêm tùy chọn">
            <AiOutlineEllipsis size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchContainer}>
        <FiSearch className={styles.searchIcon} size={18} />
        <input
          type="text"
          placeholder="Tìm kiếm cuộc hội thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {/* Conversations List */}
      <div className={styles.conversationsList}>
        {filteredConversations.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Không có cuộc hội thoại nào</p>
          </div>
        ) : (
          filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              className={`${styles.conversationItem} ${
                activeConversation?.id === conversation.id ? styles.active : ''
              }`}
              onClick={() => onSelectConversation(conversation)}
            >
              {/* Avatar */}
              <div className={styles.avatarContainer}>
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className={styles.avatar}
                />
                {conversation.isOnline && (
                  <span className={styles.onlineIndicator}></span>
                )}
              </div>

              {/* Content */}
              <div className={styles.content}>
                <div className={styles.header2}>
                  <h3 className={styles.name}>{conversation.name}</h3>
                  <span className={styles.timestamp}>{conversation.timestamp}</span>
                </div>
                <p className={styles.lastMessage}>{conversation.lastMessage}</p>
              </div>

              {/* Unread Badge */}
              {conversation.unreadCount > 0 && (
                <div className={styles.unreadBadge}>
                  {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
