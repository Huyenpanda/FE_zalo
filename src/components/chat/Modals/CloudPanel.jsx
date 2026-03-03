import React from 'react';
import styles from './CloudPanel.module.css';

const CloudPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <button onClick={onClose} className={styles.backBtn}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2>Cloud của tôi</h2>
      </div>

      <div className={styles.body}>
        <div className={styles.cloudInfo}>
          <div className={styles.cloudIcon}>
            <i className="fas fa-cloud"></i>
          </div>
          <h3>My Documents</h3>
          <p>Lưu và đồng bộ dữ liệu giữa các thiết bị</p>
        </div>

        <div className={styles.storage}>
          <div className={styles.storageHeader}>
            <span>Dung lượng</span>
            <span>337 MB / 500 MB</span>
          </div>
          <div className={styles.storageBar}>
            <div className={styles.fill} style={{ width: '67%' }}>
              <span className={styles.segment1}></span>
              <span className={styles.segment2}></span>
              <span className={styles.segment3}></span>
            </div>
          </div>
          <div className={styles.legend}>
            <span><i style={{ color: '#ff9800' }}>●</i> Ảnh</span>
            <span><i style={{ color: '#4caf50' }}>●</i> Video</span>
            <span><i style={{ color: '#ffc107' }}>●</i> File</span>
            <span><i style={{ color: '#9e9e9e' }}>●</i> Khác</span>
          </div>
        </div>

        <button className={styles.viewBtn}>
          Xem và đơn dẹp My Documents
        </button>

        <div className={styles.tip}>
          <div className={styles.tipIcon}>
            <i className="fas fa-lightbulb"></i>
          </div>
          <div className={styles.tipContent}>
            <h4>Nâng cấp dung lượng My Documents</h4>
            <p>Mở rộng dung lượng lên đến 100GB và tự động bảo toàn dữ liệu trọn đời với zCloud.</p>
            <button className={styles.upgradeBtn}>Thêm dung lượng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudPanel;