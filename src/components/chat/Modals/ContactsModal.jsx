import React, { useState } from 'react';
import styles from './SettingsModal.module.css'; // reuse existing modal CSS for overlay

// simple sample contacts list
const sampleContacts = [
  'A A (Sđt Hân Viettel)',
  'A Tuấn Con Bắc Bộ',
  'An Ninh',
  'Anh Thư',
  'Anh Tường',
  'Ánh Tuyết',
];

const ContactsModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = sampleContacts.filter(name =>
    name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Danh sách bạn bè</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles.modalBody}>
          <input
            type="text"
            placeholder="Tìm bạn"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.contactsSearch}
          />
          <ul className={styles.contactsList}>
            {filtered.map((name, idx) => (
              <li key={idx} className={styles.contactItem}>
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactsModal;
