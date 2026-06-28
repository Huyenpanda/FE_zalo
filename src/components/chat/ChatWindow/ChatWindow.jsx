import React, { useState, useEffect, useMemo } from 'react';
import styles from './ChatWindow.module.css';
import MessageBubble from '../MessageBubble/MessageBubble';
import InputBox from '../InputBox/InputBox';
import { useChat } from '../../../services/context/ChatContext';
import { useNavigate } from 'react-router-dom';

const ChatWindow = ({ selectedChat }) => {
  const navigate = useNavigate();
  const { messages, fetchMessages, currentUser, isInitializing } = useChat();

  // Đọc thẳng từ localStorage để tránh stale state
  const currentUserId = React.useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      return String(u.id || u._id || currentUser?.id || '');
    } catch {
      return String(currentUser?.id || '');
    }
  }, []); // [] vì user không đổi trong session

  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    photos: true,
    files: true,
    links: true,
    security: false
  });
  const [callState, setCallState] = useState({ active: false, type: null, status: 'đang gọi' });
  const messagesEndRef = React.useRef(null);

  const sortedMessages = useMemo(() => {
    const getTime = (message) => {
      const time = Date.parse(message?.createdAt);
      return Number.isFinite(time) ? time : 0;
    };

    return [...messages].sort((a, b) => getTime(a) - getTime(b));
  }, [messages]);

  const filteredMessages = sortedMessages.filter(msg => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return msg.content?.toLowerCase().includes(query) || 
           msg.sender?.name?.toLowerCase().includes(query);
  });

  // ChatWindow.jsx - bỏ filter conversationId, dùng thẳng sortedMessages
const currentChatMessages = useMemo(() => {
  if (!selectedChat) return [];
  // Bỏ filter vì messages trong context luôn là của selectedChat hiện tại
  return sortedMessages;
}, [sortedMessages, selectedChat]);

  // ChatWindow.jsx - thêm ngay trước return
  console.log('selectedChat.id:', selectedChat?.id, typeof selectedChat?.id);
  console.log('messages:', messages.map(m => ({ convId: m.conversationId, type: typeof m.conversationId })));
  console.log('currentChatMessages length:', currentChatMessages.length);
  // scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock data for links
  const links = [
    {
      id: 1,
      title: 'BBC Learning English - Learn English wi...',
      url: 'www.bbc.co.uk',
      image: 'https://ui-avatars.com/api/?name=BBC&background=0084ff&color=fff',
      date: '07/06'
    },
    {
      id: 2,
      title: 'Danh sách sinh viên D17CNPM6 tham ...',
      url: 'docs.google.com',
      icon: 'fas fa-link',
      date: '06/06'
    },
    {
      id: 3,
      title: 'Minh chứng hoạt động - Google Drive',
      url: 'drive.google.com',
      icon: 'fas fa-link',
      date: '06/06'
    }
  ];
