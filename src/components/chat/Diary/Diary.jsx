import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../../services/context/ChatContext';
import api from '../../../services/api';
import PostItem from '../../PostItem/PostItem';
import styles from './Diary.module.css';

const FALLBACK_POSTS = [
  {
    id: 'fallback-1',
    authorName: 'Khúc Triển',
    authorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    content: 'Cuối cùng cũng bảo vệ xong đồ án tốt nghiệp! Cảm ơn thầy cô và các bạn đã hỗ trợ mình suốt thời gian qua. Tối nay nhậu không say không về nhé anh em ơi! 🎓🍺 #graduation #happy',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop',
    createdAt: '2 giờ trước',
    likes: 342,
    comments: [
      { id: 'c1', user: 'Nguyễn Văn A', text: 'Chúc mừng tân kỹ sư nhé! 🥳' },
      { id: 'c2', user: 'Trần B', text: 'Kèo tối nay ở đâu đấy bro?' },
    ],
    privacy: 'PUBLIC',
    liked: false,
  },
  {
    id: 'fallback-2',
    authorName: 'Minh Huy',
    authorAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    content: 'Deadline dí chạy không kịp thở nhưng vẫn phải làm ly cafe cho tỉnh táo. Ai cứu tôi với 😭☕ #worklife #deadline',
    imageUrl: 'https://images.unsplash.com/photo-1484504110495-9cd7c3d2f92e?q=80&w=2000&auto=format&fit=crop',
    createdAt: '5 giờ trước',
    likes: 45,
    comments: [
      { id: 'c3', user: 'Lê Na', text: 'Cố lên ông ơi, sắp cuối tuần rồi' },
    ],
    privacy: 'PUBLIC',
    liked: false,
  },
  {
    id: 'fallback-3',
    authorName: 'Lan Phương',
    authorAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    content: 'Thèm bún đậu mắm tôm quá đi mất. Có ai biết quán nào ngon ở khu Cầu Giấy không ạ? Chỉ mình với 🤤🍃',
    imageUrl: 'https://cdn.tgdd.vn/Files/2021/04/23/1345536/cach-lam-bun-dau-mam-tom-chuan-vi-ha-noi-tai-nha-202201251357599026.jpg',
    createdAt: '1 ngày trước',
    likes: 89,
    comments: [
      { id: 'c4', user: 'Hoàng Tú', text: 'Ra ngõ 68 nhé, quán bà già siêu ngon!' },
      { id: 'c5', user: 'Phạm Hằng', text: 'Đi ăn rủ tui với nha bà' },
    ],
    privacy: 'PUBLIC',
    liked: false,
  },
];

