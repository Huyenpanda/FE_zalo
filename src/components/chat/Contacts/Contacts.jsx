// Contacts.jsx  (file chính — chỉ còn orchestration, UI tách ra các component con)
import React, { useState, useEffect, useCallback } from 'react';
import { useChat } from '../../../services/context/ChatContext';

import { useFriends } from './hooks/useFriends';
import { useSearch } from './hooks/useSearch';

import FriendsList from './components/FriendsList';
import SearchUsers from './components/SearchUsers';
import FriendRequests from './components/FriendRequests';

import styles from './Contacts.module.css';
import {
  groupList,
  IconSearch,
  IconUserFriends,
  IconUsers,
  IconUserPlus,
  IconUsersGroup,
  IconSort,
  IconFilter,
  IconChevronDown,
  IconAddFriend,
  IconAddGroup,
  IconInbox,
} from './contactsData';

// ─── Menu ──────────────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { id: 'friends',       label: 'Danh sách bạn bè',                  icon: <IconUserFriends /> },
  { id: 'search',        label: 'Tìm kiếm',                          icon: <IconSearch /> },
  { id: 'groups',        label: 'Danh sách nhóm và cộng đồng',       icon: <IconUsers /> },
  { id: 'friendRequests',label: 'Lời mời kết bạn',                   icon: <IconUserPlus /> },
  { id: 'groupRequests', label: 'Lời mời vào nhóm và cộng đồng',    icon: <IconUsersGroup /> },
];

const PAGE_HEADERS = {
  friends:        'Danh sách bạn bè',
  search:         'Tìm kiếm',
  groups:         'Danh sách nhóm và cộng đồng',
  friendRequests: 'Lời mời kết bạn',
  groupRequests:  'Lời mời vào nhóm và cộng đồng',
};

