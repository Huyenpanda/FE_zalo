// src/pages/Profile/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../services/context/AuthContext';
import { useChat } from '../services/context/ChatContext';
import api from '../services/api';
import PostItem from '../components/PostItem/PostItem';
import Sidebar from '../components/chat/Sidebar/Sidebar';
import styles from './Profilepage.module.css';


// ── CreatePostBox ────────────────────────────────────────────
function CreatePostBox({ user, onCreated }) {
  const navigate = useNavigate();
  return (
    <div className={styles.createBox} onClick={() => navigate('/post/create')}>
      <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'U')}&background=0084ff&color=fff`}
        alt="" className={styles.createAvatar} />
      <div className={styles.createInput}>Bạn đang nghĩ gì?</div>
    </div>
  );
}

// ── ProfileInfo ──────────────────────────────────────────────
function ProfileInfo({ user, isMe, onMessage, onEdit, onAvatarChange, coverRef }) {
  const avatarInputRef = React.useRef(null);

  const handleAvatarClick = () => {
    if (isMe) avatarInputRef.current?.click();
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => onAvatarChange?.(ev.target.result, file);
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.profileInfo}>
      <div className={styles.coverWrap} ref={coverRef}>
        <img src={user.cover || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
          alt="cover" className={styles.coverImg} />
      </div>
      <div className={styles.avatarSection}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=0084ff&color=fff`}
            alt={user.name}
            className={styles.profileAvatar}
            onClick={handleAvatarClick}
            style={{ cursor: isMe ? 'pointer' : 'default' }}
          />
          {isMe && (
            <>
              <div onClick={handleAvatarClick} style={{
                position: 'absolute', bottom: 4, right: 4,
                background: 'var(--apple-primary)', borderRadius: '50%',
                width: 28, height: 28, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }}>
                <span style={{ color: '#fff', fontSize: 14 }}>📷</span>
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarFile}
              />
            </>
          )}
        </div>
        <h2 className={styles.profileName}>{user.name}</h2>
        {user.bio && <p className={styles.profileBio}>{user.bio}</p>}
        {isMe && (
          <button className={styles.editProfileBtn} onClick={onEdit}>
            ✏️ Cập nhật thông tin
          </button>
        )}
        {!isMe && (
          <div className={styles.profileActions}>
            <button className={styles.addFriendBtn}>➕ Kết bạn</button>
            <button className={styles.msgBtn} onClick={onMessage}>💬 Nhắn tin</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── InfoRow ──────────────────────────────────────────────────
function InfoRow({ label, value, editable, onPress }) {
  return (
    <div className={`${styles.infoRow} ${editable ? styles.infoRowClickable : ''}`}
      onClick={editable ? onPress : undefined}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
      {editable && <span className={styles.infoChevron}>›</span>}
    </div>
  );
}

const extractPostsList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.posts)) return payload.posts;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.posts)) return payload.data.posts;
  return [];
};

const extractCommentsList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.comments)) return payload.comments;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.comments)) return payload.data.comments;
  return [];
};

const normalizeComment = (comment, fallbackUser) => {
  const user = comment?.user || comment?.author || {};
  return {
    id: comment?.id || comment?._id || `comment-${Date.now()}`,
    user: {
      id: user?.id || user?._id || fallbackUser?.id || 'me',
      name: user?.fullName || user?.name || user?.username || fallbackUser?.name || 'Bạn',
      avatar: user?.avatar || fallbackUser?.avatar || '',
    },
    content: comment?.content || comment?.text || '',
    createdAt: comment?.createdAt || new Date().toISOString(),
  };
};

const normalizePost = (p, fallbackUser) => {
  const commentCount = Array.isArray(p.comments)
    ? p.comments.length
    : Number(p.commentCount ?? p.comments ?? 0) || 0;

  return {
    id: p.id || p._id,
    user: {
      id: p.author?.id || p.author?._id || p.userId || fallbackUser?.id,
      name: p.author?.fullName || p.author?.name || p.author?.username || fallbackUser?.name || 'Người dùng',
      avatar: p.author?.avatar || fallbackUser?.avatar || '',
    },
    time: p.createdAt || p.time || 'Vừa xong',
    content: p.content || p.caption || '',
    music: p.music || '',
    image: p.media?.[0]?.url || p.image || p.imageUrl || '',
    likes: p.likeCount ?? p.likes ?? 0,
    commentCount,
    comments: [],
    liked: Boolean(
      p.liked ??
      p.isLiked ??
      p.likeStatus ??
      p.likedByCurrentUser ??
      p.isLikedByCurrentUser ??
      p.likedByMe ??
      false
    ),
    location: p.location || '',
    privacy: p.privacy || p.visibility || 'PUBLIC',
    raw: p,
  };
};

