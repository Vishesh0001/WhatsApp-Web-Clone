'use client';
import { EllipsisVertical, MessageSquarePlus, Search } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import secureFetch from '@/utils/securefetch';
import { Snackbar, Alert } from '@mui/material';
import ChatInputBar from './ChatInputBar';

export default function Chats() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const userWaId = Cookies.get('wa_id') || '929967673820';

  useEffect(() => {
    const token = Cookies.get('token_test');
    if (!token) {
      console.error('No token found in cookies');
      setError('Please log in to view conversations.');
      setLoadingConvos(false);
      return;
    }

    socketRef.current = io(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:1000', {
      transports: ['websocket'],
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socketRef.current.emit('join', userWaId);
    });

    socketRef.current.on('initial_conversations', (convs) => {
      console.log('Received initial conversations:', convs);
      setConversations(convs);
      setLoadingConvos(false);
    });

    socketRef.current.on('new_message', ({ conversationId, message }) => {
      console.log('New message received:', { conversationId, message });
      if (selectedConversation && selectedConversation.conversationId === conversationId) {
        setMessages((prev) => [
          ...prev,
          {
            _id: message.metaData.entry[0].changes[0].value.messages[0].id,
            data: message,
            status: 'sent',
          },
        ]);
      }
      setConversations((prev) =>
        prev.map((conv) =>
          conv.conversationId === conversationId
            ? { ...conv, lastMessage: { data: message } }
            : conv
        )
      );
    });

    socketRef.current.on('update_status', ({ conversationId, status }) => {
      console.log(`Status updated for ${conversationId}:`, status);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.data.metaData.entry[0].changes[0].value.messages[0].id === status.meta_msg_id
            ? { ...msg, status: status.status }
            : msg
        )
      );
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket.IO error:', error);
      setError('Socket.IO error: ' + error);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    getConversations();
  }, []);

  const getConversations = async () => {
    try {
      setLoadingConvos(true);
      setError(null);
      console.log('Fetching conversations from /v1/conversations...');
      const res = await secureFetch('/conversations', {}, 'GET');
      console.log('Conversations response:', res);
      if (res.code === 1) {
        if (res.data.length === 0) {
          setError('No conversations found for this user.');
        }
        setConversations(res.data || []);
      } else {
        console.error('Failed to fetch conversations:', res.message);
        setError(res.message.keyword || 'Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Error fetching conversations: ' + error.message);
    } finally {
      setLoadingConvos(false);
    }
  };

  const getMessages = async (conversationId) => {
    try {
      setLoadingMessages(true);
      setError(null);
      console.log(`Fetching messages for conversation ${conversationId}...`);
      const res = await secureFetch(`/conversations/${conversationId}/messages`, {}, 'GET');
      console.log('Messages response:', res);
      if (res.code === 1) {
        if (res.data.length === 0) {
          setError('No messages found for this conversation.');
        }
        setMessages(res.data || []);
      } else {
        console.error('Failed to fetch messages:', res.message);
        setError(res.message.keyword || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Error fetching messages: ' + error.message);
    } finally {
      setLoadingMessages(false);
    }
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    getMessages(conversation.conversationId);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-[462px] flex flex-col bg-black">
        <nav className="fixed top-0 bg-[#161717] h-[140px] w-[462px] z-10">
          <div className="flex justify-between items-center px-5 py-4">
            <div className="font-semibold text-[20px] text-white font-sans">WhatsApp</div>
            <div className="flex space-x-3 mr-[30px]">
              <MessageSquarePlus className="text-white cursor-pointer" />
              <EllipsisVertical className="text-white cursor-pointer" />
            </div>
          </div>
          <div className="w-full bg-[#161717] px-4 py-2">
            <div className="flex items-center bg-[#2E2F2F] rounded-full px-3 py-2">
              <Search className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Search or start new chat"
                className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
              />
            </div>
          </div>
        </nav>

        <div className="mt-[140px] max-h-[calc(100vh-140px)] overflow-y-auto border-t border-gray-900">
          {loadingConvos ? (
            <div className="p-4 text-white text-center">Loading conversations...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-white text-center">No conversations found.</div>
          ) : (
            conversations.map((conv) => {
              // Select the other participant (not the logged-in user)
              const participant = conv.participants.find((p) => p.wa_id !== userWaId) || conv.participants[0];
              const lastMessage = conv.lastMessage?.data?.metaData?.entry[0]?.changes[0]?.value?.messages[0]?.text?.body || '...No messages yet';
              return (
                <div
                  key={conv.conversationId}
                  className={`flex items-center p-4 border-b border-gray-800 cursor-pointer hover:bg-[#2a3942] transition-colors ${
                    selectedConversation?.conversationId === conv.conversationId ? 'bg-[#2a3942]' : ''
                  }`}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                    <img
                      src={participant.profilePic || 'https://placehold.co/600x400?text=User'}
                      alt={participant.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-white font-semibold truncate">{participant.name || 'User'}</h3>
                      <span className="text-gray-400 text-sm">
                        {conv.lastMessage?.data?.metaData?.entry[0]?.changes[0]?.value?.messages[0]?.timestamp
                          ? formatTime(conv.lastMessage.data.metaData.entry[0].changes[0].value.messages[0].timestamp)
                          : ''}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm truncate pr-2">{lastMessage}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedConversation && (
        <div className="flex-1 flex flex-col bg-gray-900">
          <div className="p-4 border-b border-gray-800 text-white font-semibold text-xl">
            {selectedConversation.participants.find((p) => p.wa_id !== userWaId)?.name || 'User'}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingMessages ? (
              <div className="text-white text-center">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-white text-center">No messages yet.</div>
            ) : (
              messages.map((msg) => {
                const messageData = msg.data.metaData.entry[0].changes[0].value;
                const isOutgoing = messageData.messages[0].from === userWaId;
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        isOutgoing ? 'bg-green-500 text-white' : 'bg-gray-700 text-white'
                      }`}
                    >
                      <p>{messageData.messages[0].text.body}</p>
                      <div className="text-xs opacity-70 mt-1 text-right flex items-center justify-end">
                        {formatTime(messageData.messages[0].timestamp)}
                        {msg.status && (
                          <span className="ml-2">
                            {msg.status === 'sent' ? '✓' : msg.status === 'delivered' ? '✓✓' : '✓✓✔'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <ChatInputBar
            conversationId={selectedConversation.conversationId}
            socket={socketRef.current}
            userWaId={userWaId}
            participants={selectedConversation.participants}
            onMessageSent={(newMsg) => setMessages((prev) => [...prev, newMsg])}
          />
        </div>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}