import React from 'react';
import styles from '../Contacts.module.css';
import { IconChevronDown } from '../contactsData';

const FriendRequests = ({ friendRequests, loading, onAccept, onReject, onCancel }) => {
  const { received = [], sent = [] } = friendRequests;

  if (loading) return <div className={styles.emptyState}>Đang tải...</div>;

  return (
    <div className={styles.requestsContainer}>

      {/* Lời mời đã nhận */}
      <div className={styles.requestsSection}>
        <div className={styles.sectionTitle}>Lời mời đã nhận ({received.length})</div>
        {received.length === 0 ? (
          <div className={styles.emptyState} style={{ padding: '16px 0' }}>Không có lời mời nào</div>
        ) : received.map(req => {
          const name = req.fullName || req.username || 'Unknown';
          const avatar = req.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0084ff&color=fff`;
          return (
            <div key={req.id} className={styles.receivedCard}>
              <div className={styles.receivedCardTop}>
                <div className={`${styles.contactAvatar} ${styles.requestAvatar}`}>
                  <img className={styles.avatarImg} src={avatar} alt={name} />
                </div>
                <div className={styles.receivedCardInfo}>
                  <div className={styles.receivedName}>{name}</div>
                  <div className={styles.receivedMeta}>@{req.username}</div>
                </div>
              </div>
              <div className={styles.receivedActions}>
                <button className={styles.btnReject} onClick={() => onReject(req.id)}>Từ chối</button>
                <button className={styles.btnAccept} onClick={() => onAccept(req.id)}>Đồng ý</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lời mời đã gửi */}
      <div className={styles.requestsSection}>
        <div className={styles.sectionTitle}>Lời mời đã gửi ({sent.length})</div>
        <div className={styles.sentGrid}>
          {sent.length === 0 ? (
            <div className={styles.emptyState} style={{ padding: '16px 0' }}>Chưa gửi lời mời nào</div>
          ) : sent.map(req => {
            const name = req.fullName || req.username || 'Unknown';
            const avatar = req.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0084ff&color=fff`;
            return (
              <div key={req.id} className={styles.sentCard}>
                <div className={styles.sentCardTop}>
                  <div className={`${styles.contactAvatar} ${styles.requestAvatar}`}>
                    <img className={styles.avatarImg} src={avatar} alt={name} />
                  </div>
                  <div className={styles.sentCardInfo}>
                    <div className={styles.sentName}>{name}</div>
                    <div className={styles.sentMeta}>@{req.username}</div>
                  </div>
                </div>
                <button className={styles.btnWithdraw} onClick={() => onCancel(req.id)}>
                  Thu hồi lời mời
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendRequests;