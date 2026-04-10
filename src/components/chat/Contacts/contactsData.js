// contactsData.js
import React from 'react';

// DATA
export const allContacts = [
  { id: 1, name: 'A A (Sđt Hân Viettel)', avatar: 'https://ui-avatars.com/api/?name=AA&background=0084ff&color=fff' },
  { id: 2, name: 'A Tuấn Con Bắc Bộ', avatar: 'https://ui-avatars.com/api/?name=ATB&background=ff6b6b&color=fff' },
  { id: 3, name: 'An Ninh', avatar: 'https://ui-avatars.com/api/?name=AN&background=51cf66&color=fff' },
  { id: 4, name: 'Anh Thư', avatar: 'https://ui-avatars.com/api/?name=AT&background=ffd93d&color=000' },
  { id: 5, name: 'Anh Tường', avatar: 'https://ui-avatars.com/api/?name=AT2&background=6c5ce7&color=fff' },
  { id: 6, name: 'Ánh Tuyết', avatar: 'https://ui-avatars.com/api/?name=AT3&background=fd79a8&color=fff' },
  { id: 7, name: 'Bác Đạo', avatar: 'https://ui-avatars.com/api/?name=BD&background=a29bfe&color=fff' },
  { id: 8, name: 'Bác Khiêm', avatar: 'https://ui-avatars.com/api/?name=BK&background=74b9ff&color=fff' },
  { id: 9, name: 'Bác Văn', avatar: 'https://ui-avatars.com/api/?name=BV&background=81ecec&color=000' },
  { id: 10, name: 'Bách Nguyễn', avatar: 'https://ui-avatars.com/api/?name=BN&background=fab1a0&color=fff' },
  { id: 11, name: 'Cô Ba', avatar: 'https://ui-avatars.com/api/?name=CB&background=55efc4&color=000' },
  { id: 12, name: 'Chị Hằng', avatar: 'https://ui-avatars.com/api/?name=CH&background=74b9ff&color=fff' },
  { id: 13, name: 'Duy Anh', avatar: 'https://ui-avatars.com/api/?name=DA&background=fd79a8&color=fff' },
  { id: 14, name: 'Đình Khoa', avatar: 'https://ui-avatars.com/api/?name=DK&background=6c5ce7&color=fff' },
  { id: 15, name: 'Eby Phuong', avatar: 'https://ui-avatars.com/api/?name=EP&background=0984e3&color=fff' },
];

export const groupList = [ 
     { id: 1, name: '(N9) SĂN SALE CÙNG NA', members: 492, avatar: 'https://ui-avatars.com/api/?name=N9&background=ff7675&color=fff', status: 'active', type: 'community' },
  { id: 2, name: 'Nhóm Gắn Link YTB', members: 845, avatar: 'https://ui-avatars.com/api/?name=NL&background=74b9ff&color=fff', status: 'active', type: 'group' },
  { id: 3, name: 'GIA SƯ MÔN VĂN - TTGS GIA BẢO', members: 98, avatar: 'https://ui-avatars.com/api/?name=GS&background=55efc4&color=000', status: 'active', type: 'community' },
  { id: 4, name: 'EPU - CẦN LÀ CÓ (1)', members: 968, avatar: 'https://ui-avatars.com/api/?name=EPU&background=1abc9c&color=fff', status: 'active', type: 'group' },
  { id: 5, name: 'EPU IT - SG GV 2025-2026 - PROJECT 1', members: 7, avatar: 'https://ui-avatars.com/api/?name=EPU&background=6c5ce7&color=fff', status: 'inactive', type: 'group' },
  { id: 6, name: 'SDF_ Tiệm may chị Hà, Sn 42, ngõ 66 Dịch Vọng Hậu', members: 9, avatar: 'https://ui-avatars.com/api/?name=SDF&background=00b894&color=fff', status: 'active', type: 'community' },
  { id: 7, name: 'D17 - Thực tập môn học - Thầy Phạm Quang Huy', members: 95, avatar: 'https://ui-avatars.com/api/?name=D17&background=fdcb6e&color=000', status: 'active', type: 'group' },
  { id: 8, name: 'CHIT_CHAT TEAM DEV META', members: 6, avatar: 'https://ui-avatars.com/api/?name=CC&background=ff7675&color=fff', status: 'inactive', type: 'community' },
  { id: 9, name: 'Cư dân 59 hồ tùng mậu', members: 81, avatar: 'https://ui-avatars.com/api/?name=CD&background=74b9ff&color=fff', status: 'active', type: 'community' },
  { id: 10, name: 'Nhóm GV trường THThanh Thúy', members: 28, avatar: 'https://ui-avatars.com/api/?name=TH&background=ffeaa7&color=000', status: 'active', type: 'group' },
  { id: 11, name: 'Thực tập HTTTQL - D17CNPM456', members: 40, avatar: 'https://ui-avatars.com/api/?name=HT&background=ff9ff3&color=000', status: 'inactive', type: 'group' },
  { id: 12, name: 'Nhóm Bán hàng Online', members: 224, avatar: 'https://ui-avatars.com/api/?name=BH&background=82589f&color=fff', status: 'active', type: 'community' }

 ];

