import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PostItem.module.css';

const getAvatarUrl = (avatar, name) => {
  if (avatar) return avatar;
  const safeName = encodeURIComponent(name || 'User');
  return `https://ui-avatars.com/api/?name=${safeName}&background=0084ff&color=fff`;
};

const getAuthor = (post) => {
  if (post.user) return post.user;
  return {
    id: post.author?.id || post.author?._id || post.authorId,
    name: post.authorName || post.author?.fullName || post.author?.name || post.author?.username || 'Người dùng',
    avatar: post.authorAvatar || post.author?.avatar,
  };
};

const getLikeState = (post) => {
  return Boolean(
    post.liked ||
    post.isLiked ||
    post.likeStatus ||
    post.likedByCurrentUser ||
    post.isLikedByCurrentUser ||
    post.likedByMe
  );
};

const getCommentCount = (post) => {
  if (Array.isArray(post.comments)) {
    const count = post.comments.length;
    if (count > 0) return count;
  }
  const count = Number(post.commentCount ?? post.comments ?? 0);
  return Number.isFinite(count) ? count : 0;
};

const PostItem = ({
  post,
  currentUserId,
  onLike,
  onComment,
  onDelete,
  onShare,
  showPrivacyBadge = true,
  showCommentButton = true,
  showShareButton = true,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [bursting, setBursting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const author = getAuthor(post);
  const liked = getLikeState(post);
  const likeCount = Number(post.likes ?? post.likeCount ?? 0);
  const commentCount = getCommentCount(post);
  const imageUrl = post.image || post.imageUrl || (Array.isArray(post.media) ? post.media.find(item => item?.type === 'IMAGE')?.url : '');
  const timeLabel = post.time || post.createdAt || 'Vừa xong';
  const isOwner = String(author.id) === String(currentUserId);

  const handleCardClick = () => {
    if (post.id) navigate(`/post/${post.id}`);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    const nextLiked = !liked;
    if (nextLiked) {
        setBursting(true);
        window.setTimeout(() => setBursting(false), 400);
    }
    const nextLikeCount = nextLiked
        ? likeCount + 1
        : Math.max(0, likeCount - 1);
    onLike?.({ ...post, liked: nextLiked, likes: nextLikeCount });
    };

  const handleCommentClick = (e) => {
    e.stopPropagation();
    onComment?.(post);
  };

  const handleAvatarClick = (e) => {
    e.stopPropagation();
    if (author.id) navigate(`/profile/${author.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.(post);
    setShowMenu(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (post.id) navigate(`/post/edit/${post.id}`);
    setShowMenu(false);
  };

  return (
    <article className={styles.postCard} onClick={handleCardClick}>
      <div className={styles.postHeader}>
        <div className={styles.authorWrap}>
          <img
            src={getAvatarUrl(author.avatar, author.name)}
            alt={author.name}
            className={styles.avatar}
            onClick={handleAvatarClick}
          />
          <div className={styles.authorInfo} onClick={handleAvatarClick}>
            <p className={styles.authorName}>{author.name}</p>
            <p className={styles.meta}>{timeLabel}</p>
          </div>
        </div>
        {showPrivacyBadge && post.privacy && (
          <span className={styles.privacyBadge}>{post.privacy}</span>
        )}
        {isOwner && (onDelete || post.id) && (
          <div className={styles.menuWrap} ref={menuRef}>
            <button className={styles.menuBtn} onClick={(e) => { e.stopPropagation(); setShowMenu(v => !v); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#555"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
            </button>
            {showMenu && (
              <div className={styles.menuDropdown}>
                <button className={styles.menuItem} onClick={handleEditClick}>
                  ✏️ Chỉnh sửa bài viết
                </button>
                <button className={`${styles.menuItem} ${styles.menuDanger}`} onClick={handleDeleteClick}>
                  🗑️ Xóa bài viết
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {post.content && <p className={styles.postContent}>{post.content}</p>}

      {imageUrl && <img src={imageUrl} alt="Post media" className={styles.postImage} />}

      <div className={styles.postCounts}>
        <div className={styles.likeCountRow}>
          <span className={styles.likeBubble}>❤</span>
          <span>{likeCount}</span>
        </div>
        <span>{commentCount} bình luận</span>
      </div>

      <div className={styles.postDivider} />

      <div className={styles.postActions}>
        <button className={`${styles.actionBtn} ${liked ? styles.actionLiked : ''}`} onClick={handleLikeClick}>
          <span className={`${styles.heartIcon} ${bursting ? styles.burst : ''}`}>
            {liked ? '❤️' : '🤍'}
          </span>
          Thích
        </button>
        {showCommentButton && (
          <button className={styles.actionBtn} onClick={handleCommentClick}>
            💬 Bình luận
          </button>
        )}
        {showShareButton && (
          <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); onShare?.(post); }}>
            🔗 Chia sẻ
          </button>
        )}
      </div>
    </article>
  );
};

export default PostItem;
