// FriendsList.jsx
import React, { useState, useMemo } from 'react';
import styles from '../Contacts.module.css';
import { IconSearch, IconSort, IconChevronDown, IconMoreV } from '../contactsData';

const FriendsList = ({ friends, loading, onStartChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [hoveredId, setHoveredId] = useState(null);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return friends.filter(f =>
      f.fullName?.toLowerCase().includes(q) ||
      f.username?.toLowerCase().includes(q)
    );
  }, [friends, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const nameA = a.fullName || a.username || '';
      const nameB = b.fullName || b.username || '';
      return sortBy === 'name'
        ? nameA.localeCompare(nameB, 'vi')
        : nameB.localeCompare(nameA, 'vi');
    });
  }, [filtered, sortBy]);

  const grouped = useMemo(() => {
    const g = {};
    sorted.forEach(c => {
      const letter = (c.fullName || c.username || '')[0]?.toUpperCase() || '#';
      if (!g[letter]) g[letter] = [];
      g[letter].push(c);
    });
    return g;
  }, [sorted]);

  const letters = Object.keys(grouped).sort((a, b) => a.localeCompare(b, 'vi'));

  return (
    <>
      <div className={styles.countBar}>Bạn bè ({sorted.length})</div>
      <div className={styles.toolbar}>
        <div className={styles.searchInput}>
          <span className={styles.searchIcon}><IconSearch /></span>
          <input
            className={styles.searchInputEl}
            type="text"
            placeholder="Tìm bạn"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.filterSelect}>
          <span className={styles.filterIcon}><IconSort /></span>
          <select className={styles.filterSelectEl} value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="name">Tên (A-Z)</option>
            <option value="nameReverse">Tên (Z-A)</option>
          </select>
          <span className={styles.chevronIcon}><IconChevronDown /></span>
        </div>
      </div>

      <div className={styles.contactsList}>
        {loading ? (
          <div className={styles.emptyState}>Đang tải...</div>
        ) : letters.length > 0 ? letters.map(letter => (
          <div key={letter}>
            <div className={styles.letterHeader}>{letter}</div>
            {grouped[letter].map(contact => (
              <div
                key={contact.id}
                className={`${styles.contactItem} ${hoveredId === contact.id ? styles.contactItemHover : ''}`}
                onMouseEnter={() => setHoveredId(contact.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={styles.contactAvatar} style={{ position: 'relative' }}>
                  <img
                    className={styles.avatarImg}
                    src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.fullName || contact.username)}&background=0084ff&color=fff`}
                    alt={contact.fullName || contact.username}
                  />
                  {contact.isOnline && <span className={styles.onlineDot} />}
                </div>
                <div className={styles.contactName}>{contact.fullName || contact.username}</div>
                {hoveredId === contact.id && (
                  <button
                    className={styles.btnAccept}
                    style={{ marginRight: 8, padding: '4px 12px', fontSize: 13 }}
                    onClick={() => onStartChat(contact)}
                  >
                    Nhắn tin
                  </button>
                )}
                <button className={`${styles.moreBtn} ${hoveredId === contact.id ? styles.moreBtnVisible : ''}`}>
                  <IconMoreV />
                </button>
              </div>
            ))}
          </div>
        )) : (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>👤</span>
            <span>{searchQuery ? 'Không tìm thấy' : 'Chưa có bạn bè nào'}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default FriendsList;