export const friendRequestsMock = {
  received: [
    { id: 101, name: 'Phạm Thị Đoán', message: 'Xin chào, mình là Phạm Thị Đoán. Kết bạn với mình nhé!', date: '16/03', source: 'Từ cửa sổ trò chuyện', avatar: 'https://ui-avatars.com/api/?name=PT&background=ffeaa7&color=000' },
  ],
  sent: [
    { id: 102, name: 'Việt Anh', date: '12/03', avatar: 'https://ui-avatars.com/api/?name=VA&background=74b9ff&color=fff' },
    { id: 103, name: 'Nguyễn Đạt', date: '11/03', avatar: 'https://ui-avatars.com/api/?name=ND&background=fd79a8&color=fff' },
    { id: 104, name: 'Phạm Quang Huy', date: '16/01', badge: 'Business', avatar: 'https://ui-avatars.com/api/?name=PQ&background=6c5ce7&color=fff' },
  ],
};

export const friendRecommendations = [
  { id: 201, name: 'Nguyễn Thế Hưng', mutualGroups: '7 nhóm chung', avatar: 'https://ui-avatars.com/api/?name=NTH&background=74b9ff&color=fff' },
  { id: 202, name: 'Nguyễn Quỳnh Nga', mutualGroups: '4 nhóm chung', avatar: 'https://ui-avatars.com/api/?name=NQ&background=ff7675&color=fff' },
  { id: 203, name: 'Ngọc Huyền', mutualGroups: '1 nhóm chung', avatar: 'https://ui-avatars.com/api/?name=NH&background=55efc4&color=000' },
  { id: 204, name: 'Nguyễn Thị Thùy', mutualGroups: '1 nhóm chung', avatar: 'https://ui-avatars.com/api/?name=NTT&background=ffeaa7&color=000' },
  { id: 205, name: 'Bang Phạm', mutualGroups: 'Có thể bạn quen', avatar: 'https://ui-avatars.com/api/?name=BP&background=48dbfb&color=000' },
  { id: 206, name: 'Hoa Nương', mutualGroups: 'Có thể bạn quen', avatar: 'https://ui-avatars.com/api/?name=HN&background=6c5ce7&color=fff' },
];


// ICONS

export const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
export const IconUserFriends = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
export const IconUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
export const IconUserPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);
export const IconUsersGroup = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
export const IconMoreV = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
  </svg>
);
export const IconSort = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
  </svg>
);
export const IconFilter = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
export const IconChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
export const IconAddFriend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
  </svg>
);
export const IconAddGroup = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
export const IconInbox = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
  </svg>
);
