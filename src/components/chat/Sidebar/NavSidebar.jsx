import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../services/context/AuthContext';

const navStyles = {
  container: {
    width: 68,
    background: '#000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '12px 0',
    flexShrink: 0,
    height: '100vh',
  },
  top: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  bottom: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    marginBottom: 16,
    cursor: 'pointer',
    border: '2px solid rgba(255,255,255,0.3)',
    objectFit: 'cover',
  },
  navItem: {
    width: 48,
    height: 48,
    border: 'none',
    background: 'transparent',
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 22,
    transition: 'all 0.2s',
    textDecoration: 'none',
  },
  active: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
  },
};

const NavSidebar = ({ activeView = 'messages', onViewChange }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = userStr ? JSON.parse(userStr) : currentUser;
  const avatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0066cc&color=fff`;

  return (
    <div style={navStyles.container}>
      <div style={navStyles.top}>
        <img
          src={avatar}
          alt="User"
          style={navStyles.avatar}
          onClick={() => navigate('/profile')}
        />
        <button
          style={{ ...navStyles.navItem, ...(activeView === 'messages' ? navStyles.active : {}) }}
          onClick={() => { if (onViewChange) onViewChange('messages'); navigate('/chat'); }}
          title="Tin nhắn"
        >
          <i className="fas fa-comment-dots" />
        </button>
        <button
          style={{ ...navStyles.navItem, ...(activeView === 'contacts' ? navStyles.active : {}) }}
          onClick={() => { if (onViewChange) onViewChange('contacts'); navigate('/chat'); }}
          title="Danh bạ"
        >
          <i className="fas fa-address-book" />
        </button>
        <button
          style={{ ...navStyles.navItem, ...(activeView === 'diary' ? navStyles.active : {}) }}
          onClick={() => { if (onViewChange) onViewChange('diary'); navigate('/chat'); }}
          title="Nhật ký"
        >
          <i className="fas fa-book-open" />
        </button>
      </div>
      <div style={navStyles.bottom}>
        <button
          style={navStyles.navItem}
          title="Cài đặt"
          onClick={() => navigate('/profile')}
        >
          <i className="fas fa-cog" />
        </button>
      </div>
    </div>
  );
};

export default NavSidebar;
