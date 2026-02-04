import React, { useState, useRef, useEffect } from 'react';
import styles from './InputBox.module.css';
import { FiPlus, FiSmile, FiSend } from 'react-icons/fi';

const InputBox = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  // Auto focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage({
        text: message,
        timestamp: new Date(),
        isOwn: true,
      });
      setMessage('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.inputBox}>
      <div className={styles.inputContainer}>
        <button className={styles.iconBtn} title="Thêm tệp">
          <FiPlus />
        </button>

        <textarea
          ref={inputRef}
          className={styles.textarea}
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          rows={1}
        />

        <button className={styles.iconBtn} title="Emoji">
          <FiSmile />
        </button>

        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!message.trim()}
          title="Gửi tin nhắn"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
};

export default InputBox;
