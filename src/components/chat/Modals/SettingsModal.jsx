import React, { useState } from 'react';
import styles from './SettingsModal.module.css';

const SettingsModal = ({ isOpen, onClose, onLogout }) => {
  const [view, setView] = useState('main');
  const [language, setLanguage] = useState('vi');

  if (!isOpen) return null;

  const handleLogout = () => {
    if (onLogout) {
      onLogout(() => {
        // After logout callback, redirect to login
        window.location.href = '/login';
      });
    } else {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  const renderMain = () => (
    <div className={styles.modalBody}>
      <div className={styles.section}>
        <button className={styles.menuItem} onClick={() => setView('account')}>
          <div className={styles.itemIcon}>
            <i className="fas fa-user"></i>
          </div>
          <span>Thông tin tài khoản</span>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className={styles.section}>
        <button className={styles.menuItem} onClick={() => setView('settings')}>
          <div className={styles.itemIcon}>
            <i className="fas fa-cog"></i>
          </div>
          <span>Cài đặt</span>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className={styles.section}>
        <button className={styles.menuItem} onClick={() => setView('language')}>
          <div className={styles.itemIcon}>
            <i className="fas fa-globe"></i>
          </div>
          <span>Ngôn ngữ</span>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className={styles.section}>
        <button className={styles.menuItem} onClick={() => setView('support')}>
          <div className={styles.itemIcon}>
            <i className="fas fa-question-circle"></i>
          </div>
          <span>Hỗ trợ</span>
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div className={styles.section}>
        <button className={`${styles.menuItem} ${styles.logout}`} onClick={handleLogout}>
          <span className={styles.logoutText}>Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  const renderAccount = () => (
    <div className={styles.modalBody}>
      <button className={styles.backBtn} onClick={() => setView('main')}>&larr; Quay lại</button>
      <div className={styles.accountHeader}>
        <div className={styles.avatarWrapper}>
          <img
            src="https://ui-avatars.com/api/?name=Thu+Huyền&background=0084ff&color=fff"
            alt="avatar"
            className={styles.avatar}
          />
        </div>
        <h3>Thu Huyền</h3>
      </div>
      <div className={styles.accountInfo}>
        <p>Giới tính: Nữ</p>
        <p>Ngày sinh: 19 tháng 12, 2004</p>
        <p>Điện thoại: +84 338 147 371</p>
      </div>
      <button className={styles.menuItem}>Cập nhật</button>
    </div>
  );

  const renderSettings = () => (
    <div className={styles.modalBody}>
      <button className={styles.backBtn} onClick={() => setView('main')}>&larr; Quay lại</button>
      <ul className={styles.supportList}>
        <li className={styles.supportItem}>Cài đặt chung</li>
        <li className={styles.supportItem}>Quyền riêng tư</li>
        <li className={styles.supportItem}>Giao diện</li>
        <li className={styles.supportItem}>Thông báo</li>
        <li className={styles.supportItem}>Tin nhắn</li>
        <li className={styles.supportItem}>Tiện ích</li>
      </ul>
    </div>
  );

  const renderLanguage = () => (
    <div className={styles.modalBody}>
      <button className={styles.backBtn} onClick={() => setView('main')}>&larr; Quay lại</button>
      <div
        className={`${styles.languageOption} ${language === 'vi' ? styles.selected : ''}`}
        onClick={() => setLanguage('vi')}
      >
        Tiếng Việt
      </div>
      <div
        className={`${styles.languageOption} ${language === 'en' ? styles.selected : ''}`}
        onClick={() => setLanguage('en')}
      >
        English
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className={styles.modalBody}>
      <button className={styles.backBtn} onClick={() => setView('main')}>&larr; Quay lại</button>
      <ul className={styles.supportList}>
        <li className={styles.supportItem}>Thông tin phiên bản</li>
        <li className={styles.supportItem}>Liên hệ</li>
        <li className={styles.supportItem}>Gửi file log tới Zalo</li>
      </ul>
    </div>
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            {view === 'main'
              ? 'Cài đặt'
              : view === 'account'
              ? 'Thông tin tài khoản'
              : view === 'settings'
              ? 'Cài đặt'
              : view === 'language'
              ? 'Ngôn ngữ'
              : view === 'support'
              ? 'Hỗ trợ'
              : ''}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        {view === 'main' && renderMain()}
        {view === 'account' && renderAccount()}
        {view === 'settings' && renderSettings()}
        {view === 'language' && renderLanguage()}
        {view === 'support' && renderSupport()}
      </div>
    </div>
  );
};

export default SettingsModal;
