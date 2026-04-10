//Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/context/AuthContext';
import styles from './Signup.module.css';

export default function SignupScreen() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState(''); // đổi từ email → username
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // Gửi username thay vì email
    const result = await register(username.trim(), password, fullName.trim());
    if (result.success) {
      navigate('/chat');
    } else {
      setError(result.error || 'Đăng ký thất bại');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h1 className={styles.title}>Đăng Ký</h1>
          <p className={styles.subtitle}>Tạo tài khoản mới</p>
          <form onSubmit={handleRegister} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.formGroup}>
              <input type="text" className={styles.input} placeholder="Họ và tên"
                value={fullName} onChange={(e) => setFullName(e.target.value)} disabled={loading} />
            </div>
            <div className={styles.formGroup}>
              {/* Đổi placeholder và state thành username */}
              <input 
  type="email"                    // ← đổi type thành email
  placeholder="Email"             // ← đổi placeholder
  value={username} 
  onChange={(e) => setUsername(e.target.value)}
/>
            </div>
            <div className={styles.formGroup}>
              <input type="password" className={styles.input} placeholder="Mật khẩu"
                value={password} onChange={(e) => setPassword(e.target.value)}
                disabled={loading} autoCapitalize="off" />
            </div>
            <div className={styles.formGroup}>
              <input type="password" className={styles.input} placeholder="Xác nhận mật khẩu"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading} autoCapitalize="off" />
            </div>
            <button type="submit"
              className={`${styles.button} ${loading ? styles.buttonDisabled : ''}`}
              disabled={loading}>
              {loading ? <span className={styles.spinner}></span> : 'Đăng Ký'}
            </button>
            <div className={styles.footer}>
              <span className={styles.footerText}>Đã có tài khoản? </span>
              <button type="button" className={styles.linkButton} onClick={() => navigate('/login')}>
                Đăng nhập ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
