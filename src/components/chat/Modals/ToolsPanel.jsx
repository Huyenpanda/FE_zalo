import React from 'react';
import styles from './ToolsPanel.module.css';

const ToolsPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const tools = [
    { icon: '⚡', title: 'Tin nhắn nhanh', badge: 'BASIC' },
    { icon: '📦', title: 'Danh mục sản phẩm', badge: 'BASIC' },
    { icon: '💬', title: 'Trả lời tự động', badge: 'BASIC' },
    { icon: '⭐', title: 'Tin đánh dấu', badge: '' },
    { icon: '📢', title: 'Tin đồng thời', badge: 'PRO' }
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <button onClick={onClose} className={styles.backBtn}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h2>Công cụ zBusiness</h2>
      </div>

      <div className={styles.body}>
        <div className={styles.grid}>
          {tools.map((tool, index) => (
            <div key={index} className={styles.card}>
              {tool.badge && (
                <span className={`${styles.badge} ${tool.badge === 'PRO' ? styles.pro : styles.basic}`}>
                  {tool.badge}
                </span>
              )}
              <div className={styles.icon}>{tool.icon}</div>
              <h4>{tool.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPanel;