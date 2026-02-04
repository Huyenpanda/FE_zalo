import React from 'react';
import styles from './MessageBubble.module.css';

const MessageBubble = ({ message, isOwn }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`${styles.messageBubble} ${isOwn ? styles.own : styles.other}`}>
      {!isOwn && (
        <img
          src={message.avatar}
          alt="avatar"
          className={styles.avatar}
        />
      )}
      <div className={`${styles.bubble} ${isOwn ? styles.own : styles.other}`}>
        {message.text && (
          <p className={styles.text}>{message.text}</p>
        )}
        {message.image && (
          <img src={message.image} alt="message" className={styles.image} />
        )}
        <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
