// src/pages/Profile/ProfilePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../services/context/AuthContext';
import api from '../services/api';
import styles from './Profilepage.module.css';


// ── PostItem ────────────────────────────────────────────────
function PostItem({ post, onLike, onComment, onDelete, currentUserId }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(!!post.liked);
  const [likeCount, setLikeCount] = useState(Number(post.likes) || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [bursting, setBursting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleLike = (e) => {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    setLikeCount(prev => next ? prev + 1 : Math.max(0, prev - 1));
    if (next) { setBursting(true); setTimeout(() => setBursting(false), 400); }
    onLike?.({ ...post, liked: next });
  };

  const isOwner = String(post.user?.id) === String(currentUserId);

  return (
    <div className={styles.postCard} onClick={() => navigate(`/post/${post.id}`)}>
      {/* Header */}
      <div className={styles.postHeader}>
        <div className={styles.postUser}>
          <img
            src={
              post.user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.user?.name || "U"
              )}&background=0084ff&color=fff`
            }
            alt={post.user?.name}
            className={styles.postAvatar}
            onClick={(e) => {
              e.stopPropagation();
              if (post.user?.id) {
                navigate(`/profile/${post.user.id}`);
              }
            }}
            style={{ cursor: "pointer" }}
          />

          <div
            onClick={(e) => {
              e.stopPropagation();
              if (post.user?.id) {
                navigate(`/profile/${post.user.id}`);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <div className={styles.postNameRow}>
              <span className={styles.postName}>
                {post.user?.name || "Người dùng"}
              </span>

              {post.location && (
                <span className={styles.locationPill}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {post.location}
                </span>
              )}
            </div>

            <div className={styles.postMeta}>
              <span>{post.time || "Vừa xong"}</span>
              <span className={styles.metaDot}>•</span>

              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#777"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
          </div>
        </div>
        {isOwner && (
          <div className={styles.menuWrap} ref={menuRef}>
            <button className={styles.menuBtn} onClick={e => { e.stopPropagation(); setShowMenu(v => !v); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#555"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
            </button>
            {showMenu && (
              <div className={styles.menuDropdown}>
                <button onClick={e => { e.stopPropagation(); navigate(`/post/edit/${post.id}`); setShowMenu(false); }}>
                  ✏️ Chỉnh sửa bài viết
                </button>
                <button className={styles.menuDanger} onClick={e => { e.stopPropagation(); onDelete?.(post); setShowMenu(false); }}>
                  🗑️ Xóa bài viết
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {post.content && <p className={styles.postContent}>{post.content}</p>}

      {/* Music */}
      {post.music && (
        <div className={styles.musicRow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          <span>{post.music}</span>
        </div>
      )}

      {/* Image */}
      {post.image && (
        <div className={styles.postImageWrap}>
          <img src={post.image} alt="" className={styles.postImage} />
        </div>
      )}

      {/* Counts */}
      <div className={styles.postCounts}>
        <div className={styles.likeCountRow}>
          <span className={styles.likeBubble}>❤</span>
          <span>{likeCount}</span>
        </div>
        <span>{post.comments || 0} bình luận</span>
      </div>

      <div className={styles.postDivider} />

      {/* Actions */}
      <div className={styles.postActions}>
        <button className={`${styles.actionBtn} ${liked ? styles.actionLiked : ''}`}
          onClick={toggleLike}>
          <span className={`${styles.heartIcon} ${bursting ? styles.burst : ''}`}>
            {liked ? '❤️' : '🤍'}
          </span>
          Thích
        </button>
        <button className={styles.actionBtn} onClick={e => { e.stopPropagation(); onComment?.(post); }}>
          💬 Bình luận
        </button>
        <button className={styles.actionBtn}>
          🔗 Chia sẻ
        </button>
      </div>
    </div>
  );
}

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
function ProfileInfo({ user, isMe, onMessage, coverRef }) {
  const navigate = useNavigate();
  return (
    <div className={styles.profileInfo}>
      <div className={styles.coverWrap} ref={coverRef}>
        <img src={user.cover || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
          alt="cover" className={styles.coverImg} />
      </div>
      <div className={styles.avatarSection}>
        <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=0084ff&color=fff`}
          alt={user.name} className={styles.profileAvatar} />
        <h2 className={styles.profileName}>{user.name}</h2>
        {user.bio && <p className={styles.profileBio}>{user.bio}</p>}
        {isMe && (
          <button className={styles.editProfileBtn} onClick={() => navigate('/profile/settings')}>
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
      let userData;
      try {
        const res = await api.get(targetId ? `/users/${targetId}` : '/auth/me');
        userData = res.data?.data || res.data;
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
        const rawPosts = postsRes.data?.data || postsRes.data || [];
        const mappedPosts = rawPosts.map(p => ({
          id: p.id || p._id,
          user: {
            id: p.author?.id || p.author?._id || p.userId,
            name: p.author?.fullName || normalized.name,
            avatar: p.author?.avatar || normalized.avatar,
          },
          time: formatTime(p.createdAt),
          content: p.content,
          music: p.music || '',
          image: p.media?.[0]?.url || p.image || '',
          likes: p.likesCount || p.likes || 0,
          comments: p.commentsCount || p.comments || 0,
          liked: p.isLiked || false,
          location: p.location || '',
        }));
        // Merge: API posts trước, mock posts sau (nếu API rỗng thì dùng mock)
        setPosts(mappedPosts.length > 0 ? mappedPosts : MOCK_POSTS);
      } catch {
        setPosts(MOCK_POSTS);
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

  const handleLike = async (post) => {
    try {
      if (String(post.id).startsWith('mock-')) return;
      if (post.liked) {
        await api.delete(`/posts/${post.id}/like`);
      } else {
        await api.post(`/posts/${post.id}/like`);
      }
    } catch (err) {
      console.error('Like error:', err);
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

  const openComments = (post) => {
    setActiveCommentPostId(post.id);
    setCommentDraft('');
  };

  const closeComments = () => {
    setActiveCommentPostId(null);
    setCommentDraft('');
  };

  const handleSendComment = (postId) => {
    const content = commentDraft.trim();
    if (!content) return;

    const newComment = {
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
      [postId]: [newComment, ...(prev[postId] || [])],
    }));

    setPosts(prev => prev.map(post =>
      post.id === postId
        ? { ...post, comments: (Number(post.comments) || 0) + 1 }
        : post
    ));

    setCommentDraft('');
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
    <div className={styles.page}>
      {/* Sticky Header */}
      <div className={`${styles.stickyHeader} ${scrolled ? styles.stickyHeaderVisible : ''}`}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>‹</button>
        <span className={styles.stickyName}>{profileUser?.name}</span>
        <div style={{ flex: 1 }} />
        {isMe && (
          <button className={styles.settingsBtn} onClick={() => navigate('/profile/settings')}>
            ⚙️
          </button>
        )}
      </div>

      {/* Profile Info */}
      {profileUser && <ProfileInfo user={profileUser} isMe={isMe} onMessage={handleMessage} coverRef={coverRef} />}

      {/* Info rows (chỉ hiện cho chính mình) */}
      {isMe && profileUser && (
        <div className={styles.infoSection}>
          {profileUser.username && <InfoRow label="Tên đăng nhập" value={`@${profileUser.username}`} editable={false} />}
          {profileUser.email && <InfoRow label="Email" value={profileUser.email} editable={true} onPress={() => navigate('/profile/settings')} />}
          {profileUser.bio && <InfoRow label="Giới thiệu" value={profileUser.bio} editable={true} onPress={() => navigate('/profile/settings')} />}
        </div>
      )}

      {/* Tabs */}
      <div className={styles.tabs}>
        {['posts', 'photos', 'info'].map(tab => (
          <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab)}>
            {{ posts: 'Bài viết', photos: 'Ảnh', info: 'Giới thiệu' }[tab]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'posts' && (
        <div className={styles.postsSection}>
          {isMe && profileUser && <CreatePostBox user={profileUser} />}
          {posts.length === 0
            ? <div className={styles.emptyPosts}>Chưa có bài viết nào</div>
            : posts.map(post => (
              <React.Fragment key={post.id}>
                <PostItem
                  post={post}
                  currentUserId={profileUser?.id}
                  onLike={handleLike}
                  onComment={() => openComments(post)}
                  onDelete={handleDelete}
                />
                {activeCommentPostId === post.id && (
                  <div className={styles.commentPanel}>
                    <div className={styles.commentPanelHeader}>
                      <div>
                        <strong>Bình luận</strong>
                        <span>{` ${post.comments || 0} bình luận`}</span>
                      </div>
                      <button className={styles.closeCommentBtn} onClick={closeComments}>
                        ✕
                      </button>
                    </div>
                    <div className={styles.commentList}>
                      {(commentsByPost[post.id] || []).length > 0 ? (
                        commentsByPost[post.id].map(comment => (
                          <div key={comment.id} className={styles.commentItem}>
                            <img
                              src={comment.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user.name || 'U')}&background=0084ff&color=fff`}
                              alt={comment.user.name}
                              className={styles.commentAvatar}
                            />
                            <div className={styles.commentContent}>
                              <div className={styles.commentMeta}>
                                <strong>{comment.user.name}</strong>
                                <span>{formatTime(comment.createdAt)}</span>
                              </div>
                              <p>{comment.content}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className={styles.noComments}>Hãy là người đầu tiên bình luận.</div>
                      )}
                    </div>
                    <div className={styles.commentInputRow}>
                      <img
                        src={authUser?.avatar || profileUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.fullName || 'Bạn')}&background=0084ff&color=fff`}
                        alt={authUser?.fullName || 'Bạn'}
                        className={styles.commentAvatar}
                      />
                      <input
                        type="text"
                        value={commentDraft}
                        onChange={(e) => setCommentDraft(e.target.value)}
                        placeholder="Viết bình luận..."
                        className={styles.commentInput}
                      />
                      <button
                        className={styles.sendCommentBtn}
                        onClick={() => handleSendComment(post.id)}
                        disabled={!commentDraft.trim()}
                      >
                        Gửi
                      </button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))
          }
        </div>
      )}

      {activeTab === 'photos' && (
        <div className={styles.photosGrid}>
          {posts.filter(p => p.image).map(p => (
            <img key={p.id} src={p.image} alt="" className={styles.photoThumb}
              onClick={() => navigate(`/post/${p.id}`)} />
          ))}
          {posts.filter(p => p.image).length === 0 && (
            <div className={styles.emptyPosts}>Chưa có ảnh nào</div>
          )}
        </div>
      )}

      {activeTab === 'info' && profileUser && (
        <div className={styles.infoSection}>
          <InfoRow label="Tên hiển thị" value={profileUser.name} editable={isMe} onPress={() => navigate('/profile/settings')} />
          {profileUser.username && <InfoRow label="Username" value={`@${profileUser.username}`} editable={false} />}
          {profileUser.bio && <InfoRow label="Giới thiệu" value={profileUser.bio} editable={isMe} onPress={() => navigate('/profile/settings')} />}
        </div>
      )}
    </div>
  );
}