console.log('=== ChatWindow render ===');
console.log('messages count:', messages.length);
console.log('sortedMessages count:', sortedMessages.length);  
console.log('currentChatMessages count:', currentChatMessages.length);
console.log('currentUser:', currentUser?.id);
console.log('first message:', messages[0]);
  return (
    <div className={styles.chatWindow}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.chatInfo}>
          <div className={styles.avatar}>
            <img
              src={selectedChat?.avatar}
              onClick={() => {
                if (selectedChat?.userId) {
                  navigate(`/profile/${selectedChat.userId}`);
                }
              }}
              style={{ cursor: selectedChat?.userId ? 'pointer' : 'default' }}
              alt={selectedChat?.name || 'Avatar'}
            />
            {selectedChat?.online && <div className={styles.onlineStatus}></div>}
          </div>
          <div className={styles.userDetails}>
            <h3>{selectedChat?.name}</h3>
            {selectedChat?.online && <span className={styles.status}>Đang hoạt động</span>}
          </div>
        </div>

        <div className={styles.headerActions}>
          <button 
            className={styles.actionBtn}
            onClick={() => setShowSearch(!showSearch)}
            title="Tìm kiếm"
          >
            <i className="fas fa-search"></i>
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => setCallState({ active: true, type: 'voice', status: 'đang đổ chuông' })}
          >
            <i className="fas fa-phone"></i>
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => setCallState({ active: true, type: 'video', status: 'đang đổ chuông' })}
          >
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

      {callState.active && (
        <div className={styles.callOverlay}>
          <div className={styles.callCard}>
            <div className={styles.callAvatar}>
              <img src={selectedChat?.avatar} alt={selectedChat?.name} />
              {callState.type === 'video' ? (
                <span className={styles.callBadge}>Video</span>
              ) : (
                <span className={styles.callBadge}>Audio</span>
              )}
            </div>
            <h2>{selectedChat?.name || 'Người gọi'}</h2>
            <p>{callState.status === 'đang đổ chuông' ? 'Đang đổ chuông...' : 'Đang kết nối...'}</p>
            <div className={styles.callControls}>
              <button
                className={`${styles.callButton} ${styles.callMute}`}
                onClick={() => setCallState(prev => ({ ...prev, status: 'đang nói' }))}
              >
                <i className="fas fa-microphone-slash"></i>
              </button>
              <button
                className={`${styles.callButton} ${styles.callEnd}`}
                onClick={() => setCallState({ active: false, type: null, status: 'đã kết thúc' })}
              >
                <i className="fas fa-phone-slash"></i>
              </button>
              <button
                className={`${styles.callButton} ${styles.callSwitch}`}
                onClick={() => setCallState(prev => ({ ...prev, status: 'đã kết nối' }))}
              >
                <i className="fas fa-video"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {showSearch && (
        <div className={styles.searchPanel}>
          <div className={styles.searchHeader}>
            <div className={styles.searchInputWrapper}>
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Tìm kiếm tin nhắn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className={styles.searchInput}
              />
              {searchQuery && (
                <button 
                  className={styles.clearBtn}
                  onClick={() => setSearchQuery('')}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            <button
              className={styles.closeSearchBtn}
              onClick={() => { setShowSearch(false); setSearchQuery(''); }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className={styles.searchResults}>
            {searchQuery.trim() ? (
              filteredMessages.length > 0 ? (
                <div className={styles.resultsList}>
                  <p className={styles.resultCount}>Tìm thấy {filteredMessages.length} kết quả</p>
                  {filteredMessages.map((message) => (
                    <div key={message.id} className={styles.searchResultItem}>
                      <MessageBubble message={message} />
                    </div>
                    
                  ))}
                </div>
              ) : (
                <div className={styles.noResults}>
                  <i className="fas fa-search"></i>
                  <p>Không tìm thấy tin nhắn nào</p>
                  <span>Hãy thử tìm kiếm với từ khóa khác</span>
                </div>
              )
            ) : (
              <div className={styles.emptySearch}>
                <i className="fas fa-search"></i>
                <p>Nhập từ khóa để tìm kiếm</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className={styles.messagesContainer}>
        <div className={styles.messagesList} key={currentUser?.id || 'loading'}>
          {
            selectedChat ? (
              currentChatMessages.map((message) => (
                <MessageBubble
                  key={message._id || message.id}
                  message={message}
                  currentUserId={currentUserId}
                />
              ))
            ) : (
              <div className={styles.emptyChatPlaceholder}>
                <p>Chưa có cuộc trò chuyện được chọn. Vui lòng chọn một cuộc trò chuyện ở cột bên trái.</p>
              </div>
            )
          }
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
            {/* User Info Card */}
            <div className={styles.userInfoCard}>
              <div className={styles.userInfoAvatar}>
                <img src={selectedChat?.avatar} alt={selectedChat?.name} />
              </div>
              <div className={styles.userNameSection}>
                <h2>{selectedChat?.name}</h2>
                <button className={styles.editBtn}>
                  <i className="fas fa-pen"></i>
                </button>
              </div>
              <div className={styles.quickActions}>
                <button className={styles.quickActionBtn}>
                  <i className="fas fa-bell"></i>
                  <span>Tắt thông báo</span>
                </button>
                <button className={styles.quickActionBtn}>
                  <i className="fas fa-thumbtack"></i>
                  <span>Ghim hội thoại</span>
                </button>
                <button className={styles.quickActionBtn}>
                  <i className="fas fa-users"></i>
                  <span>Tạo nhóm trò chuyện</span>
                </button>
              </div>
            </div>

            {/* Reminder Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <i className="far fa-clock"></i>
                <span>Danh sách nhắc hẹn</span>
              </div>
            </div>

            {/* Common Groups Section */}
            <div className={styles.infoSection}>
              <div className={styles.sectionHeader}>
                <i className="fas fa-users"></i>
                <span>8 nhóm chung</span>
              </div>
            </div>

            {/* Photos/Videos Section */}
            <div className={styles.infoSection}>
              <button 
                className={styles.collapsibleHeader}
                onClick={() => toggleSection('photos')}
              >
                <span>Ảnh/Video</span>
                <i className={`fas fa-chevron-down ${expandedSections.photos ? styles.expanded : ''}`}></i>
              </button>
              {expandedSections.photos && (
                <div className={styles.collapsibleContent}>
                  <div className={styles.mediaGrid}>
                    <div className={styles.mediaItem}>
                      <div className={styles.mediaThumbnail}></div>
                    </div>
                    <div className={styles.mediaItem}>
                      <div className={styles.mediaThumbnail}></div>
                    </div>
                    <div className={styles.mediaItem}>
                      <div className={styles.mediaThumbnail}></div>
                    </div>
                  </div>
                  <button className={styles.viewAllBtn}>Xem tất cả</button>
                </div>
              )}
            </div>

            {/* Files Section */}
            <div className={styles.infoSection}>
              <button 
                className={styles.collapsibleHeader}
                onClick={() => toggleSection('files')}
              >
                <span>File</span>
                <i className={`fas fa-chevron-down ${expandedSections.files ? styles.expanded : ''}`}></i>
              </button>
              {expandedSections.files && (
                <div className={styles.collapsibleContent}>
                  <p className={styles.emptyText}>Chưa có File được chia sẻ trong hội thoại này</p>
                </div>
              )}
            </div>

            {/* Links Section */}
            <div className={styles.infoSection}>
              <button 
                className={styles.collapsibleHeader}
                onClick={() => toggleSection('links')}
              >
                <span>Link</span>
                <i className={`fas fa-chevron-down ${expandedSections.links ? styles.expanded : ''}`}></i>
              </button>
              {expandedSections.links && (
                <div className={styles.collapsibleContent}>
                  <div className={styles.linksList}>
                    {links.map(link => (
                      <a key={link.id} href="#" className={styles.linkItem}>
                        {link.image && (
                          <img src={link.image} alt={link.title} className={styles.linkImage} />
                        )}
                        {link.icon && (
                          <div className={styles.linkIcon}>
                            <i className={link.icon}></i>
                          </div>
                        )}
                        <div className={styles.linkInfo}>
                          <h4>{link.title}</h4>
                          <span>{link.url}</span>
                        </div>
                        <span className={styles.linkDate}>{link.date}</span>
                      </a>
                    ))}
                  </div>
                  <button className={styles.viewAllBtn}>Xem tất cả</button>
                </div>
              )}
            </div>

            {/* Security Settings Section */}
            <div className={styles.infoSection}>
              <button 
                className={styles.collapsibleHeader}
                onClick={() => toggleSection('security')}
              >
                <span>Thiết lập bảo mật</span>
                <i className={`fas fa-chevron-down ${expandedSections.security ? styles.expanded : ''}`}></i>
              </button>
              {expandedSections.security && (
                <div className={styles.collapsibleContent}>
                  <div className={styles.securityItem}>
                    <i className="fas fa-info-circle"></i>
                    <div className={styles.securityItemContent}>
                      <span className={styles.securityLabel}>Tin nhắn tự xoá 🔒</span>
                      <span className={styles.securityValue}>Không bao giờ</span>
                    </div>
                  </div>

                  <div className={styles.securityItem}>
                    <i className="fas fa-eye-slash"></i>
                    <div className={styles.securityItemContent}>
                      <span>Ẩn trò chuyện</span>
                    </div>
                    <label className={styles.toggle}>
                      <input type="checkbox" />
                      <span></span>
                    </label>
                  </div>

                  <div className={styles.securityItem}>
                    <i className="fas fa-exclamation-triangle"></i>
                    <div className={styles.securityItemContent}>
                      <span>Báo xấu</span>
                    </div>
                  </div>

                  <button className={styles.deleteBtn}>
                    <i className="fas fa-trash"></i>
                    <span>Xoá lịch sử trò chuyện</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;