import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../services/context/AuthContext';
import api from '../services/api';
import PostItem from '../components/PostItem/PostItem';
import styles from './PostDetail.module.css';

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
      name: user?.fullName || user?.name || user?.username || fallbackUser?.fullName || fallbackUser?.name || 'Bạn',
      avatar: user?.avatar || fallbackUser?.avatar || '',
    },
    content: comment?.content || comment?.text || '',
    createdAt: comment?.createdAt || new Date().toISOString(),
  };
};

const normalizePost = (p, fallbackUser) => {
  const author = p.user || p.author || p.createdBy || {};
  const commentCount = Number(p.commentCount ?? p.comments ?? p.comments?.length ?? 0) || 0;
  return {
    id: p.id || p._id,
    user: {
      id: author.id || author._id || fallbackUser?.id,
      name: author.fullName || author.name || author.username || fallbackUser?.fullName || fallbackUser?.name || 'Người dùng',
      avatar: author.avatar || fallbackUser?.avatar || '',
    },
    time: p.createdAt || p.time || 'Vừa xong',
    content: p.content || p.caption || '',
    music: p.music || '',
    image: p.media?.[0]?.url || p.image || p.imageUrl || '',
    likes: p.likeCount ?? p.likes ?? p.likesCount ?? 0,
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

const formatTime = (dateStr) => {
  if (!dateStr) return 'Vừa xong';
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60000) return 'Vừa xong';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
  return `${Math.floor(diff / 86400000)} ngày trước`;
};

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentDraft, setCommentDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      if (!postId) return;
      setLoading(true);
      setError('');
      try {
        const postRes = await api.get(`/posts/${postId}`);
        const data = postRes?.data ?? postRes;
        const normalizedPost = normalizePost(data, authUser);
        setPost({ ...normalizedPost, time: formatTime(normalizedPost.time) });
      } catch (err) {
        console.error('Failed to load post detail:', err);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [postId, authUser]);

  useEffect(() => {
    const loadComments = async () => {
      if (!postId) return;
      try {
        const res = await api.get(`/posts/${postId}/comments?page=1&limit=50`);
        const rawComments = extractCommentsList(res?.data ?? res ?? []);
        setComments(rawComments.map((comment) => normalizeComment(comment, authUser)));
      } catch (err) {
        console.error('Failed to load comments:', err);
        setComments([]);
      }
    };

    loadComments();
  }, [postId, authUser]);

  const handleLike = async (currentPost) => {
    if (!currentPost?.id) return;
    const nextLiked = !currentPost.liked;
    setPost((prev) => prev ? {
      ...prev,
      liked: nextLiked,
      likes: Math.max(0, Number(prev.likes || 0) + (nextLiked ? 1 : -1)),
    } : prev);

    try {
      if (nextLiked) {
        await api.post(`/posts/${currentPost.id}/like`);
      } else {
        await api.delete(`/posts/${currentPost.id}/like`);
      }
    } catch (err) {
      console.error('Post detail like error:', err);
      setPost((prev) => prev ? { ...prev, liked: currentPost.liked, likes: Number(currentPost.likes || 0) } : prev);
    }
  };

  const handleSendComment = async () => {
    const content = commentDraft.trim();
    if (!content || !post?.id) return;

    const optimisticComment = {
      id: `comment-${Date.now()}`,
      user: {
        id: authUser?.id || 'me',
        name: authUser?.fullName || authUser?.name || 'Bạn',
        avatar: authUser?.avatar || '',
      },
      content,
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [optimisticComment, ...prev]);
    setPost((prev) => prev ? { ...prev, commentCount: (Number(prev.commentCount || 0) + 1) } : prev);
    setCommentDraft('');

    try {
      const res = await api.post(`/posts/${post.id}/comments`, { content });
      const savedComment = normalizeComment(res?.data ?? res ?? optimisticComment, authUser);
      setComments((prev) => [savedComment, ...prev.filter((comment) => comment.id !== optimisticComment.id)]);
    } catch (err) {
      console.error('Post detail comment error:', err);
      setComments((prev) => prev.filter((comment) => comment.id !== optimisticComment.id));
      setPost((prev) => prev ? { ...prev, commentCount: Math.max(0, Number(prev.commentCount || 1) - 1) } : prev);
    }
  };

  const handleShare = async () => {
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

  if (loading) {
    return <div className={styles.loadingWrap}>Đang tải bài viết...</div>;
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>‹</button>
          <h2 className={styles.pageTitle}>Chi tiết bài viết</h2>
        </div>
        <div className={styles.errorMessage}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>‹</button>
        <h2 className={styles.pageTitle}>Chi tiết bài viết</h2>
      </div>
      {post && (
        <>
          <PostItem
            post={post}
            currentUserId={authUser?.id}
            onLike={handleLike}
            onShare={handleShare}
            showCommentButton={false}
            showShareButton={true}
          />
          <div className={styles.commentSection}>
            <div className={styles.commentHeader}>
              <h3 className={styles.commentTitle}>Bình luận</h3>
              <span className={styles.commentCount}>{post.commentCount || 0} bình luận</span>
            </div>
            <div className={styles.commentComposer}>
              <input
                className={styles.commentInput}
                type="text"
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                placeholder="Viết bình luận..."
              />
              <button
                className={styles.sendCommentBtn}
                onClick={handleSendComment}
                disabled={!commentDraft.trim()}
              >
                Gửi
              </button>
            </div>
            <div className={styles.commentList}>
              {comments.length === 0 ? (
                <div className={styles.noComments}>Chưa có bình luận nào.</div>
              ) : (
                comments.map((comment) => (
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
                      <p className={styles.commentText}>{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
