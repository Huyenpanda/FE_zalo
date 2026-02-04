# 🚀 Zalo Chat Interface - Quick Start Guide

## ✨ What's New

Your e-commerce React application has been transformed with a **Zalo-like messaging interface**. The new chat system is fully responsive, modern, and production-ready.

## 📍 Access the Chat Interface

### Start the Application
```bash
npm start
```

### Navigate to Chat
Open your browser and go to:
```
http://localhost:3000/chat
```

## 🎯 Features at a Glance

### Sidebar
✅ List of conversations with avatars  
✅ Online/offline status indicators  
✅ Last message preview  
✅ Unread message badges  
✅ Real-time search filter  

### Chat Window
✅ Chat header with user info and action buttons  
✅ Scrollable message history  
✅ Auto-scroll to latest message  
✅ Message timestamps  

### Message Bubbles
✅ Different styling for sent (blue) vs received (gray) messages  
✅ Smooth animations on new messages  
✅ Support for text and image messages  
✅ Timestamp on each message  

### Input Box
✅ Multi-line text input  
✅ File attachment button  
✅ Emoji button  
✅ Send button with keyboard shortcut (Enter)  
✅ Smart button state management  

## 🎨 Design Specifications

| Element | Color | Usage |
|---------|-------|-------|
| Primary | #0068ff | Sent messages, buttons, highlights |
| Secondary | #e5e5e5 | Received messages, borders |
| Text Primary | #000000 | Main text |
| Text Secondary | #666666 | Secondary text |
| Text Tertiary | #999999 | Disabled text, timestamps |
| Background Light | #f0f0f0 | Input background, hover states |
| Success | #31a24c | Online status indicator |

## 📱 Responsive Behavior

### Desktop (1200px+)
```
┌─────────────┬──────────────────────┐
│             │                      │
│   Sidebar   │    Chat Window       │
│  (360px)    │                      │
│             │                      │
└─────────────┴──────────────────────┘
```

### Tablet (768px - 1024px)
```
┌──────────┬─────────────────────┐
│  Sidebar │   Chat Window       │
│ (320px)  │                     │
│          │                     │
└──────────┴─────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────────┐
│   Conversation List  │
├──────────────────────┤
│   Chat Window        │
│                      │
│                      │
└──────────────────────┘
```

## 🔧 Component Structure

```
Chat (Main Page)
├── Sidebar
│   └── Conversation List Items
├── ChatWindow
│   ├── ChatHeader
│   ├── Messages Container
│   │   └── MessageBubble (Multiple)
│   └── InputBox
```

## 💾 Sample Data

The application comes with demo conversations:
- **Nguyễn Văn A** - Online, last message 10:30
- **Trần Thị B** - Online, 2 unread messages
- **Tech Team** - Offline, last message yesterday
- **Lê Hoàng C** - Online, 1 unread message
- **Project Group** - Online
- **Phạm Minh D** - Offline

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send message |
| `Shift+Enter` | New line in message |

## 🎮 User Interactions

### Select a Conversation
1. Click any conversation in the sidebar
2. The conversation will highlight in blue
3. Messages load in the chat window

### Send a Message
1. Type your message in the input field
2. Press `Enter` or click the send button
3. Message appears in the chat with timestamp

### Search Conversations
1. Click the search icon in sidebar header
2. Type name or keyword
3. Conversations filter in real-time

## 📦 Installation & Setup

### Prerequisites
- Node.js 14+
- npm or yarn

### Steps
1. Navigate to project directory
```bash
cd c:\Web_reactjs\WebNC\fe-zalo
```

2. Install dependencies (if not done)
```bash
npm install
```

3. Start development server
```bash
npm start
```

4. Open browser and navigate to:
```
http://localhost:3000/chat
```

## 🔌 Connecting to Backend

### Current Implementation
The chat component uses sample data for demo purposes.

### To Connect Real Data

1. **Create API service** (`src/services/chatService.js`):
```javascript
export const fetchConversations = async () => {
  const response = await fetch('/api/conversations');
  return response.json();
};

export const fetchMessages = async (conversationId) => {
  const response = await fetch(`/api/conversations/${conversationId}/messages`);
  return response.json();
};

export const sendMessage = async (conversationId, message) => {
  const response = await fetch(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
  return response.json();
};
```

