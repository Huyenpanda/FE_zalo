import React, { useRef, useEffect } from 'react';
import styles from './ChatWindow.module.css';
import MessageBubble from '../MessageBubble/MessageBubble';
import InputBox from '../InputBox/InputBox';
import { FiPhone, FiVideo, FiInfo } from 'react-icons/fi';

const ChatWindow = ({ conversation, messages, onSendMessage }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!conversation) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>💬</div>
          <h2>Hãy chọn một cuộc trò chuyện</h2>
          <p>Bắt đầu trò chuyện với bạn bè của bạn</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatWindow}>
      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.headerLeft}>
          <img
            src={conversation.avatar}
            alt={conversation.name}
            className={styles.headerAvatar}
          />
          <div className={styles.headerInfo}>
            <h2 className={styles.headerName}>{conversation.name}</h2>
            <p className={styles.headerStatus}>
              {conversation.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.headerBtn} title="Gọi điện">
            <FiPhone />
          </button>
          <button className={styles.headerBtn} title="Gọi video">
            <FiVideo />
          </button>
          <button className={styles.headerBtn} title="Thông tin">
            <FiInfo />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>
            <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isOwn={message.isOwn}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <InputBox onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
