import React, { useState, useEffect } from 'react';
import styles from './Chat.module.css';
import Sidebar from '../components/chat/Sidebar/Sidebar';
import ChatWindow from '../components/chat/ChatWindow/ChatWindow';

// Sample data
const SAMPLE_CONVERSATIONS = [
  {
    id: 1,
    name: 'Nguyễn Văn A',
    avatar: 'https://i.pravatar.cc/150?img=1',
    isOnline: true,
    lastMessage: 'Chào bạn! Bạn khỏe không?',
    timestamp: '10:30',
    unreadCount: 2,
  },
  {
    id: 2,
    name: 'Trần Thị B',
    avatar: 'https://i.pravatar.cc/150?img=2',
    isOnline: true,
    lastMessage: 'Ok, tôi sẽ đến lúc 2 giờ',
    timestamp: '9:15',
    unreadCount: 0,
  },
  {
    id: 3,
    name: 'Tech Team',
    avatar: 'https://i.pravatar.cc/150?img=3',
    isOnline: false,
    lastMessage: 'Bạn: Project deadline là ngày mai',
    timestamp: 'Hôm qua',
    unreadCount: 1,
  },
  {
    id: 4,
    name: 'Lê Hoàng C',
    avatar: 'https://i.pravatar.cc/150?img=4',
    isOnline: true,
    lastMessage: 'Cảm ơn bạn rất nhiều!',
    timestamp: '8:00',
    unreadCount: 0,
  },
  {
    id: 5,
    name: 'Project Group',
    avatar: 'https://i.pravatar.cc/150?img=5',
    isOnline: true,
    lastMessage: 'Bạn: Đã upload file lên drive',
    timestamp: '7:45',
    unreadCount: 3,
  },
  {
    id: 6,
    name: 'Phạm Minh D',
    avatar: 'https://i.pravatar.cc/150?img=6',
    isOnline: false,
    lastMessage: 'Bạn sẽ đến không?',
    timestamp: '2 ngày trước',
    unreadCount: 0,
  },
];

const SAMPLE_MESSAGES = {
  1: [
    {
      id: 1,
      text: 'Chào bạn!',
      timestamp: new Date(Date.now() - 3600000),
      isOwn: false,
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      text: 'Bạn khỏe không?',
      timestamp: new Date(Date.now() - 3500000),
      isOwn: false,
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 3,
      text: 'Tôi khỏe, cảm ơn',
      timestamp: new Date(Date.now() - 3400000),
      isOwn: true,
      avatar: 'https://i.pravatar.cc/150?img=0',
    },
    {
      id: 4,
      text: 'Bạn có free không? Chúng ta gặp mặt được không?',
      timestamp: new Date(Date.now() - 3300000),
      isOwn: false,
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 5,
      text: 'Được, mình free từ 2 giờ chiều',
      timestamp: new Date(Date.now() - 3200000),
      isOwn: true,
      avatar: 'https://i.pravatar.cc/150?img=0',
    },
  ],
  2: [
    {
      id: 1,
      text: 'Bạn có thể giúp mình không?',
      timestamp: new Date(Date.now() - 7200000),
      isOwn: false,
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 2,
      text: 'Được chứ, có chuyện gì?',
      timestamp: new Date(Date.now() - 7100000),
      isOwn: true,
      avatar: 'https://i.pravatar.cc/150?img=0',
    },
    {
      id: 3,
      text: 'Mình cần bạn kiểm tra file này',
      timestamp: new Date(Date.now() - 7000000),
      isOwn: false,
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 4,
      text: 'Ok, mình sẽ đến lúc 2 giờ',
      timestamp: new Date(Date.now() - 6900000),
      isOwn: true,
      avatar: 'https://i.pravatar.cc/150?img=0',
    },
  ],
  3: [
    {
      id: 1,
      text: 'Deadline project',
      timestamp: new Date(Date.now() - 86400000),
      isOwn: false,
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: 2,
      text: 'Project deadline là ngày mai',
      timestamp: new Date(Date.now() - 86300000),
      isOwn: true,
      avatar: 'https://i.pravatar.cc/150?img=0',
    },
  ],
  4: [
    {
      id: 1,
      text: 'Cảm ơn bạn rất nhiều!',
      timestamp: new Date(Date.now() - 28800000),
      isOwn: false,
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    {
      id: 2,
      text: 'Không có gì đâu, vui lòng giúp bạn 😊',
      timestamp: new Date(Date.now() - 28700000),
      isOwn: true,
      avatar: 'https://i.pravatar.cc/150?img=0',
    },
  ],
  5: [
    {
      id: 1,
      text: 'Tất cả có file chưa?',
      timestamp: new Date(Date.now() - 27900000),
      isOwn: false,
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 2,
      text: 'Đã upload file lên drive',
      timestamp: new Date(Date.now() - 27800000),
      isOwn: true,
      avatar: 'https://i.pravatar.cc/150?img=0',
    },
  ],
  6: [],
};

const Chat = () => {
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState(SAMPLE_CONVERSATIONS[0]);
  const [messages, setMessages] = useState(SAMPLE_MESSAGES[SAMPLE_CONVERSATIONS[0].id] || []);

  // Update messages when conversation changes
  useEffect(() => {
    if (activeConversation) {
      setMessages(SAMPLE_MESSAGES[activeConversation.id] || []);
    }
  }, [activeConversation]);

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    // Mark as read
    setConversations(
      conversations.map(c =>
        c.id === conversation.id ? { ...c, unreadCount: 0 } : c
      )
    );
  };

  const handleSendMessage = (newMessage) => {
    const fullMessage = {
      ...newMessage,
      id: messages.length + 1,
      avatar: 'https://i.pravatar.cc/150?img=0',
    };

    setMessages([...messages, fullMessage]);

    // Update conversation's last message
    setConversations(
      conversations.map(c =>
        c.id === activeConversation?.id
          ? {
              ...c,
              lastMessage: newMessage.text,
              timestamp: 'Vừa xong',
            }
          : c
      )
    );
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.sidebar}>
        <Sidebar
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
        />
      </div>
      <div className={styles.chatArea}>
        <ChatWindow
          conversation={activeConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