2. **Update Chat.jsx** to use API:
```javascript
import { fetchConversations, fetchMessages, sendMessage } from '../../services/chatService';

useEffect(() => {
  const loadConversations = async () => {
    const data = await fetchConversations();
    setConversations(data);
  };
  loadConversations();
}, []);
```

## 🎨 Customization Examples

### Change Primary Color
Edit `src/styles/global.css`:
```css
:root {
  --primary-color: #your-color;
}
```

### Add New Sidebar Button
Edit `src/components/chat/Sidebar/Sidebar.jsx`:
```javascript
<button className={styles.actionBtn} title="Your Button">
  <YourIcon />
</button>
```

### Customize Message Bubble Style
Edit `src/components/chat/MessageBubble/MessageBubble.module.css`:
```css
.messageBubble {
  /* Your custom styles */
}
```

## 📂 File Structure

```
src/
├── components/
│   └── chat/
│       ├── Sidebar/
│       │   ├── Sidebar.jsx (Component)
│       │   └── Sidebar.module.css (Styles)
│       ├── ChatWindow/
│       │   ├── ChatWindow.jsx
│       │   └── ChatWindow.module.css
│       ├── MessageBubble/
│       │   ├── MessageBubble.jsx
│       │   └── MessageBubble.module.css
│       └── InputBox/
│           ├── InputBox.jsx
│           └── InputBox.module.css
├── pages/
│   ├── Chat.jsx (Main page component)
│   └── Chat.module.css
├── styles/
│   └── global.css (Global styles & variables)
└── App.js (Updated with /chat route)
```

## ✅ Testing the Interface

### Test Scenarios

1. **Send Message**
   - Type text and press Enter
   - Verify message appears on right side in blue
   - Timestamp should show correctly

2. **Search Conversations**
   - Type in search box
   - Verify list filters
   - Clear search to reset

3. **Change Conversation**
   - Click different conversations
   - Verify header updates
   - Verify messages load correctly

4. **Responsive Testing**
   - Resize browser window
   - On mobile: sidebar collapses, layout stacks
   - On tablet: sidebar reduces width
   - All elements should be clickable and readable

5. **Message Display**
   - Sent messages appear blue on right
   - Received messages appear gray on left
   - Avatars show correctly
   - Timestamps are visible

## 🐛 Troubleshooting

### Chat Page Not Loading
- Check that route `/chat` is configured in App.js
- Verify all component files are created
- Check browser console for errors

### Styles Not Applying
- Ensure CSS Modules are imported correctly
- Check file paths in import statements
- Verify className uses styles.propertyName

### Messages Not Displaying
- Check sample data is populated
- Verify activeConversation is selected
- Check browser console for errors

## 📚 Additional Resources

See [ZALO_CHAT_DOCUMENTATION.md](./ZALO_CHAT_DOCUMENTATION.md) for:
- Detailed component documentation
- API reference
- Advanced customization guide
- Performance optimization tips
- Future enhancement ideas

## 🎓 Learning Points

This implementation demonstrates:
- ✅ React functional components
- ✅ React Hooks (useState, useEffect, useRef)
- ✅ CSS Modules for component styling
- ✅ Responsive design with media queries
- ✅ Component composition and reusability
- ✅ State management and props passing
- ✅ Event handling and callbacks
- ✅ Conditional rendering

## 💡 Next Steps

1. **Integrate with Backend API** - Replace sample data with real API calls
2. **Add User Authentication** - Implement login/logout
3. **Enable WebSocket** - Real-time messaging with server
4. **Add File Upload** - Image and document sharing
5. **Implement Typing Indicators** - Show when user is typing
6. **Add Emoji Support** - Emoji picker component
7. **Dark Mode** - Theme switching

## 📞 Support

For issues or questions:
1. Check the component documentation
2. Review sample code in components
3. Check browser console for error messages
4. Verify all files are in correct directories

---

**Happy Coding! 🎉**

*Last Updated: January 2026*
