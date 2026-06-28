import React, { useState, useRef } from 'react';
import { useChat } from '../../../services/context/ChatContext';
import styles from './InputBox.module.css';
import EmojiPicker from './EmojiPicker';
import ScheduleModal from './ScheduleModal';
import LocationShare from './LocationShare';

const InputBox = () => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const fileInputRef = useRef(null);
  
  const { sendMessage, startTyping, stopTyping, uploadFile, selectedChat } = useChat();
  const typingTimeoutRef = useRef(null);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    if (!selectedChat) {
      alert('Vui lòng chọn một cuộc trò chuyện trước khi gửi tin nhắn.');
      return;
    }

    setMessage(''); // xóa trước, không đợi await
    stopTyping();
    await sendMessage(trimmed);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Kích thước file không được vượt quá 50MB');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const uploadResult = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      const fileName = file.name;
      const uploadedUrl = uploadResult?.url || uploadResult?.data?.url || uploadResult?.data || '';
      const contentType = isImage ? 'image' : 'file';

      await sendMessage(
        isImage ? `[Hình ảnh: ${fileName}]` : `[File: ${fileName}]`,
        contentType,
        uploadedUrl ? [{ url: uploadedUrl, name: fileName, type: file.type, size: file.size }] : []
      );
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Không thể upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSchedule = (scheduleData) => {
    sendMessage(
      `📅 Lịch hẹn: ${scheduleData.title}${scheduleData.description ? '\n' + scheduleData.description : ''}`,
      'schedule',
      [scheduleData]
    );
  };

  const handleLocationShare = (locationData) => {
    sendMessage(
      `📍 Vị trí: ${locationData.name}`,
      'location',
      [locationData]
    );
  };

  const handleSendLike = async () => {
    if (!selectedChat) {
      alert('Vui lòng chọn một cuộc trò chuyện trước khi gửi tin nhắn.');
      return;
    }

    await sendMessage('👍', 'text');
  };

  return (
    <div className={styles.inputBox}>
      {/* Upload Progress */}
      {isUploading && (
        <div className={styles.uploadProgress}>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className={styles.progressText}>{uploadProgress}%</span>
          </div>
          <p className={styles.uploadingText}>Đang tải lên...</p>
        </div>
      )}

      <div className={styles.inputContainer}>
        <div className={styles.inputActions}>
          <button
            className={styles.actionBtn}
            onClick={() => fileInputRef.current?.click()}
            title="Gửi ảnh hoặc file"
            type="button"
          >
            <i className="fas fa-paperclip"></i>
          </button>

<button 
  className={`${styles.actionBtn} ${showSchedule ? styles.active : ''}`}
  onClick={() => setShowSchedule(true)}
  title="Lịch hẹn"
>
  <i className="far fa-calendar"></i>
</button>

<button
  className={`${styles.actionBtn} ${showLocation ? styles.active : ''}`}
  onClick={() => setShowLocation(true)}
  title="Vị trí"
>
  <i className="fas fa-map-marker-alt"></i>
</button>

<button 
  className={`${styles.actionBtn} ${showEmojiPicker ? styles.active : ''}`}
  onClick={() => setShowEmojiPicker(true)}
  title="Biểu tượng cảm xúc"
>
  <i className="far fa-smile"></i>
</button>

{showEmojiPicker && (
  <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
)}
{showSchedule && (
  <ScheduleModal onSchedule={handleSchedule} onClose={() => setShowSchedule(false)} />
)}
{showLocation && (
  <LocationShare onLocationShare={handleLocationShare} onClose={() => setShowLocation(false)} />
)}
          
          
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
            
            {message.trim() ? (
              <button 
                className={styles.sendBtn}
                onClick={handleSend}
                disabled={isUploading}
                type="button"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            ) : (
              <button className={styles.likeBtn} title="Thích" onClick={handleSendLike} type="button">
                <i className="fas fa-thumbs-up"></i>
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
        onChange={handleFileUpload}
        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar,.ppt,.pptx,.xls,.xlsx"
        disabled={isUploading}
      />
    </div>
  );
};

export default InputBox;