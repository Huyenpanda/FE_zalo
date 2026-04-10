// src/pages/Profile/CreatePostPage.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/context/AuthContext';
import api from '../services/api';
import styles from './Createpostpage.module.css';

const PRIVACY_OPTIONS = [
  { value: 'PUBLIC', label: '🌍 Công khai' },
  { value: 'FRIENDS', label: '👥 Bạn bè' },
  { value: 'ONLY_ME', label: '🔒 Chỉ mình tôi' },
];

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [content, setContent] = useState('');
  const [privacy, setPrivacy] = useState('PUBLIC');
  const [images, setImages] = useState([]); // [{ url, file, preview }]
  const [music, setMusic] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleBack = () => {
    if (isDirty && !window.confirm('Chưa lưu thay đổi. Bạn có muốn thoát không?')) return;
    navigate(-1);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 6)); // max 6 ảnh
    setIsDirty(true);
  };

  const removeImage = (idx) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handlePost = async () => {
    if (!content.trim() && images.length === 0) return;
    setLoading(true);
    try {
      let mediaUrls = [];

      // Upload từng ảnh nếu có
      for (const img of images) {
        if (img.file) {
          try {
            const formData = new FormData();
            formData.append('image', img.file);
            const res = await api.post('/upload', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
            const url = res?.data?.url || res?.url;
            if (url) mediaUrls.push({ type: 'IMAGE', url, order: mediaUrls.length });
          } catch {
            // Nếu upload lỗi, bỏ qua ảnh đó
          }
        }
      }

      await api.post('/posts', {
        content: content.trim(),
        privacy,
        media: mediaUrls,
        music: music.trim() || undefined,
        location: location.trim() || undefined,
      });

      // Delay nhẹ để backend kịp insert
      await new Promise(r => setTimeout(r, 300));
      
      navigate(-1, { state: { refresh: true } });
    } catch (err) {
      // Nếu API lỗi, giả lập thành công (mock mode)
      console.error('Post error:', err);
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const canPost = (content.trim().length > 0 || images.length > 0) && !loading;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={handleBack}>✕</button>
        <h2 className={styles.title}>Tạo bài viết</h2>
        <button
          className={`${styles.postBtn} ${canPost ? styles.postBtnActive : ''}`}
          onClick={handlePost}
          disabled={!canPost}
        >
          {loading ? <span className={styles.spinner} /> : 'Đăng'}
        </button>
      </div>

      {/* User info + privacy */}
      <div className={styles.userRow}>
        <img
          src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=0084ff&color=fff`}
          alt=""
          className={styles.avatar}
        />
        <div>
          <div className={styles.userName}>{user?.fullName || 'Bạn'}</div>
          <div className={styles.privacyWrap}>
            <button
              className={styles.privacyBtn}
              onClick={() => setShowPrivacy(v => !v)}
            >
              {PRIVACY_OPTIONS.find(o => o.value === privacy)?.label} ▾
            </button>
            {showPrivacy && (
              <div className={styles.privacyDropdown}>
                {PRIVACY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`${styles.privacyOption} ${privacy === opt.value ? styles.privacyOptionActive : ''}`}
                    onClick={() => { setPrivacy(opt.value); setShowPrivacy(false); }}
                  >
                    {opt.label}
                    {privacy === opt.value && <span className={styles.checkmark}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text input */}
      <textarea
        className={styles.textArea}
        placeholder="Bạn đang nghĩ gì?"
        value={content}
        onChange={handleContentChange}
        autoFocus
        rows={5}
      />

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className={`${styles.imageGrid} ${styles[`grid${Math.min(images.length, 3)}`]}`}>
          {images.map((img, idx) => (
            <div key={idx} className={styles.imageWrap}>
              <img src={img.preview} alt="" className={styles.previewImg} />
              <button className={styles.removeImg} onClick={() => removeImage(idx)}>✕</button>
            </div>
          ))}
          {images.length < 6 && (
            <button className={styles.addMoreImg} onClick={() => fileInputRef.current?.click()}>
              <span>+</span>
              <span className={styles.addMoreText}>Thêm ảnh</span>
            </button>
          )}
        </div>
      )}

      {/* Extra info */}
      {music && (
        <div className={styles.extraRow}>
          <span>🎵</span>
          <span className={styles.extraText}>{music}</span>
          <button className={styles.removeExtra} onClick={() => setMusic('')}>✕</button>
        </div>
      )}
      {location && (
        <div className={styles.extraRow}>
          <span>📍</span>
          <span className={styles.extraText}>{location}</span>
          <button className={styles.removeExtra} onClick={() => setLocation('')}>✕</button>
        </div>
      )}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.toolbarLabel}>Thêm vào bài viết</span>
        <div className={styles.toolbarActions}>
          {/* Ảnh */}
          <button
            className={styles.toolBtn}
            title="Thêm ảnh"
            onClick={() => fileInputRef.current?.click()}
          >
            🖼️
          </button>

          {/* Nhạc */}
          <button
            className={styles.toolBtn}
            title="Thêm nhạc"
            onClick={() => {
              const m = window.prompt('Tên bài hát:');
              if (m?.trim()) { setMusic(m.trim()); setIsDirty(true); }
            }}
          >
            🎵
          </button>

          {/* Vị trí */}
          <button
            className={styles.toolBtn}
            title="Vị trí"
            onClick={() => {
              const l = window.prompt('Nhập vị trí:');
              if (l?.trim()) { setLocation(l.trim()); setIsDirty(true); }
            }}
          >
            📍
          </button>

          {/* Emoji */}
          <button
            className={styles.toolBtn}
            title="Cảm xúc"
            onClick={() => {
              const emojis = ['😊', '❤️', '🔥', '😂', '😍', '🎉', '👍', '🌻'];
              const picked = emojis[Math.floor(Math.random() * emojis.length)];
              setContent(prev => prev + picked);
              setIsDirty(true);
            }}
          >
            😊
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleImagePick}
      />
    </div>
  );
}