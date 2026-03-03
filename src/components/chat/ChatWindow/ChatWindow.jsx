import React, { useState, useEffect } from 'react';
import styles from './ChatWindow.module.css';
import MessageBubble from '../MessageBubble/MessageBubble';
import InputBox from '../InputBox/InputBox';
import { useChat } from '../../../services/context/ChatContext';

const ChatWindow = ({ selectedChat }) => {
  const { messages, fetchMessages } = useChat();
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = React.useRef(null);

  // whenever selectedChat changes, load its messages
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat, fetchMessages]);

  // scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className={styles.chatWindow}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.chatInfo}>
          <div className={styles.avatar}>
            <img src={selectedChat?.avatar} alt={selectedChat?.name} />
            {selectedChat?.online && <div className={styles.onlineStatus}></div>}
          </div>
          <div className={styles.userDetails}>
            <h3>{selectedChat?.name}</h3>
            {selectedChat?.online && <span className={styles.status}>Đang hoạt động</span>}
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.actionBtn}>
            <i className="fas fa-search"></i>
          </button>
          <button className={styles.actionBtn}>
            <i className="fas fa-phone"></i>
          </button>
          <button className={styles.actionBtn}>
            <i className="fas fa-video"></i>
          </button>
          <button 
            className={styles.actionBtn}
            onClick={() => setShowInfo(!showInfo)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className={styles.messagesContainer}>
        <div className={styles.messagesList}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      {/* Input Box */}
      <InputBox />

      {/* Info Panel */}
      {showInfo && (
        <div className={styles.infoPanel}>
          <div className={styles.infoPanelHeader}>
            <h3>Thông tin hội thoại</h3>
            <button 
              className={styles.closeBtn}
              onClick={() => setShowInfo(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className={styles.infoPanelContent}>
            <div className={styles.userInfoCard}>
              <div className={styles.userInfoAvatar}>
                <img src={selectedChat?.avatar} alt={selectedChat?.name} />
              </div>
              <h2>{selectedChat?.name}</h2>
              <div className={styles.quickActions}>
                <button className={styles.quickActionBtn}>
                  <i className="fas fa-phone"></i>
                  <span>Gọi lại</span>
                </button>
              </div>
            </div>

            <div className={styles.infoSection}>
              <button className={styles.infoItem}>
                <i className="fas fa-bell"></i>
                <div className={styles.infoItemContent}>
                  <span>Tắt thông báo</span>
                </div>
              </button>
              <button className={styles.infoItem}>
                <i className="fas fa-thumbtack"></i>
                <div className={styles.infoItemContent}>
                  <span>Chim hội thoại</span>
                </div>
              </button>
              <button className={styles.infoItem}>
                <i className="fas fa-users"></i>
                <div className={styles.infoItemContent}>
                  <span>Tạo nhóm trò chuyện</span>
                </div>
              </button>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <i className="far fa-clock"></i>
                <span>Danh sách nhắc hẹn</span>
              </div>
            </div>

            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <i className="far fa-image"></i>
                <span>19 nhóm chung</span>
              </div>
            </div>

            <div className={styles.infoSection}>
              <h4>Ảnh/Video</h4>
              <p className={styles.infoNote}>Sử dụng ứng dụng Zalo PC để xem Ảnh/Video trước ngày 14/2/2026</p>
            </div>

            <div className={styles.infoSection}>
              <h4>File</h4>
              <p className={styles.infoNote}>Sử dụng ứng dụng Zalo PC để xem File trước ngày 14/2/2026</p>
            </div>

            <div className={styles.infoSection}>
              <h4>Link</h4>
              <p className={styles.infoNote}>Sử dụng ứng dụng Zalo PC để xem Link trước ngày 14/2/2026</p>
            </div>

            <div className={styles.infoSection}>
              <button className={styles.infoItem}>
                <i className="fas fa-lock"></i>
                <div className={styles.infoItemContent}>
                  <span>Thiết lập bảo mật</span>
                  <div className={styles.securityDetails}>
                    <div className={styles.securityItem}>
                      <i className="fas fa-user-shield"></i>
                      <span>Tin nhắn tự xoá 🔒</span>
                      <span className={styles.securityStatus}>Không bao giờ</span>
                    </div>
                  </div>
                </div>
              </button>
              <button className={styles.infoItem}>
                <i className="fas fa-eye-slash"></i>
                <div className={styles.infoItemContent}>
                  <span>Ẩn trò chuyện</span>
                </div>
                <div className={styles.toggle}>
                  <input type="checkbox" id="hideChat" />
                  <label htmlFor="hideChat"></label>
                </div>
              </button>
              <button className={styles.infoItem}>
                <i className="fas fa-exclamation-triangle"></i>
                <div className={styles.infoItemContent}>
                  <span>Báo xấu</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;