const getAvatarUrl = (user) => {
  const name = user?.fullName || user?.name || user?.username || 'User';
  return user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0084ff&color=fff`;
};

const normalizeComment = (comment) => {
  const user = comment?.user || comment?.author || {};
  return {
    id: comment?.id || comment?._id || `comment-${Date.now()}`,
    user: user?.fullName || user?.name || user?.username || 'Người dùng',
    text: comment?.content || comment?.text || '',
  };
};

const normalizePost = (post, currentUserId) => {
  const author = post.user || post.author || post.createdBy || {};
  const authorId = author.id || author._id || author.userId || '';
  const privacy = post.privacy || post.visibility || '';
  const isOwnPrivatePost = String(authorId) === String(currentUserId) && ['ONLY_ME', 'PRIVATE'].includes(privacy);

  const media = Array.isArray(post.media) ? post.media : [];
  const imageUrl = media.find((item) => item?.type === 'IMAGE')?.url || post.image || post.imageUrl || '';
  const rawComments = Array.isArray(post.comments) ? post.comments : [];
  const normalizedComments = rawComments.map(normalizeComment);

  return {
    id: post.id || post._id || `${post.createdAt || Date.now()}-${Math.random()}`,
    authorName: author.fullName || author.name || author.username || 'Người dùng',
    authorAvatar: getAvatarUrl(author),
    content: post.content || post.caption || 'Không có nội dung',
    imageUrl,
    createdAt: post.createdAt || post.time || 'Vừa xong',
    likes: post.likeCount || post.likes || post.likesCount || 0,
    comments: normalizedComments,
    commentCount: post.commentCount || normalizedComments.length || 0,
    privacy,
    isOwnPrivatePost,
    liked: Boolean(
      post.liked ||
      post.isLiked ||
      post.likeStatus ||
      post.likedByCurrentUser ||
      post.isLikedByCurrentUser ||
      post.likedByMe
    ),
  };
};

const pickPosts = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.posts)) return payload.data.posts;
  return [];
};

const Diary = () => {
  const navigate = useNavigate();
  const { currentUser } = useChat();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentDrafts, setCommentDrafts] = useState({});

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const response = await api.get('/posts/feed', {
          params: { page: 1, limit: 10 },
        });

        const feedPosts = pickPosts(response)
          .map((post) => normalizePost(post, currentUser?.id || currentUser?._id))
          .filter((post) => !post.isOwnPrivatePost);

        setPosts(feedPosts.length > 0 ? feedPosts : FALLBACK_POSTS);
        setError('');
      } catch (err) {
        console.error('Failed to load diary feed:', err);
        setError('Không thể tải nhật ký lúc này. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [currentUser?.id, currentUser?._id]);

  const emptyMessage = useMemo(() => {
    if (loading) return 'Đang tải nhật ký...';
    if (error) return error;
    return 'Chưa có bài viết công khai nào để hiển thị.';
  }, [loading, error]);

  const handleToggleLike = async (postId) => {
    const target = posts.find((item) => item.id === postId);
    if (!target) return;

    const nextLiked = !target.liked;
    setPosts((prev) => prev.map((item) => item.id === postId
      ? { ...item, liked: nextLiked, likes: Math.max(0, Number(item.likes || 0) + (nextLiked ? 1 : -1)) }
      : item));

    try {
      if (nextLiked) {
        await api.post(`/posts/${postId}/like`);
      } else {
        await api.delete(`/posts/${postId}/like`);
      }
    } catch (err) {
      setPosts((prev) => prev.map((item) => item.id === postId
        ? { ...item, liked: target.liked, likes: Number(target.likes || 0) }
        : item));
      console.error('Diary like error:', err);
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
      console.error('Diary share failed:', err);
      alert('Không thể sao chép liên kết. Vui lòng thử lại.');
    }
  };

  const handleSubmitComment = async (postId) => {
    const content = (commentDrafts[postId] || '').trim();
    if (!content) return;

    const optimisticComment = {
      id: `comment-${Date.now()}`,
      user: 'Bạn',
      text: content,
    };

    setPosts((prev) => prev.map((item) => item.id === postId
      ? { ...item, comments: [optimisticComment, ...(item.comments || [])], commentCount: (Number(item.commentCount || item.comments?.length || 0)) + 1 }
      : item));
    setCommentDrafts((prev) => ({ ...prev, [postId]: '' }));

    try {
      const res = await api.post(`/posts/${postId}/comments`, { content });
      const savedComment = normalizeComment(res?.data || res || optimisticComment);
      setPosts((prev) => prev.map((item) => item.id === postId
        ? {
            ...item,
            comments: [savedComment, ...(item.comments || []).filter((comment) => comment.id !== optimisticComment.id)],
            commentCount: Math.max(1, Number(item.commentCount || item.comments?.length || 0)),
          }
        : item));
    } catch (err) {
      setPosts((prev) => prev.map((item) => item.id === postId
        ? {
            ...item,
            comments: (item.comments || []).filter((comment) => comment.id !== optimisticComment.id),
            commentCount: Math.max(0, (Number(item.commentCount || item.comments?.length || 0)) - 1),
          }
        : item));
      console.error('Diary comment error:', err);
    }
  };

  return (
    <div className={styles.diaryPage}>
      <div className={styles.headerBar}>
        <div>
          <p className={styles.eyebrow}>Nhật ký</p>
          <h2 className={styles.title}>Bài viết của bạn bè và người khác</h2>
        </div>
        <button className={styles.profilePostsBtn} onClick={() => navigate('/profile')}>
          Profile Posts
        </button>
      </div>

      <div className={styles.feedList}>
        {loading && <div className={styles.stateCard}>{emptyMessage}</div>}
        {!loading && !error && posts.length === 0 && (
          <div className={styles.stateCard}>{emptyMessage}</div>
        )}
        {!loading && !error && posts.map((post) => (
          <div key={post.id}>
            <PostItem
              post={post}
              currentUserId={currentUser?.id || currentUser?._id}
              onLike={handleToggleLike}
              onComment={() => navigate(`/post/${post.id}`)}
              onShare={handleShare}
              showPrivacyBadge
              showCommentButton={true}
              showShareButton={true}
            />
            <div className={styles.actionsRow}>
              <div className={styles.commentComposer}>
                <input
                  id={`comment-input-${post.id}`}
                  value={commentDrafts[post.id] || ''}
                  onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                  placeholder="Viết bình luận..."
                  className={styles.commentInput}
                />
                <button className={styles.sendBtn} onClick={() => handleSubmitComment(post.id)}>Gửi</button>
              </div>
            </div>

            {Array.isArray(post.comments) && post.comments.length > 0 && (
              <div className={styles.commentList}>
                {post.comments.slice(0, 2).map((comment) => (
                  <div className={styles.commentItem} key={comment.id}>
                    <span className={styles.commentUser}>{comment.user}</span>
                    <span className={styles.commentText}>{comment.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Diary;
