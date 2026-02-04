# Zalo Chat Interface - React Component Documentation

## 📋 Overview

This project has been refactored with a new Zalo-like messaging interface built with React. The new chat interface provides a modern, responsive messaging experience similar to the popular Vietnamese messaging app Zalo.

## 🎨 Design Features

- **Primary Color**: #0068ff (Zalo Blue)
- **Secondary Colors**: White (#ffffff), Light Gray (#f0f0f0)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, minimal design with smooth animations
- **Real-time Messaging**: Message bubbles with timestamps

## 📁 Project Structure

```
src/
├── components/
│   └── chat/
│       ├── Sidebar/
│       │   ├── Sidebar.jsx
│       │   └── Sidebar.module.css
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
│   ├── Chat.jsx
│   └── Chat.module.css
├── styles/
│   └── global.css
├── App.js
└── index.js
```

## 🔧 Components

### 1. **Sidebar Component** (`Sidebar.jsx`)
Displays the list of conversations with:
- User avatar and online status indicator
- Conversation name and last message preview
- Timestamp of the last message
- Unread message count badge
- Real-time search functionality

**Props:**
```javascript
{
  conversations: Array,        // List of conversation objects
  activeConversation: Object,  // Currently selected conversation
  onSelectConversation: Function // Callback when conversation is selected
}
```

**Conversation Object:**
```javascript
{
  id: number,
  name: string,
  avatar: string (URL),
  isOnline: boolean,
  lastMessage: string,
  timestamp: string,
  unreadCount: number
}
```

### 2. **ChatWindow Component** (`ChatWindow.jsx`)
Main chat display area with:
- Header showing contact info and action buttons (call, video, info)
- Scrollable message container
- Integration with MessageBubble and InputBox components
- Auto-scroll to latest message

**Props:**
```javascript
{
  conversation: Object,    // Current conversation details
  messages: Array,         // List of messages
  onSendMessage: Function  // Callback when message is sent
}
```

**Message Object:**
```javascript
{
  id: number,
  text: string,
  timestamp: Date,
  isOwn: boolean,          // true for sent messages, false for received
  avatar: string (URL),
  image?: string (URL)     // Optional image message
}
```

### 3. **MessageBubble Component** (`MessageBubble.jsx`)
Individual message display with:
- Differentiated styling for sent (blue) vs received (gray) messages
- Message timestamp
- Optional image support
- Smooth animation on appearance

**Props:**
```javascript
{
  message: Object,  // Message details
  isOwn: boolean    // Whether message was sent by user
}
```

### 4. **InputBox Component** (`InputBox.jsx`)
Message input area with:
- Multi-line textarea with auto-expansion
- Action buttons (attach file, emoji)
- Send button with keyboard shortcut (Enter)
- Smart send button enable/disable based on input

**Props:**
```javascript
{
  onSendMessage: Function  // Callback to send message
}
```

## 🎯 Main Page Component

### Chat Page (`Chat.jsx`)
Orchestrates all components and manages:
- Conversation state management
- Message history
- Message sending logic
- Auto-selection of first conversation on load

## 🚀 How to Use

### Access the Chat Interface
Navigate to `/chat` route in your application:
```javascript
http://localhost:3000/chat
```

### Initialize with Sample Data
The Chat component includes sample conversations and messages for demonstration:
```javascript
const SAMPLE_CONVERSATIONS = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isOnline: true,
    // ... more properties
  },
  // ... more conversations
];
```

### Integrate with Backend API
To connect with a real backend:

1. **Replace sample data with API calls:**
```javascript
useEffect(() => {
  // Fetch conversations from API
  fetchConversations().then(data => setConversations(data));
}, []);
```

2. **Send messages to server:**
```javascript
const handleSendMessage = async (newMessage) => {
  try {
    const response = await api.post('/messages', {
      conversationId: activeConversation.id,
      text: newMessage.text,
    });
    // Update local state with server response
    setMessages([...messages, response.data]);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};
```

## 🎨 CSS Module Architecture

Each component uses CSS Modules for:
- **Scoped styling**: No global namespace pollution
- **Component isolation**: Styles apply only to intended component
- **Maintainability**: Easy to locate and modify styles
- **Performance**: Optimized CSS bundling

### CSS Features Used
- Flexbox for layout
- CSS Grid for structured layouts
- CSS animations for smooth transitions
- Media queries for responsiveness
- CSS custom properties (variables) for theming

## 📱 Responsive Breakpoints

```css
Desktop (1200px+)    - Full sidebar width (360px)
Tablet (768-1024px)  - Reduced sidebar width (320px)
Mobile (< 768px)     - Horizontal layout transformation
Small Mobile (<480px) - Further optimizations
```

## 🎯 Key Features

1. **Real-time Messaging**: Instant message display with animations
2. **Online Status**: Visual indicator of user online/offline status
3. **Unread Badges**: Quick view of conversations with new messages
4. **Search Functionality**: Filter conversations by name or content
5. **Responsive Design**: Seamless experience across all devices
6. **Keyboard Shortcuts**: 
   - `Enter` to send message
   - `Shift+Enter` for new line in message
7. **Auto-scroll**: Messages scroll into view automatically
8. **Smooth Animations**: All transitions are smooth and polished

## 🔐 Accessibility Features

- Semantic HTML elements
- Proper ARIA labels on buttons
- Keyboard navigation support
- High contrast colors for readability
- Focus indicators on interactive elements

## 🎨 Customization Guide

### Change Primary Color
Edit `src/styles/global.css`:
```css
:root {
  --primary-color: #your-color;
  --primary-hover: #your-hover-color;
  --primary-light: #your-light-color;
}
```

### Modify Component Styling
Each component has its own CSS Module. For example, to customize the Sidebar:
```css
/* src/components/chat/Sidebar/Sidebar.module.css */
.sidebar {
  /* Your custom styles */
}
```

### Change Layout Proportions
In `src/pages/Chat.module.css`:
```css
.sidebar {
  width: 400px; /* Adjust sidebar width */
}
```

## 🐛 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📦 Dependencies

- React 18.2.0
- React Router DOM 7.5.2
- React Icons 5.5.0
- CSS Modules (built-in with Create React App)

## 🚀 Performance Optimizations

1. **Component Memoization**: Prevents unnecessary re-renders
2. **CSS Modules**: Optimal stylesheet loading
3. **Lazy Loading**: Can be extended with React.lazy()
4. **Virtual Scrolling**: Can be implemented for large message lists
5. **Message Batching**: Smart update batching for multiple messages

## 🎓 Learning Resources

### Component Patterns Used
- **Controlled Components**: Input state management
- **Composition**: Reusable component structure
- **Props Drilling**: Data flow through components
- **Hooks**: useState, useEffect, useRef for state management

### CSS Patterns Used
- **CSS Modules**: Scoped styling
- **Flexbox Layout**: Responsive flex containers
- **Media Queries**: Responsive design
- **CSS Animations**: Smooth transitions

## 📝 Example Integration

### Using the Chat Component in Your App
```javascript
// In your App.js or routing file
import Chat from './pages/Chat';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}
```

### Creating a Custom Theme
```javascript
// Create a theme configuration
const chatTheme = {
  colors: {
    primary: '#0068ff',
    secondary: '#e5e5e5',
    text: '#000000',
    bg: '#ffffff'
  }
};

// Pass through context or props to components
<Chat theme={chatTheme} />
```

## 🔮 Future Enhancements

1. **WebSocket Integration**: Real-time messaging with server
2. **File Upload**: Send images and documents
3. **Emoji Support**: Emoji picker component
4. **Message Reactions**: React to messages with emojis
5. **Typing Indicators**: Show when someone is typing
6. **Voice Messages**: Audio message support
7. **Message Search**: Search within conversations
8. **Dark Mode**: Theme switching support
9. **Message Persistence**: Local storage for offline messages
10. **User Profiles**: Click to view user details

## 📄 License

This component is part of the fe-zalo project.

## 🤝 Support

For issues, questions, or suggestions, please refer to the project documentation or create an issue in the repository.

---

**Last Updated**: January 2026
**Version**: 1.0.0
**Status**: Production Ready
