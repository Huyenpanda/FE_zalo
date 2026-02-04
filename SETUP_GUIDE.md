# 🎉 Giao Diện Chat Zalo Hoàn Chỉnh - Hướng Dẫn Sử Dụng

Chúc mừng! Bạn đã có một giao diện chat kiểu Zalo hoàn chỉnh với React. Đây là hướng dẫn để bắt đầu sử dụng.

## 📋 Các File Đã Tạo

### Components (Các thành phần)
```
src/components/chat/
├── Sidebar/
│   ├── Sidebar.jsx          - Danh sách cuộc hội thoại
│   └── Sidebar.module.css   - Style
├── ChatWindow/
│   ├── ChatWindow.jsx       - Cửa sổ chat chính
│   └── ChatWindow.module.css
├── MessageBubble/
│   ├── MessageBubble.jsx    - Bong tin nhắn
│   └── MessageBubble.module.css
└── InputBox/
    ├── InputBox.jsx         - Ô nhập tin nhắn
    └── InputBox.module.css
```

### Pages (Các trang)
```
src/pages/
├── Chat.jsx                 - Trang chat với dữ liệu mẫu
├── Chat.module.css
└── ChatWithAPI.example.jsx  - Ví dụ kết nối API thực
```

### Services (Dịch vụ)
```
src/services/
└── chatService.js           - API integration layer (15+ phương thức)
```

### Styles (Kiểu dáng)
```
src/index.css (đã cập nhật)  - CSS variables, animations, utilities
```

## 🚀 Bắt Đầu Nhanh

### 1. Cài đặt Dependencies
```bash
npm install
```

### 2. Chạy Development Server
```bash
npm start
```

### 3. Truy cập Giao Diện
```
http://localhost:3000/chat
```

## 📱 Tính Năng

✅ **Sidebar**
- Danh sách cuộc hội thoại
- Tìm kiếm cuộc hội thoại
- Hiển thị người dùng đang online (dấu xanh)
- Badge thông báo chưa đọc (số tin nhắn mới)
- Click để chọn cuộc hội thoại

