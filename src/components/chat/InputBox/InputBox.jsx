import React, { useState, useRef } from 'react';
import { useChat } from '../../../services/context/ChatContext';
import styles from './InputBox.module.css';
import EmojiPicker from './EmojiPicker';
import ScheduleModal from './ScheduleModal';
import LocationShare from './LocationShare';
import ScreenshotTool from './ScreenshotTool';

const InputBox = () => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showScreenshot, setShowScreenshot] = useState(false);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  
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

  const handleFileUpload = async (e, uploadType = 'file') => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type based on upload type
    if (uploadType === 'image') {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file hình ảnh');
        return;
      }
    } else {
      // For regular files, check size limit
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert('Kích thước file không được vượt quá 50MB');
        return;
      }
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const uploadResult = await uploadFile(file, (progress) => {
        setUploadProgress(progress);
      });

      // Determine content type
      const contentType = uploadType === 'image' ? 'image' : 'file';
      const fileName = file.name;
      
      // Send message with attachment
      await sendMessage(
        uploadType === 'image' ? `[Hình ảnh: ${fileName}]` : `[File: ${fileName}]`, 
        contentType, 
        [{ url: uploadResult.url, name: fileName, type: file.type, size: file.size }]
      );
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.message || 'Không thể upload file');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imageInputRef.current) imageInputRef.current.value = '';
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

  const handleScreenshotTaken = (screenshotData) => {
    sendMessage(
      '[Ảnh chụp màn hình]',
      'image',
      [screenshotData]
    );
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
          {/* // Thay các button bị comment thành: */}
<button 
  className={`${styles.actionBtn} ${showScreenshot ? styles.active : ''}`}
  onClick={() => setShowScreenshot(true)}
  title="Ảnh chụp màn hình"
>
  <i className="fas fa-camera"></i>
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

{/* // Và render các modal ở cuối component: */}
{showEmojiPicker && (
  <EmojiPicker onEmojiSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
)}
{showSchedule && (
  <ScheduleModal onSchedule={handleSchedule} onClose={() => setShowSchedule(false)} />
)}
{showLocation && (
  <LocationShare onLocationShare={handleLocationShare} onClose={() => setShowLocation(false)} />
)}
{showScreenshot && (
  <ScreenshotTool onScreenshotTaken={handleScreenshotTaken} onClose={() => setShowScreenshot(false)} />
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
        disabled={isUploading}
      />
      <input
        ref={imageInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e, 'image')}
        accept="image/*"
        disabled={isUploading}
      />
    </div>
  );
};

export default InputBox;