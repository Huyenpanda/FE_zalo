import React, { useState, useRef } from 'react';
import { useChat } from '../../../services/context/ChatContext';
import styles from './InputBox.module.css';

const InputBox = () => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
  const { sendMessage, startTyping, stopTyping, uploadFile } = useChat();
  const typingTimeoutRef = useRef(null);

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
      stopTyping();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    // Emit typing indicator
    startTyping();
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const handleFileUpload = async (e, uploadType = 'file') => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const url = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      // Determine content type
      const contentType = uploadType === 'image' ? 'image' : 'file';
      const fileName = file.name;
      
      // Send message with attachment
      await sendMessage(
        uploadType === 'image' ? `[Hình ảnh: ${fileName}]` : `[File: ${fileName}]`, 
        contentType, 
        [{ url, name: fileName }]
      );
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Không thể upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.inputBox}>
      {/* Upload Progress */}
      {isUploading && (
        <div className={styles.uploadProgress}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className={styles.progressText}>{uploadProgress}%</span>
        </div>
      )}

      <div className={styles.inputContainer}>
        <div className={styles.inputActions}>
          <button 
            className={styles.actionBtn}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            title="Đính kèm file"
          >
            <i className="fas fa-paperclip"></i>
          </button>
          
          <button 
            className={styles.actionBtn}
            onClick={() => imageInputRef.current?.click()}
            disabled={isUploading}
            title="Hình ảnh"
          >
            <i className="far fa-image"></i>
          </button>
          
          <button className={styles.actionBtn} title="File">
            <i className="far fa-file"></i>
          </button>
          
          <button className={styles.actionBtn} title="Ảnh chụp màn hình">
            <i className="fas fa-camera"></i>
          </button>
          
          <button className={styles.actionBtn} title="Sticker">
            <i className="far fa-sticky-note"></i>
          </button>
          
          <button className={styles.actionBtn} title="Lịch hẹn">
            <i className="far fa-calendar"></i>
          </button>
          
          <button className={styles.actionBtn} title="Biểu tượng cảm xúc">
            <i className="far fa-smile"></i>
          </button>
          
          <button className={styles.actionBtn} title="Thêm">
            <i className="fas fa-ellipsis-h"></i>
          </button>
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            className={styles.messageInput}
            disabled={isUploading}
          />
          
          <div className={styles.inputRightActions}>
            <button className={styles.emojiBtn}>
              😊
            </button>
            {message.trim() ? (
              <button 
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={isUploading}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            ) : (
              <button className={styles.likeBtn} title="Thích">
                👍
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e, 'file')}
        accept="*/*"
      />
      <input
        ref={imageInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e, 'image')}
        accept="image/*"
      />
    </div>
  );
};

export default InputBox;