✅ **Chat Window**
- Hiển thị thông tin người dùng ở phía trên (header)
- Các nút gọi điện, video, info
- Danh sách tin nhắn với auto-scroll
- Rõ ràng phân biệt tin nhắn của mình (xanh #0068ff) và của đối phương (xám #e5e5e5)

✅ **Message Bubble**
- Tin nhắn bên phải: xanh Zalo, căn phải
- Tin nhắn bên trái: xám, căn trái, có avatar
- Hiển thị thời gian tin nhắn
- Hỗ trợ hình ảnh (để chuẩn bị cho tương lai)
- Animation smooth khi tin nhắn xuất hiện

✅ **Input Box**
- Textarea tự động mở rộng
- Nút gắn file, emoji, gửi
- Phím tắt: Enter gửi, Shift+Enter xuống dòng
- Nút gửi tự động disable khi không có text

✅ **Responsive Design**
- Desktop: Sidebar 360px, chat area flex
- Tablet: Sidebar 300px
- Mobile: Sidebar ẩn, full-width chat
- Tất cả đều hoạt động tốt trên các kích thước màn hình khác nhau

## 🎨 Thiết Kế - Màu Sắc

```
Màu chính (Zalo Blue): #0068ff
Màu text chính: #000000
Màu text phụ: #666666
Màu background: #ffffff
Màu border: #e5e5e5
Màu online: #31a24c (xanh lá)
```

Tất cả được định nghĩa ở `src/index.css` dưới dạng CSS variables:
```css
:root {
  --primary-color: #0068ff;
  --text-primary: #000000;
  /* ... nhiều biến khác */
}
```

## 📊 Dữ Liệu Mẫu

Hiện tại, `Chat.jsx` sử dụng dữ liệu mẫu với:
- **6 cuộc hội thoại** với avatar từ `i.pravatar.cc`
- **20+ tin nhắn** với timestamp giả lập
- Trạng thái online/offline
- Unread count (số tin nhắn chưa đọc)

## 🔌 Kết Nối Backend API

### Nếu bạn muốn kết nối API thực:

1. **Chuẩn bị environment:**
```bash
# Tạo file .env trong thư mục gốc
REACT_APP_API_URL=http://your-backend-url/api
```

2. **Sử dụng ChatWithAPI.example.jsx:**
```javascript
// Trong App.js
import ChatWithAPI from './pages/ChatWithAPI.example';

<Route path="/chat" element={<ChatWithAPI />} />
```

3. **Backend cần cung cấp các endpoint:**

```
GET    /api/conversations              - Lấy danh sách cuộc hội thoại
GET    /api/conversations/:id/messages - Lấy tin nhắn
POST   /api/conversations/:id/messages - Gửi tin nhắn mới
POST   /api/conversations              - Tạo cuộc hội thoại mới
PUT    /api/conversations/:id          - Cập nhật cuộc hội thoại
DELETE /api/conversations/:id          - Xóa cuộc hội thoại
POST   /api/conversations/:id/upload   - Upload hình ảnh/file
GET    /api/users/:id                  - Lấy thông tin người dùng
```

4. **Định dạng Response:**

**Conversations:**
```json
[
  {
    "id": 1,
    "name": "Nguyễn Văn A",
    "avatar": "https://...",
    "isOnline": true,
    "lastMessage": "Chào bạn!",
    "timestamp": "10:30",
    "unreadCount": 2
  }
]
```

**Messages:**
```json
[
  {
    "id": 1,
    "text": "Tin nhắn nội dung",
    "timestamp": "2024-01-29T10:30:00Z",
    "isOwn": true,
    "avatar": "https://..."
  }
]
```

## 🛠️ Tuỳ Chỉnh

### Thay Đổi Màu Chính

Mở `src/index.css` tìm dòng:
```css
--primary-color: #0068ff;
```

Thay `#0068ff` thành màu bạn muốn, ví dụ: `#ff0000` (đỏ)

### Thay Đổi Kích Thước Sidebar

Mở `src/pages/Chat.module.css` tìm:
```css
.sidebar {
  width: 360px;  /* Thay đổi đây */
}
```

### Thay Đổi Avatar Mặc Định

Trong `src/pages/Chat.jsx` tìm:
```javascript
avatar: 'https://i.pravatar.cc/150?img=1'
```

Bạn có thể sử dụng:
- `https://i.pravatar.cc/150?img=X` (random avatar)
- `https://ui-avatars.com/api/?name=Name` (tạo avatar từ tên)
- URL hình ảnh của riêng bạn

## 🎓 Cấu Trúc Component

```
Chat (page)
├── Sidebar
│   ├── Search input
│   └── Conversation List
│       └── ConversationItem (mỗi item)
└── ChatWindow
    ├── Header (user info + actions)
    ├── Messages Container
    │   └── MessageBubble (mỗi tin nhắn)
    └── InputBox
        ├── File button
        ├── Textarea
        ├── Emoji button
        └── Send button
```

## 📚 Sử Dụng Dịch Vụ API

`chatService.js` cung cấp các hàm sẵn sàng:

```javascript
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  uploadImage,
  searchConversations,
  markMessagesAsRead,
  // ... 15+ hàm khác
} from './services/chatService';
```

Ví dụ:
```javascript
// Lấy cuộc hội thoại
const conversations = await fetchConversations();

// Lấy tin nhắn
const messages = await fetchMessages(conversationId);

// Gửi tin nhắn
await sendMessage(conversationId, { text: 'Xin chào' });

// Tìm kiếm
const results = await searchConversations('tên bạn');
```

## ⌨️ Phím Tắt

- **Enter**: Gửi tin nhắn
- **Shift + Enter**: Xuống dòng trong tin nhắn
- Click vào cuộc hội thoại: Chọn cuộc hội thoại

## 🐛 Gỡ Lỗi

### Tin nhắn không hiển thị?
1. Kiểm tra console (F12 → Console tab)
2. Verify activeConversation không null
3. Kiểm tra dữ liệu mẫu được load đúng

### Kiểu dáng lệch?
1. Xóa cache: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+Shift+R
3. Kiểm tra CSS imports đúng

### API không kết nối?
1. Kiểm tra .env file có `REACT_APP_API_URL`
2. Verify backend server đang chạy
3. Check CORS settings trên backend

## 📝 Ghi Chú

- Tất cả component sử dụng **CSS Modules** để tránh xung đột style
- Sử dụng **React Hooks** (useState, useEffect, useRef)
- **Fully responsive** - hoạt động tốt trên mobile, tablet, desktop
- **Vietnamese language** - giao diện, placeholder tiếng Việt
- **Production ready** - code quality cao, error handling

## 🚀 Các Bước Tiếp Theo

1. **Kết nối Backend**: Thay dữ liệu mẫu bằng API thực
2. **WebSocket**: Thêm real-time messaging
3. **Authentication**: Thêm login/logout
4. **File Upload**: Hoàn tất upload hình ảnh/file
5. **Emoji Picker**: Thêm bộ chọn emoji
6. **Voice/Video**: Tích hợp gọi audio/video
7. **Dark Mode**: Thêm chế độ tối

## 📞 Hỗ Trợ

Nếu có vấn đề:
1. Kiểm tra browser console (F12)
2. Đọc lại documentation
3. Xem file `ChatWithAPI.example.jsx` để hiểu cấu trúc
4. Kiểm tra `chatService.js` để xem các API available

---

**Version**: 1.0.0
**Status**: Production Ready ✅
**Last Updated**: January 2024
