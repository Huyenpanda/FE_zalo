import React, { useState } from 'react';
import styles from './Login.module.css';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Simulate QR scan or login
  const handleSimulateLogin = () => {
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      // Save dummy user data
      const userData = {
        id: 999,
        name: 'Thu Huyền',
        avatar: 'https://ui-avatars.com/api/?name=Thu+Huyền&background=0084ff&color=fff',
        phoneNumber: '+84 338 147 371'
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirect to chat
      window.location.href = '/chat';
    }, 1500);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.logo}>Zalo</h1>
          <p className={styles.subtitle}>Đăng nhập tài khoản Zalo</p>
          <p className={styles.description}>để kết nối với ứng dụng Zalo Web</p>
        </div>

        {/* QR Login Section */}
        <div className={styles.qrSection}>
          <div className={styles.qrHeader}>
            <h3>Đăng nhập qua mã QR</h3>
            <button className={styles.menuBtn}>≡</button>
          </div>

          <div className={styles.qrCodeArea}>
            <div className={styles.qrPlaceholder}>
              <svg viewBox="0 0 200 200" className={styles.qrSvg}>
                {/* Decorative QR code pattern */}
                <rect x="10" y="10" width="30" height="30" fill="black" rx="3" />
                <rect x="160" y="10" width="30" height="30" fill="black" rx="3" />
                <rect x="10" y="160" width="30" height="30" fill="black" rx="3" />
                
                {/* QR pattern */}
                {Array.from({ length: 169 }).map((_, i) => {
                  const row = Math.floor(i / 13);
                  const col = i % 13;
                  const isBlack = Math.random() > 0.5 && row > 2 && row < 11 && col > 2 && col < 11;
                  return isBlack ? (
                    <rect key={i} x={50 + col * 8} y={50 + row * 8} width="6" height="6" fill="black" />
                  ) : null;
                })}
              </svg>
            </div>

            <div className={styles.qrInfo}>
              <p className={styles.qrNote}>
                <a href="#" className={styles.qrLink}>Chỉ dùng để đăng nhập</a>
              </p>
              <p className={styles.qrNote}>Zalo trên máy tính</p>
            </div>
          </div>
        </div>

        {/* Download PC App Section */}
        <div className={styles.pcSection}>
          <div className={styles.pcIcon}>
            <i className="fas fa-desktop"></i> {/* Computer icon */}
          </div>
          <div className={styles.pcContent}>
            <h4>Nâng cao hiệu quả công việc với Zalo PC</h4>
            <p>Gửi file lên liên dến 1 GB, chuạp nhập, gõi video và nhiều tiện ích hơn nữa</p>
          </div>
          <button 
            className={styles.downloadBtn}
            onClick={handleSimulateLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng nhập...' : 'Tải ngay'}
          </button>
        </div>

        {/* Footer Language */}
        <div className={styles.footer}>
          <a href="#vi" className={styles.langLink}>Tiếng Việt</a>
          <span className={styles.langSeparator}>•</span>
          <a href="#en" className={styles.langLink}>English</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
