import React, { useState, useEffect, useRef } from 'react';
import styles from './Sidebar.module.css';

import SettingsModal from '../Modals/SettingsModal';
import api from '../../../services/api';
import CloudPanel from '../Modals/CloudPanel';
import ToolsPanel from '../Modals/ToolsPanel';
import { useChat } from '../../../services/context/ChatContext';
import { useAuth } from '../../../services/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ conversations = [], selectedChat, onSelectChat, onViewChange, currentView, navOnly = false }) => {
  const navigate = useNavigate();
  const { createGroupConversation, isInitializing } = useChat();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [activeNav, setActiveNav] = useState(currentView || 'messages');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupSearch, setGroupSearch] = useState('');
  const [groupSearchResults, setGroupSearchResults] = useState([]);
  const [groupSearching, setGroupSearching] = useState(false);
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [groupCreating, setGroupCreating] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Modal states
  const [showSettings, setShowSettings] = useState(false);
  const [showCloud, setShowCloud] = useState(false);
  const [showTools, setShowTools] = useState(false);

  const handleLogout = () => {
    setShowSettings(false);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactsClick = () => {
    setActiveNav('contacts');
    if (navOnly) { navigate('/chat'); return; }
    if (onViewChange) { onViewChange('contacts'); return; }
    navigate('/chat');
  };

  const handleMessagesClick = () => {
    setActiveNav('messages');
    if (navOnly) { navigate('/chat'); return; }
    if (onViewChange) { onViewChange('messages'); return; }
    navigate('/chat');
  };

  const handleDiaryClick = () => {
    setActiveNav('diary');
    if (navOnly) { navigate('/chat'); return; }
    if (onViewChange) { onViewChange('diary'); return; }
    navigate('/chat');
  };

  // Mobile: navigate + set activeNav
  const handleMobileNav = (view) => {
    setActiveNav(view);
    if (onViewChange) onViewChange(view);
  };

  const isSidePanelView = currentView === 'contacts' || currentView === 'diary';

  const resetCreateGroupState = () => {
    setShowCreateGroup(false);
    setGroupName('');
    setGroupSearch('');
    setGroupSearchResults([]);
    setSelectedGroupMembers([]);
    setGroupSearching(false);
    setGroupCreating(false);
  };

  const handleGroupSearch = (query) => {
    const nextQuery = query || '';
    setGroupSearch(nextQuery);

    if (searchTimeoutRef.current) {
      window.clearTimeout(searchTimeoutRef.current);
    }

    if (!nextQuery.trim()) {
      setGroupSearchResults([]);
      return;
    }

    searchTimeoutRef.current = window.setTimeout(async () => {
      try {
        setGroupSearching(true);
        const res = await api.get('/auth/users/search', { params: { q: nextQuery.trim() } });
        const payload = res?.data || res;
        const users = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
        const filteredUsers = users.filter((user) => String(user.id || user._id) !== String(currentUser?.id));
        setGroupSearchResults(filteredUsers);
      } catch (error) {
        console.error('Search users error:', error);
        setGroupSearchResults([]);
      } finally {
        setGroupSearching(false);
      }
    }, 350);
  };

  const toggleGroupMember = (user) => {
    setSelectedGroupMembers(prev => {
      const memberId = user.id || user._id;
      const exists = prev.some((item) => String(item.id || item._id) === String(memberId));
      return exists
        ? prev.filter((item) => String(item.id || item._id) !== String(memberId))
        : [...prev, user];
    });
  };

  const handleCreateGroup = async () => {
    const trimmedName = groupName.trim();
    if (!trimmedName) {
      alert('Vui lòng nhập tên nhóm');
      return;
    }
    if (selectedGroupMembers.length === 0) {
      alert('Vui lòng chọn ít nhất một thành viên');
      return;
    }

    setGroupCreating(true);
    try {
      const createdConv = await createGroupConversation({
        name: trimmedName,
        memberIds: selectedGroupMembers.map((member) => member.id || member._id),
      });

      if (createdConv) {
        if (onSelectChat) onSelectChat(createdConv);
        if (onViewChange) onViewChange('messages');
        setActiveNav('messages');
        resetCreateGroupState();
      }
    } catch (error) {
      console.error('Create group error:', error);
      alert('Không thể tạo nhóm lúc này');
    } finally {
      setGroupCreating(false);
    }
  };

  useEffect(() => {
    setActiveNav(currentView || 'messages');
  }, [currentView]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        window.clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .shimmerBlock {
          background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
      `}</style>

      {navOnly ? (
        <div className={styles.sidebarContainer}>
          <div className={styles.leftNav}>
            <div className={styles.navTop}>
              <div className={styles.userAvatar}>
                <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'User')}&background=0084ff&color=fff`} alt="User" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} />
              </div>
              <button className={`${styles.navItem} ${activeNav === 'messages' ? styles.active : ''}`} onClick={handleMessagesClick} title="Tin nhắn"><i className="fas fa-comment-dots"></i></button>
              <button className={`${styles.navItem} ${activeNav === 'contacts' ? styles.active : ''}`} onClick={handleContactsClick} title="Danh bạ"><i className="fas fa-address-book"></i></button>
              <button className={`${styles.navItem} ${activeNav === 'diary' ? styles.active : ''}`} onClick={handleDiaryClick} title="Nhật ký"><i className="fas fa-book-open"></i></button>
            </div>
            <div className={styles.navBottom}>
              <button className={styles.navItem} title="Cài đặt" onClick={() => setShowSettings(true)}><i className="fas fa-cog"></i></button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.sidebarContainer}>
        <div className={styles.leftNav}>
          <div className={styles.navTop}>
            <div className={styles.userAvatar}>
              <img src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'User')}&background=0084ff&color=fff`} alt="User" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }} />
            </div>
            <button className={`${styles.navItem} ${activeNav === 'messages' ? styles.active : ''}`} onClick={handleMessagesClick} title="Tin nhắn"><i className="fas fa-comment-dots"></i><span className={styles.navBadge}>5+</span></button>
            <button className={`${styles.navItem} ${activeNav === 'contacts' ? styles.active : ''}`} onClick={handleContactsClick} title="Danh bạ"><i className="fas fa-address-book"></i></button>
            <button className={`${styles.navItem} ${activeNav === 'diary' ? styles.active : ''}`} onClick={handleDiaryClick} title="Nhật ký"><i className="fas fa-book-open"></i></button>
          </div>
          <div className={styles.navBottom}>
            <button className={styles.navItem} title="Cloud của tôi" onClick={() => setShowCloud(true)}><i className="fas fa-cloud"></i></button>
            <button className={styles.navItem} title="Công cụ" onClick={() => setShowTools(true)}><i className="fas fa-briefcase"></i></button>
            <button className={styles.navItem} title="Cài đặt" onClick={() => setShowSettings(true)}><i className="fas fa-cog"></i></button>
          </div>
        </div>

        {/* Mobile Bottom Nav */}
        <div className={styles.mobileBottomNav}>
          <button className={`${styles.mobileNavItem} ${activeNav === 'messages' ? styles.mobileNavActive : ''}`} onClick={() => handleMobileNav('messages')}>
            <i className="fas fa-comment-dots"></i><span>Chat</span>
          </button>
          <button className={`${styles.mobileNavItem} ${activeNav === 'contacts' ? styles.mobileNavActive : ''}`} onClick={() => handleMobileNav('contacts')}>
            <i className="fas fa-address-book"></i><span>Danh bạ</span>
          </button>
          <button className={`${styles.mobileNavItem} ${activeNav === 'diary' ? styles.mobileNavActive : ''}`} onClick={() => handleMobileNav('diary')}>
            <i className="fas fa-book-open"></i><span>Nhật ký</span>
          </button>
          <button className={styles.mobileNavItem} onClick={() => setShowSettings(true)}>
            <i className="fas fa-cog"></i><span>Cài đặt</span>
          </button>
        </div>

        {!isSidePanelView && (
          <div className={styles.sidebar}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.userProfile}>
                <div className={styles.avatar}>
                  <img
                    src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'User')}&background=0084ff&color=fff`}
                    alt="User"
                    onClick={() => navigate('/profile')}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className={styles.onlineStatus}></div>
                </div>
              </div>

              {/* Search Bar */}
              <div className={styles.searchBar}>
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isInitializing}
                />
              </div>

              {/* Action Icons */}
              <div className={styles.actions}>
                <button
                  className={styles.actionBtn}
                  onClick={() => setShowCreateGroup(true)}
                  title="Tạo nhóm chat"
                  disabled={isInitializing}
                >
                  <i className="fas fa-users"></i>
                </button>
              </div>
            </div>

            {/* Conversation List */}
            <div className={styles.conversationList}>
              {isInitializing ? (
                // Skeleton loading
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={styles.conversationItem}
                    style={{ pointerEvents: 'none', cursor: 'default' }}
                  >
                    <div className={styles.conversationAvatar}>
                      <div
                        className="shimmerBlock"
                        style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }}
                      />
                    </div>
                    <div className={styles.conversationContent}>
                      <div className={styles.conversationHeader}>
                        <div
                          className="shimmerBlock"
                          style={{
                            height: 13,
                            width: `${45 + (i * 11) % 35}%`,
                            borderRadius: 4,
                          }}
                        />
                        <div
                          className="shimmerBlock"
                          style={{ height: 11, width: 34, borderRadius: 4 }}
                        />
                      </div>
                      <div className={styles.conversationFooter} style={{ marginTop: 6 }}>
                        <div
                          className="shimmerBlock"
                          style={{
                            height: 11,
                            width: `${55 + (i * 7) % 35}%`,
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredConversations.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 24px',
                    color: '#aaa',
                    gap: 10,
                  }}
                >
                  <i className="fas fa-comment-slash" style={{ fontSize: 30, opacity: 0.35 }} />
                  <span style={{ fontSize: 13 }}>
                    {searchQuery ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có cuộc trò chuyện nào'}
                  </span>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`${styles.conversationItem} ${
                      selectedChat?.id === conv.id ? styles.selected : ''
                    }`}
                    onClick={() => onSelectChat(conv)}
                  >
                    <div className={styles.conversationAvatar}>
                      <img src={conv.avatar} alt={conv.name} />
                      {conv.online && <div className={styles.onlineBadge}></div>}
                      {conv.group && (
                        <div className={styles.groupBadge}>
                          <i className="fas fa-users" style={{ fontSize: 8 }} />
                        </div>
                      )}
                    </div>

                    <div className={styles.conversationContent}>
                      <div className={styles.conversationHeader}>
                        <h3 className={styles.conversationName}>
                          {conv.name}
                          {conv.official && <i className={styles.verifiedBadge}>✓</i>}
                        </h3>
                        <span className={styles.conversationTime}>{conv.time}</span>
                      </div>
                      <div className={styles.conversationFooter}>
                        <p className={styles.lastMessage}>{conv.lastMessage}</p>
                        {conv.unread > 0 && (
                          <span className={styles.unreadBadge}>
                            {conv.unread > 99 ? '99+' : conv.unread}
                          </span>
                        )}
                      </div>
                    </div>

                    {conv.pinned && (
                      <div className={styles.pinnedIcon}>
                        <i className="fas fa-thumbtack"></i>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        </div>
      )}

      {showCreateGroup && (
        <div className={styles.modalOverlay} onClick={resetCreateGroupState}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Tạo nhóm chat</h3>
              <button className={styles.modalCloseBtn} onClick={resetCreateGroupState} title="Đóng">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className={styles.modalBody}>
              <input
                className={styles.modalInput}
                type="text"
                placeholder="Nhập tên nhóm"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />

              <input
                className={styles.modalInput}
                type="text"
                placeholder="Tìm người để thêm vào nhóm"
                value={groupSearch}
                onChange={(e) => handleGroupSearch(e.target.value)}
              />

              {selectedGroupMembers.length > 0 && (
                <div className={styles.selectedChips}>
                  {selectedGroupMembers.map((member) => {
                    const memberId = member.id || member._id;
                    const memberName = member.fullName || member.username || 'Người dùng';
                    return (
                      <div key={memberId} className={styles.selectedChip}>
                        <span>{memberName}</span>
                        <button type="button" onClick={() => toggleGroupMember(member)}>
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className={styles.modalSearchResults}>
                {groupSearching ? (
                  <div className={styles.emptyState}>Đang tìm kiếm...</div>
                ) : groupSearchResults.length > 0 ? (
                  groupSearchResults.map((user) => {
                    const userId = user.id || user._id;
                    const isSelected = selectedGroupMembers.some(
                      (member) => String(member.id || member._id) === String(userId)
                    );
                    return (
                      <button
                        key={userId}
                        type="button"
                        className={`${styles.memberItem} ${isSelected ? styles.memberItemActive : ''}`}
                        onClick={() => toggleGroupMember(user)}
                      >
                        <div className={styles.memberMeta}>
                          <div className={styles.memberAvatar}>
                            {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className={styles.memberName}>{user.fullName || user.username || 'Người dùng'}</div>
                            <div className={styles.memberHint}>{user.username ? `@${user.username}` : 'Thành viên'}</div>
                          </div>
                        </div>
                        <i className={isSelected ? 'fas fa-check-circle' : 'far fa-circle'}></i>
                      </button>
                    );
                  })
                ) : (
                  <div className={styles.emptyState}>
                    {groupSearch ? 'Không tìm thấy người dùng phù hợp' : 'Nhập tên người dùng để thêm vào nhóm'}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.secondaryBtn} type="button" onClick={resetCreateGroupState}>
                Hủy
              </button>
              <button
                className={styles.primaryBtn}
                type="button"
                onClick={handleCreateGroup}
                disabled={groupCreating}
              >
                {groupCreating ? 'Đang tạo...' : 'Tạo nhóm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Panels */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onLogout={handleLogout}
      />
      <CloudPanel
        isOpen={showCloud}
        onClose={() => setShowCloud(false)}
      />
      <ToolsPanel
        isOpen={showTools}
        onClose={() => setShowTools(false)}
      />
    </>
  );
};

export default Sidebar;