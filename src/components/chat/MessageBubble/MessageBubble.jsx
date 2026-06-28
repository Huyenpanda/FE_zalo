import React from 'react';
import styles from './MessageBubble.module.css';

const MessageBubble = ({ message, currentUserId }) => {
  if (message.type === 'date') {
    return (
      <div className={styles.dateLabel}>
        <span>{message.content}</span>
      </div>
    );
  }


// Thêm fallback currentUserId rõ ràng hơn
  const isSent = 
    message.type === 'sent' || 
    message.senderId === 'me' ||
    Boolean(
      currentUserId && 
      message.senderId && 
      String(message.senderId) === String(currentUserId)
    );

  const hasAttachments = message.attachments && message.attachments.length > 0;
  const isImageContent = message.contentType === 'image' || 
                         message.type === 'IMAGE';
  const isFileContent = message.contentType === 'file' || 
                        message.type === 'FILE';

  // Format time từ createdAt nếu không có sẵn time
  const displayTime = message.time || (
    message.createdAt 
      ? new Date(message.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      : ''
  );

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={`${styles.messageWrapper} ${isSent ? styles.sent : styles.received}`}>
      {!isSent && (
        <div className={styles.senderAvatar}>
          <img 
            src={message.sender?.avatar || `https://ui-avatars.com/api/?name=${message.sender?.fullName || 'U'}&background=0084ff&color=fff`} 
            alt="sender" 
          />
        </div>
      )}
      
      <div className={styles.messageContent}>
        {hasAttachments && isImageContent && (
          <div className={styles.attachmentContainer}>
            {message.attachments.map((attachment, index) => (
              <div key={index} className={styles.imageAttachmentWrapper}>
                <img src={attachment.url} alt={attachment.name} className={styles.attachmentImage} />
              </div>
            ))}
          </div>
        )}

        {hasAttachments && isFileContent && (
          <div className={styles.attachmentContainer}>
            {message.attachments.map((attachment, index) => (
              <a key={index} href={attachment.url} download={attachment.name} className={styles.fileAttachment}>
                <div className={styles.fileIcon}><i className="fas fa-file"></i></div>
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{attachment.name}</p>
                  <span className={styles.fileSize}>{formatFileSize(attachment.size)}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Hiển thị ảnh từ imageUrl (format app) */}
        {message.imageUrl && (
          <img src={message.imageUrl} alt="attachment" className={styles.attachmentImage} />
        )}

        {message.content && (
          <div className={styles.messageBubble}>
            <p className={styles.messageText}>{message.content}</p>
          </div>
        )}

        <div className={styles.messageFooter}>
          <span className={styles.messageTime}>{displayTime}</span>
          {isSent && (
            <span className={styles.readStatus}>
              {message.isRead ? ' ✓✓' : ' ✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;