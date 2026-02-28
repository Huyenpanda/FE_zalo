import React from 'react';
import styles from './MessageBubble.module.css';

const MessageBubble = ({ message }) => {
  if (message.type === 'date') {
    return (
      <div className={styles.dateLabel}>
        <span>{message.content}</span>
      </div>
    );
  }

  const isSent = message.type === 'sent';

  return (
    <div className={`${styles.messageWrapper} ${isSent ? styles.sent : styles.received}`}>
      {!isSent && message.sender && (
        <div className={styles.senderAvatar}>
          <img src="https://ui-avatars.com/api/?name=GH&background=0084ff&color=fff" alt="sender" />
        </div>
      )}
      
      <div className={styles.messageContent}>
        {message.isSticker ? (
          <div className={styles.stickerContainer}>
            <img 
              src="https://via.placeholder.com/120x120/f0f0f0/999?text=Sorry" 
              alt="sticker" 
              className={styles.sticker}
            />
          </div>
        ) : (
          <div className={styles.messageBubble}>
            <p className={styles.messageText}>{message.content}</p>
          </div>
        )}
        
        <div className={styles.messageFooter}>
          <span className={styles.messageTime}>{message.time}</span>
          {message.reactions && message.reactions.length > 0 && (
            <div className={styles.reactions}>
              {message.reactions.map((reaction, index) => (
                <span key={index} className={styles.reaction}>{reaction}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;