// ─── Main Component ────────────────────────────────────────────────────────────
const Contacts = ({ onBack, onViewChange }) => {
  const { currentUser, selectChat, fetchConversations, createConversation, conversations } = useChat();

  const [activeMenu, setActiveMenu] = useState('friends');
  const [groupSearchQuery, setGroupSearchQuery] = useState('');
  const [groupActivity, setGroupActivity] = useState('all');
  const [groupType, setGroupType] = useState('all');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [notification, setNotification] = useState(null); // { type: 'success'|'error', msg }

  // ── Hooks ──
  const {
    friends, friendsLoading,
    friendRequests, requestsLoading,
    fetchFriends, fetchFriendRequests,
    sendFriendRequest, cancelFriendRequest,
    acceptFriendRequest, rejectFriendRequest,
    getRelationStatus,
  } = useFriends(currentUser);

  const {
    searchQuery, searchResults, searchLoading, showResults, searchHistory,
    search, saveToHistory, removeFromHistory, clearHistory,
  } = useSearch();

  // ── Load data khi đổi tab ──
  useEffect(() => {
    if (activeMenu === 'friends') fetchFriends();
    if (activeMenu === 'friendRequests') fetchFriendRequests();
  }, [activeMenu]);

  // ── Thông báo tạm thời ──
  const notify = useCallback((type, msg) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // ── Gửi lời mời kết bạn ──
  const handleSendRequest = useCallback(async (toUserId) => {
    setActionLoadingId(toUserId);
    const result = await sendFriendRequest(toUserId);
    setActionLoadingId(null);
    if (result.success) {
      notify('success', 'Đã gửi lời mời kết bạn');
    } else {
      notify('error', result.message || 'Gửi lời mời thất bại');
    }
  }, [sendFriendRequest, notify]);

  // ── Thu hồi lời mời ──
  const handleCancelRequest = useCallback(async (toUserId) => {
    setActionLoadingId(toUserId);
    await cancelFriendRequest(toUserId);
    setActionLoadingId(null);
    notify('success', 'Đã thu hồi lời mời');
  }, [cancelFriendRequest, notify]);

  // ── Chấp nhận lời mời → backend tự tạo conversation ──
  const handleAcceptRequest = useCallback(async (requesterId) => {
    setActionLoadingId(requesterId);
    const result = await acceptFriendRequest(requesterId);
    setActionLoadingId(null);

    if (result.success) {
      notify('success', 'Đã chấp nhận lời mời kết bạn! Bây giờ bạn có thể nhắn tin.');
      // Refresh conversation list vì backend vừa tạo conversation mới
      if (result.conversationId) {
        await fetchConversations();
      }
    } else {
      notify('error', 'Có lỗi xảy ra');
    }
  }, [acceptFriendRequest, fetchConversations, notify]);

  // ── Từ chối lời mời ──
  const handleRejectRequest = useCallback(async (requesterId) => {
    setActionLoadingId(requesterId);
    await rejectFriendRequest(requesterId);
    setActionLoadingId(null);
    notify('success', 'Đã từ chối lời mời');
  }, [rejectFriendRequest, notify]);

  // ── Nhắn tin với bạn bè (conversation đã tồn tại do backend tạo khi accept) ──
  const handleStartChat = useCallback(async (user) => {
    saveToHistory(user);

    // Fetch lại conversations để chắc chắn có conversation với user này
    await fetchConversations();

    // Check xem đã có conversation với user này chưa
    const existingConv = conversations.find(conv =>
      conv.type === 'PRIVATE' &&
      (conv.userId === user.id || conv.participants?.some(p => p.id === user.id))
    );

    let targetConv = existingConv;

    if (!targetConv) {
      // Nếu chưa có conversation, tạo mới
      try {
        targetConv = await createConversation(user.id, user);
      } catch (err) {
        console.error('Tạo conversation thất bại:', err);
        notify('error', 'Không thể tạo cuộc trò chuyện');
        return;
      }
    }

    // Select conversation và chuyển sang tab messages
    if (targetConv) {
      selectChat(targetConv);
      if (onViewChange) onViewChange('messages');
    }
  }, [saveToHistory, fetchConversations, conversations, createConversation, selectChat, onViewChange, notify]);

  // ── Tìm kiếm người dùng ──
  const handleSearch = useCallback((query) => {
    search(query);
  }, [search]);

  // ── Đổi tab ──
  const handleMenuChange = (menuId) => {
    setActiveMenu(menuId);
  };

  // ── Groups (dữ liệu mock) ──
  const filteredGroups = groupList.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(groupSearchQuery.toLowerCase());
    const matchActivity = groupActivity === 'all' || g.status === groupActivity;
    const matchType = groupType === 'all' || g.type === groupType;
    return matchSearch && matchActivity && matchType;
  });

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.contactsContainer}>

      {/* Thông báo toast */}
      {notification && (
        <div className={`${styles.toast} ${styles[`toast_${notification.type}`]}`}>
          {notification.msg}
        </div>
      )}

      {/* ── LEFT SIDEBAR ── */}
      <div className={styles.menuSidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.sidebarSearch}>
            <span className={styles.searchIcon}><IconSearch /></span>
            <span className={styles.searchText}>Tìm kiếm</span>
          </div>
          <button className={styles.sidebarActionBtn} title="Thêm bạn"><IconAddFriend /></button>
          <button className={styles.sidebarActionBtn} title="Tạo nhóm"><IconAddGroup /></button>
        </div>

        <div className={styles.menuList}>
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              className={`${styles.menuItem} ${activeMenu === item.id ? styles.menuItemActive : ''}`}
              onClick={() => handleMenuChange(item.id)}
            >
              <span className={`${styles.menuItemIcon} ${activeMenu === item.id ? styles.menuItemIconActive : ''}`}>
                {item.icon}
              </span>
              <span className={styles.menuItemText}>{item.label}</span>

              {/* Badge số lời mời chưa đọc */}
              {item.id === 'friendRequests' && friendRequests.received.length > 0 && (
                <span className={styles.badge}>{friendRequests.received.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── RIGHT CONTENT ── */}
      <div className={styles.contentArea}>
        <div className={styles.pageHeaderBar}>
          <span className={styles.pageHeaderIcon}>
            {MENU_ITEMS.find(m => m.id === activeMenu)?.icon}
          </span>
          <span className={styles.pageHeaderText}>{PAGE_HEADERS[activeMenu]}</span>
        </div>

        <div className={styles.contentBody}>

          {/* Danh sách bạn bè */}
          {activeMenu === 'friends' && (
            <FriendsList
              friends={friends}
              loading={friendsLoading}
              onStartChat={handleStartChat}
            />
          )}

          {/* Tìm kiếm người dùng */}
          {activeMenu === 'search' && (
            <SearchUsers
              searchQuery={searchQuery}
              onSearch={handleSearch}
              searchResults={searchResults}
              searchLoading={searchLoading}
              showResults={showResults}
              searchHistory={searchHistory}
              onRemoveHistory={removeFromHistory}
              onClearHistory={clearHistory}
              getRelationStatus={getRelationStatus}
              onSendRequest={handleSendRequest}
              onCancelRequest={handleCancelRequest}
              onAcceptRequest={handleAcceptRequest}
              onRejectRequest={handleRejectRequest}
              onStartChat={handleStartChat}
              actionLoadingId={actionLoadingId}
            />
          )}

          {/* Nhóm */}
          {activeMenu === 'groups' && (
            <GroupsList
              groups={filteredGroups}
              searchQuery={groupSearchQuery}
              onSearch={setGroupSearchQuery}
              activity={groupActivity}
              onActivityChange={setGroupActivity}
              type={groupType}
              onTypeChange={setGroupType}
            />
          )}

          {/* Lời mời kết bạn */}
          {activeMenu === 'friendRequests' && (
            <FriendRequests
              friendRequests={friendRequests}
              loading={requestsLoading}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
              onCancel={handleCancelRequest}
            />
          )}

          {/* Lời mời vào nhóm */}
          {activeMenu === 'groupRequests' && (
            <div className={styles.emptyRequestsContainer}>
              <div className={styles.emptyState}>
                <IconInbox />
                <span className={styles.emptyText}>Không có lời mời vào nhóm và cộng đồng</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── GroupsList (nhỏ, để luôn trong file này vì ít logic) ─────────────────────
const GroupsList = ({ groups, searchQuery, onSearch, activity, onActivityChange, type, onTypeChange }) => (
  <>
    <div className={styles.countBar}>Nhóm và cộng đồng ({groups.length})</div>
    <div className={`${styles.toolbar} ${styles.groupsToolbar}`}>
      <div className={`${styles.searchInput} ${styles.groupsSearchInput}`}>
        <span className={styles.searchIcon}><IconSearch /></span>
        <input
          className={styles.searchInputEl}
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
        />
      </div>
      <div className={styles.filterSelect}>
        <span className={styles.filterIcon}><IconSort /></span>
        <select className={styles.filterSelectEl} value={activity} onChange={e => onActivityChange(e.target.value)}>
          <option value="all">Hoạt động (mới → cũ)</option>
          <option value="active">Hoạt động cao</option>
          <option value="inactive">Ít hoạt động</option>
        </select>
        <span className={styles.chevronIcon}><IconChevronDown /></span>
      </div>
      <div className={styles.filterSelect}>
        <span className={styles.filterIcon}><IconFilter /></span>
        <select className={styles.filterSelectEl} value={type} onChange={e => onTypeChange(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="group">Nhóm</option>
          <option value="community">Cộng đồng</option>
        </select>
        <span className={styles.chevronIcon}><IconChevronDown /></span>
      </div>
    </div>
    <div className={styles.groupsList}>
      {groups.length > 0 ? groups.map(group => (
        <div key={group.id} className={styles.groupItem}>
          <div className={styles.groupAvatar}>
            <img className={styles.avatarImg} src={group.avatar} alt={group.name} />
          </div>
          <div className={styles.groupInfo}>
            <div className={styles.groupName}>{group.name}</div>
            <div className={styles.groupMeta}>{group.members} thành viên</div>
          </div>
        </div>
      )) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🔍</span>
          <span>Không tìm thấy nhóm phù hợp</span>
        </div>
      )}
    </div>
  </>
);

export default Contacts;