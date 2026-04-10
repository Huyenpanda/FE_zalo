// SearchUsers.jsx
import React from 'react';
import styles from '../Contacts.module.css';
import { IconSearch } from '../contactsData';

// Nút hành động thay đổi theo trạng thái quan hệ
const RelationActions = ({ user, status, onSend, onCancel, onAccept, onReject, onChat, loading }) => {
  if (loading) return <span style={{ fontSize: 13, color: '#888' }}>Đang xử lý...</span>;

  switch (status) {
    case 'FRIEND':
      return (
        <button className={styles.btnAccept} onClick={() => onChat(user)}>
          Nhắn tin
        </button>
      );
    case 'SENT':
      return (
        <button className={styles.btnReject} onClick={() => onCancel(user.id)}>
          Đã gửi lời mời ✕
        </button>
      );
    case 'RECEIVED':
      return (
        <>
          <button className={styles.btnReject} onClick={() => onReject(user.id)}>Từ chối</button>
          <button className={styles.btnAccept} onClick={() => onAccept(user.id)}>Đồng ý</button>
        </>
      );
    default: // NONE
      return (
        <button className={styles.btnReject} onClick={() => onSend(user.id)}>
          Kết bạn
        </button>
      );
  }
};

const UserCard = ({ user, status, onSend, onCancel, onAccept, onReject, onChat, actionLoading }) => (
  <div className={`${styles.contactItem} ${styles.searchResultItem}`}>
    <div className={styles.searchResultTop}>
      <div className={styles.contactAvatar}>
        <img
          className={styles.avatarImg}
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username)}&background=0084ff&color=fff`}
          alt={user.fullName || user.username}
        />
        {user.isOnline && <span className={styles.onlineDot} />}
      </div>
      <div className={styles.searchResultInfo}>
        <div className={styles.contactName}>{user.fullName || user.username}</div>
        <div className={`${styles.searchResultStatus} ${user.isOnline ? styles.online : ''}`}>
          {user.isOnline ? '● Online' : '● Offline'}
        </div>
      </div>
    </div>
    <div className={styles.searchResultActions}>
      <RelationActions
        user={user}
        status={status}
        onSend={onSend}
        onCancel={onCancel}
        onAccept={onAccept}
        onReject={onReject}
        onChat={onChat}
        loading={actionLoading}
      />
    </div>
  </div>
);

const SearchUsers = ({
  searchQuery, onSearch,
  searchResults, searchLoading, showResults,
  searchHistory, onRemoveHistory, onClearHistory,
  getRelationStatus,
  onSendRequest, onCancelRequest, onAcceptRequest, onRejectRequest, onStartChat,
  actionLoadingId,
}) => (
  <>
    <div className={styles.toolbar}>
      <div className={styles.searchInput}>
        <span className={styles.searchIcon}><IconSearch /></span>
        <input
          className={styles.searchInputEl}
          type="text"
          placeholder="Tìm kiếm người dùng (tối thiểu 2 ký tự)"
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
          autoFocus
        />
      </div>
    </div>

    <div className={styles.contactsList}>
      {searchLoading ? (
        <div className={styles.searchLoading}>Đang tìm kiếm...</div>

      ) : showResults ? (
        searchResults.length > 0 ? (
          <>
            <div className={styles.letterHeader}>
              Kết quả tìm kiếm ({searchResults.length})
            </div>
            {searchResults.map(user => (
              <UserCard
                key={user.id}
                user={user}
                status={getRelationStatus(user.id)}
                onSend={onSendRequest}
                onCancel={onCancelRequest}
                onAccept={onAcceptRequest}
                onReject={onRejectRequest}
                onChat={onStartChat}
                actionLoading={actionLoadingId === user.id}
              />
            ))}
          </>
        ) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🔍</span>
            <span>Không tìm thấy người dùng</span>
          </div>
        )

      ) : searchHistory.length > 0 ? (
        <>
          <div className={styles.searchHistoryHeader}>
            <span>Tìm kiếm gần đây</span>
            <button className={styles.clearHistoryBtn} onClick={onClearHistory}>Xóa tất cả</button>
          </div>
          {searchHistory.map(user => (
            <div key={user.id} className={`${styles.contactItem} ${styles.searchHistoryItem}`}>
              <div className={styles.searchHistoryTop}>
                <div className={styles.contactAvatar}>
                  <img
                    className={styles.avatarImg}
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username)}&background=0084ff&color=fff`}
                    alt={user.fullName || user.username}
                  />
                </div>
                <div className={styles.searchHistoryInfo}>
                  <div className={styles.contactName}>{user.fullName || user.username}</div>
                  <div className={styles.searchHistoryTime}>@{user.username}</div>
                </div>
                <button className={styles.removeHistoryBtn} onClick={() => onRemoveHistory(user.id)}>✕</button>
              </div>
              <div className={styles.searchResultActions}>
                <RelationActions
                  user={user}
                  status={getRelationStatus(user.id)}
                  onSend={onSendRequest}
                  onCancel={onCancelRequest}
                  onAccept={onAcceptRequest}
                  onReject={onRejectRequest}
                  onChat={onStartChat}
                  loading={actionLoadingId === user.id}
                />
              </div>
            </div>
          ))}
        </>

      ) : (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>👤</span>
          <span>Nhập tên hoặc username để tìm kiếm</span>
        </div>
      )}
    </div>
  </>
);

export default SearchUsers;