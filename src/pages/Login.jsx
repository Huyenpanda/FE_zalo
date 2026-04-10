//Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/context/AuthContext';
import styles from './Login.module.css';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const result = await login(username.trim(), password);

    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h1 className={styles.title}>Đăng Nhập</h1>
          <p className={styles.subtitle}>Chào mừng trở lại!</p>

          <form onSubmit={handleLogin} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <input
                type="text"
                className={styles.input}
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                autoCapitalize="off"
                autoCorrect="off"
              />
            </div>

            <div className={styles.formGroup}>
              <input
                type="password"
                className={styles.input}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoCapitalize="off"
              />
            </div>

            <button
              type="submit"
              className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                'Đăng Nhập'
              )}
            </button>

            <div className={styles.footer}>
              <span className={styles.footerText}>Chưa có tài khoản? </span>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => navigate('/signup')}
              >
                Đăng ký ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
