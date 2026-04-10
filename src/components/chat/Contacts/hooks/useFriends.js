import { useState, useCallback } from 'react';
import api from '../../../../services/api';

export const useFriends = (currentUser) => {
  const [friends, setFriends] = useState([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendRequests, setFriendRequests] = useState({ received: [], sent: [] });
  const [requestsLoading, setRequestsLoading] = useState(false);

  const fetchFriends = useCallback(async () => {
    setFriendsLoading(true);
    try {
      const res = await api.get('/friends');
      // api.js unwrap 1 lần → res = { success, data: [...] }
      // service trả mảng user trực tiếp → successResponse wrap thành { success, data: [...] }
      const data = res?.data ?? (Array.isArray(res) ? res : []);
      setFriends(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchFriends error:', err?.response?.data || err.message);
      setFriends([]);
    } finally {
      setFriendsLoading(false);
    }
  }, []);

  const fetchFriendRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      // Gọi song song 2 endpoint riêng biệt
      const [receivedRes, sentRes] = await Promise.allSettled([
        api.get('/friends/requests'),       // GET incoming
        api.get('/friends/requests/sent'),  // GET outgoing
      ]);

      // Parse received — service trả mảng user, successResponse wrap thành { success, data: [...] }
      let received = [];
      if (receivedRes.status === 'fulfilled') {
        const d = receivedRes.value;
        received = Array.isArray(d?.data) ? d.data
                 : Array.isArray(d) ? d
                 : [];
      }

      // Parse sent
      let sent = [];
      if (sentRes.status === 'fulfilled') {
        const d = sentRes.value;
        sent = Array.isArray(d?.data) ? d.data
             : Array.isArray(d) ? d
             : [];
      }

      setFriendRequests({ received, sent });
    } catch (err) {
      console.error('fetchFriendRequests error:', err?.response?.data || err.message);
      setFriendRequests({ received: [], sent: [] });
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  // POST /friends/request { toUserId }
  const sendFriendRequest = useCallback(async (toUserId) => {
    try {
      await api.post('/friends/request', { toUserId });
      await fetchFriendRequests();
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      return { success: false, message: msg };
    }
  }, [fetchFriendRequests]);

  // Không có /friends/cancel → chỉ refresh UI, không gọi API
  const cancelFriendRequest = useCallback(async (toUserId) => {
    await fetchFriendRequests();
    return { success: true };
  }, [fetchFriendRequests]);

  // POST /friends/accept { requesterId }
  // Backend tự tạo conversation khi accept → trả { friendship, conversation: { id, type } }
  const acceptFriendRequest = useCallback(async (requesterId) => {
    try {
      const res = await api.post('/friends/accept', { requesterId });
      await fetchFriendRequests();
      await fetchFriends();
      // api.js unwrap 1 lần → res = { success, data: { friendship, conversation } }
      const data = res?.data ?? res;
      return { success: true, conversationId: data?.conversation?.id };
    } catch (err) {
      console.error('acceptFriendRequest error:', err?.response?.data || err.message);
      return { success: false };
    }
  }, [fetchFriendRequests, fetchFriends]);

  // POST /friends/reject { requesterId }
  const rejectFriendRequest = useCallback(async (requesterId) => {
    try {
      await api.post('/friends/reject', { requesterId });
      await fetchFriendRequests();
      return { success: true };
    } catch (err) {
      console.error('rejectFriendRequest error:', err?.response?.data || err.message);
      return { success: false };
    }
  }, [fetchFriendRequests]);

  // Helper: trạng thái quan hệ với 1 user
  const getRelationStatus = useCallback((userId) => {
    if (!userId) return 'NONE';
    const uid = String(userId);
    if (friends.some(f => String(f.id) === uid)) return 'FRIEND';
    if (friendRequests.sent.some(r => String(r.id) === uid)) return 'SENT';
    if (friendRequests.received.some(r => String(r.id) === uid)) return 'RECEIVED';
    return 'NONE';
  }, [friends, friendRequests]);

  return {
    friends,
    friendsLoading,
    friendRequests,
    requestsLoading,
    fetchFriends,
    fetchFriendRequests,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getRelationStatus,
  };
};