// ── MOCK DATA (dùng khi API chưa sẵn sàng) ──────────────────
const MOCK_POSTS = [
  {
    id: 'mock-post-1',
    user: { id: 'me', name: 'Bạn', avatar: '' },
    time: '2 giờ trước',
    content: 'Một ngày đi làm thật vui 🌻 Code chạy ngon, cà phê thơm!',
    music: 'Cruel Summer - Taylor Swift',
    image: 'https://images.unsplash.com/photo-1520975958225-5f61d7a0fcb2?w=800&q=60',
    likes: 25, comments: 3, liked: false, location: 'Hà Nội',
  },
  {
    id: 'mock-post-2',
    user: { id: 'me', name: 'Bạn', avatar: '' },
    time: '1 ngày trước',
    content: 'Cuối tuần rảnh rỗi, đọc sách và nghe nhạc 📚',
    music: '',
    image: '',
    likes: 12, comments: 1, liked: true, location: '',
  },
];

const MOCK_USER = {
  id: 'me', name: 'Người dùng', avatar: '', cover: '',
  bio: 'Yêu code, yêu cà phê ☕', email: '', username: '',
};

// ── ProfilePage ──────────────────────────────────────────────
export default function ProfilePage() {
  const { userId } = useParams();
  const { user: authUser } = useAuth();
  const { conversations, selectedChat, selectChat, loading: chatLoading, isInitializing, fetchConversations, currentUser: chatCurrentUser } = useChat();
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef(null);

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [scrolled, setScrolled] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [commentsByPost, setCommentsByPost] = useState({});
  const coverRef = useRef(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', email: '' });
  const [editSaving, setEditSaving] = useState(false);

  const isMe = !userId || String(userId) === String(authUser?.id);

  // Dùng IntersectionObserver thay vì window.scrollY
  // → hoạt động đúng dù page nằm trong container có max-width hay không
  useEffect(() => {
    if (!coverRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-56px 0px 0px 0px' }
    );
    observer.observe(coverRef.current);
    return () => observer.disconnect();
  }, [profileUser]);

  // Refetch posts khi quay lại từ create post page
  useEffect(() => {
    if (location.state?.refresh) {
      loadProfile();
    }
  }, [location.state?.refresh]);

  useEffect(() => {
    loadProfile();
  }, [userId, authUser]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const targetId = userId || authUser?.id;

      // Load user info
      // Load user info
    let userData;
    try {
      if (isMe) {
        const res = await api.get('/auth/me');
        userData = res.data?.data || res.data;
      }
      // Nếu xem profile người khác thì dùng mock/data có sẵn
    } catch {
      userData = null;
    }

      // Merge với authUser hoặc mock nếu profile người khác không có data
      let normalized;
      if (userId && !userData) {
        const mockUsers = {
          'mock-user-1': {
            id: 'mock-user-1',
            name: 'Nguyễn Thị Lan',
            avatar: 'https://ui-avatars.com/api/?name=Nguyen+Thi+Lan&background=0084ff&color=fff',
            cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            bio: 'Yêu thích công nghệ và lập trình 💻',
            email: 'lan.nguyen@example.com',
            username: 'lannguyen',
          },
          'mock-user-2': {
            id: 'mock-user-2',
            name: 'Trần Văn Minh',
            avatar: 'https://ui-avatars.com/api/?name=Tran+Van+Minh&background=ff6b6b&color=fff',
            cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            bio: 'Developer tại FPT Software 🚀',
            email: 'minh.tran@example.com',
            username: 'minhtran',
          },
          'mock-user-4': {
            id: 'mock-user-4',
            name: 'Lê Hoàng Nam',
            avatar: 'https://ui-avatars.com/api/?name=Le+Hoang+Nam&background=6c5ce7&color=fff',
            cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            bio: 'Designer & Frontend Developer 🎨',
            email: 'nam.le@example.com',
            username: 'namle',
          },
        };
        normalized = mockUsers[userId] || {
          id: userId,
          name: 'Người dùng',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent('User')}&background=0084ff&color=fff`,
          cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
          bio: '',
          email: '',
          username: '',
        };
      } else {
        normalized = {
          id: userData?.id || authUser?.id || 'me',
          name: userData?.fullName || authUser?.fullName || MOCK_USER.name,
          avatar: userData?.avatar || authUser?.avatar || '',
          cover: userData?.cover || MOCK_USER.cover,
          bio: userData?.bio || MOCK_USER.bio,
          email: userData?.email || authUser?.email || '',
          username: userData?.username || authUser?.username || '',
        };
      }
      setProfileUser(normalized);

      // Load posts
      try {
        const postsRes = await api.get(`/posts/users/${normalized.id}/posts?page=1&limit=20`);
const rawPosts = extractPostsList(postsRes.data ?? postsRes ?? []);
console.log('RAW post[0]:', JSON.stringify(rawPosts[0])); // ← và cái này
        const mappedPosts = rawPosts
          .map((p) => normalizePost(p, normalized))
          .map((post) => ({ ...post, time: formatTime(post.time) }));
        setPosts(mappedPosts.length > 0 ? mappedPosts : (isMe ? MOCK_POSTS : []));
      } catch {
        setPosts(isMe ? MOCK_POSTS : []);
      }
    } catch (err) {
      setProfileUser({ ...MOCK_USER, name: authUser?.fullName || MOCK_USER.name, avatar: authUser?.avatar || '' });
      setPosts(MOCK_POSTS);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Vừa xong';
    const diff = Date.now() - new Date(dateStr).getTime();
    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    return `${Math.floor(diff / 86400000)} ngày trước`;
  };

  const handleLike = async (updatedPost) => {
    if (String(updatedPost.id).startsWith('mock-')) return;

    // PostItem đã flip liked rồi, dùng thẳng updatedPost.liked
    const nextLiked = updatedPost.liked;

    setPosts(prev => prev.map(item => item.id === updatedPost.id
      ? { ...item, liked: nextLiked, likes: updatedPost.likes }
      : item));

    try {
      if (nextLiked) {
        await api.post(`/posts/${updatedPost.id}/like`);
      } else {
        await api.delete(`/posts/${updatedPost.id}/like`);
      }
    } catch (err) {
      // Revert nếu API lỗi
      setPosts(prev => prev.map(item => item.id === updatedPost.id
        ? { ...item, liked: !nextLiked, likes: nextLiked
            ? Math.max(0, updatedPost.likes - 1)
            : updatedPost.likes + 1 }
        : item));
      console.error('Like error:', err);
    }
  };

  const handleShare = async (post) => {
    if (!post?.id) return;
    const url = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: post.content || 'Bài viết', url });
        return;
      } catch (err) {
        console.error('Share canceled or failed:', err);
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      alert('Đã sao chép liên kết bài viết vào clipboard.');
    } catch (err) {
      console.error('Copy link failed:', err);
      alert('Không thể sao chép liên kết. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (post) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa bài viết này?')) return;
    try {
      if (!String(post.id).startsWith('mock-')) {
        await api.delete(`/posts/${post.id}`);
      }
      setPosts(prev => prev.filter(p => p.id !== post.id));
      if (post.id === activeCommentPostId) {
        setActiveCommentPostId(null);
        setCommentDraft('');
      }
    } catch (err) {
      alert('Xóa thất bại: ' + err.message);
    }
  };

  const loadCommentsForPost = async (postId) => {
    try {
      const res = await api.get(`/posts/${postId}/comments?page=1&limit=20`);
      const rawComments = extractCommentsList(res.data ?? res ?? []);
      const normalizedComments = rawComments.map((comment) => normalizeComment(comment, authUser));
      setCommentsByPost(prev => ({ ...prev, [postId]: normalizedComments }));
      return normalizedComments;
    } catch (err) {
      console.error('Load comments error:', err);
      setCommentsByPost(prev => ({ ...prev, [postId]: [] }));
      return [];
    }
  };

  const openComments = async (post) => {
    setActiveCommentPostId(post.id);
    setCommentDraft('');
    await loadCommentsForPost(post.id);
  };

  const closeComments = () => {
    setActiveCommentPostId(null);
    setCommentDraft('');
  };

  const handleSendComment = async (postId) => {
    const content = commentDraft.trim();
    if (!content) return;

    const optimisticComment = {
      id: `comment-${Date.now()}`,
      user: {
        id: authUser?.id || 'me',
        name: authUser?.fullName || 'Bạn',
        avatar: authUser?.avatar || profileUser?.avatar || '',
      },
      content,
      createdAt: new Date().toISOString(),
    };

    setCommentsByPost(prev => ({
      ...prev,
      [postId]: [optimisticComment, ...(prev[postId] || [])],
    }));

    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, commentCount: (Number(post.commentCount) || 0) + 1 }
        : post
    ));

    setCommentDraft('');

    try {
      const res = await api.post(`/posts/${postId}/comments`, { content });
      const savedComment = normalizeComment(res?.data || res || optimisticComment, authUser);
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: [savedComment, ...(prev[postId] || []).filter(comment => comment.id !== optimisticComment.id)],
      }));
      await loadCommentsForPost(postId);
    } catch (err) {
      console.error('Comment error:', err);
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(comment => comment.id !== optimisticComment.id),
      }));
      setPosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, commentCount: Math.max(0, (Number(post.commentCount) || 0) - 1) }
          : post
      ));
    }
  };
const openEditModal = () => {
  setEditForm({
  fullName: profileUser?.name || '',
  email: profileUser?.email || '',
});
  setShowEditModal(true);
};

const handleSaveProfile = async () => {
  setEditSaving(true);
  try {
    const updatedUser = {
    ...profileUser,
    name: editForm.fullName.trim() || profileUser.name,
  };
    // Cập nhật localStorage để sidebar đồng bộ
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({
      ...stored,
      fullName: updatedUser.name,
    }));
    setProfileUser(updatedUser);
    setShowEditModal(false);
  } catch (err) {
    alert('Lưu thất bại: ' + err.message);
  } finally {
    setEditSaving(false);
  }
};
  const handleMessage = () => {
    if (!profileUser?.id) return;
    navigate(`/messages/${profileUser.id}`);
  };
  if (loading) return (
    <div className={styles.loadingWrap}>
      <div className={styles.spinner} />
    </div>
  );

  return (
    <div className={styles.chatContainer}>
      {/* NAV SIDEBAR — chỉ icons, không danh sách chat */}
      <Sidebar navOnly />

      {/* Profile Content */}
      <div className={styles.page}>
      {/* Top Bar — chỉ có tên + settings, không cần nút back vì đã có sidebar */}
      <div className={styles.topBar}>
        <span className={styles.topBarTitle}>{profileUser?.name || 'Profile'}</span>
        <div style={{ flex: 1 }} />
        {isMe && (
          <button className={styles.topBarSettings} onClick={() => navigate('/profile/settings')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        )}
      </div>

      {/* Cover */}
      {profileUser && (
        <div className={styles.coverSection} ref={coverRef}>
          <img src={profileUser.cover || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80'} alt="cover" className={styles.coverImg} />
          <div className={styles.coverOverlay} />
        </div>
      )}

      {/* Two-column layout */}
      <div className={styles.layout}>
        {/* LEFT SIDEBAR */}
        <aside className={styles.sidebar}>
          {/* Avatar + Name card */}
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarAvatarSection}>
              <img
                src={profileUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser?.name || 'U')}&background=0066cc&color=fff`}
                alt={profileUser?.name}
                className={styles.sidebarAvatar}
              />
              <h2 className={styles.sidebarName}>{profileUser?.name}</h2>
              {profileUser?.bio && <p className={styles.sidebarBio}>{profileUser.bio}</p>}
            </div>
            <div className={styles.sidebarActions}>
              {isMe ? (
                <button className={styles.sidebarEditBtn} onClick={openEditModal}>✏️ Cập nhật thông tin</button>
              ) : (
                <>
                  <button className={styles.sidebarAddFriendBtn}>➕ Kết bạn</button>
                  <button className={styles.sidebarMsgBtn} onClick={handleMessage}>💬 Nhắn tin</button>
                </>
              )}
            </div>
          </div>

          {/* Info card */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>Giới thiệu</h3>
            <div className={styles.sidebarInfoRows}>
              {profileUser?.username && <InfoRow label="Username" value={`@${profileUser.username}`} editable={false} />}
              {profileUser?.email && <InfoRow label="Email" value={profileUser.email} editable={isMe} onPress={() => navigate('/profile/settings')} />}
              <InfoRow label="Bài viết" value={String(posts.length)} editable={false} />
            </div>
          </div>

          {/* Photos card */}
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarCardTitle}>Ảnh</h3>
            <div className={styles.sidebarPhotosGrid}>
              {posts.filter(p => p.image).slice(0, 9).map(p => (
                <img key={p.id} src={p.image} alt="" className={styles.sidebarPhotoThumb} onClick={() => navigate(`/post/${p.id}`)} />
              ))}
              {posts.filter(p => p.image).length === 0 && <p className={styles.sidebarEmptyText}>Chưa có ảnh</p>}
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT — Posts Feed */}
        <main className={styles.feed}>
          {/* Create post box (only for self) */}
          {isMe && profileUser && <CreatePostBox user={profileUser} />}

          {posts.length === 0 ? (
            <div className={styles.emptyPosts}>Chưa có bài viết nào</div>
          ) : (
            posts.map(post => (
              <React.Fragment key={post.id}>
                <PostItem
                  post={post}
                  currentUserId={authUser?.id}
                  onLike={handleLike}
                  onComment={() => navigate(`/post/${post.id}`)}
                  onShare={handleShare}
                  onDelete={handleDelete}
                />
                {activeCommentPostId === post.id && (
                  <div className={styles.commentPanel}>
                    <div className={styles.commentPanelHeader}>
                      <div>
                        <strong>Bình luận</strong>
                        <span>{` ${post.commentCount || 0} bình luận`}</span>
                      </div>
                      <button className={styles.closeCommentBtn} onClick={closeComments}>✕</button>
                    </div>
                    <div className={styles.commentList}>
                      {(commentsByPost[post.id] || []).length > 0 ? (
                        commentsByPost[post.id].map(comment => (
                          <div key={comment.id} className={styles.commentItem}>
                            <img src={comment.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name || 'U')}&background=0066cc&color=fff`} alt="" className={styles.commentAvatar} />
                            <div className={styles.commentContent}>
                              <div className={styles.commentMeta}><strong>{comment.user.name}</strong><span>{formatTime(comment.createdAt)}</span></div>
                              <p>{comment.content}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.noComments}>Hãy là người đầu tiên bình luận.</div>
                      )}
                    </div>
                    <div className={styles.commentInputRow}>
                      <img src={authUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullName || 'Bạn')}&background=0066cc&color=fff`} alt="" className={styles.commentAvatar} />
                      <input type="text" value={commentDraft} onChange={e => setCommentDraft(e.target.value)} placeholder="Viết bình luận..." className={styles.commentInput} />
                      <button className={styles.sendCommentBtn} onClick={() => handleSendComment(post.id)} disabled={!commentDraft.trim()}>Gửi</button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </main>
      </div>

      {/* Photos tab content (vẫn giữ cho tab photos) */}
      {activeTab === 'photos' && false}
      {activeTab === 'info' && false}
      {showEditModal && (
        <div className={styles.editModalOverlay}>
          <div className={styles.editModal}>
            <div className={styles.editModalHeader}>
              <h3 className={styles.editModalTitle}>Cập nhật thông tin</h3>
              <button className={styles.editModalClose} onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className={styles.editModalBody}>
              <label className={styles.editModalLabel}>Họ tên</label>
              <input
                className={styles.editModalInput}
                value={editForm.fullName}
                onChange={e => setEditForm(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Họ tên hiển thị"
              />
            </div>
            <div className={styles.editModalActions}>
              <button className={styles.editModalCancel} onClick={() => setShowEditModal(false)}>Hủy</button>
              <button className={styles.editModalSave} onClick={handleSaveProfile} disabled={editSaving}>
                {editSaving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}