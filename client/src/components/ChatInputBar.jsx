'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInputBar({ conversationId, socket, userWaId, participants, onMessageSent }) {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (!message.trim() || !conversationId) return;

    const receiverWaId = participants.find(p => p.wa_id !== userWaId)?.wa_id || '918329446654';

    const messageDoc = {
      payload_type: 'whatsapp_webhook',
      metaData: {
        entry: [
          {
            changes: [
              {
                field: 'messages',
                value: {
                  contacts: [{ profile: { name: 'User' }, wa_id: userWaId }],
                  messages: [
                    {
                      from: userWaId,
                      id: `wamid.${Date.now()}`,
                      timestamp: Math.floor(Date.now() / 1000),
                      text: { body: message },
                      type: 'text',
                    },
                  ],
                  messaging_product: 'whatsapp',
                  metadata: { display_phone_number: receiverWaId, phone_number_id: '629305560276479' },
                },
              },
            ],
            id: '30164062719905277',
          },
        ],
        gs_app_id: `${conversationId}-app`,
        object: 'whatsapp_business_account',
      },
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      executed: true,
    };

    const statusDoc = {
      meta_data: {
        entry: [
          {
            changes: [
              {
                field: 'messages',
                value: {
                  messaging_product: 'whatsapp',
                  metadata: { display_phone_number: receiverWaId, phone_number_id: '629305560276479' },
                  statuses: [
                    {
                      conversation: { id: `${conversationId}-convo-id`, origin: { type: 'user_initiated' } },
                      gs_id: `${conversationId}-msg${Date.now()}-gs-id`,
                      id: messageDoc.metaData.entry[0].changes[0].value.messages[0].id,
                      meta_msg_id: messageDoc.metaData.entry[0].changes[0].value.messages[0].id,
                      pricing: { billable: true, category: 'utility', pricing_model: 'PMP', type: 'regular' },
                      recipient_id: receiverWaId,
                      status: 'sent',
                      timestamp: Math.floor(Date.now() / 1000),
                    },
                  ],
                },
              },
            ],
          },
        ],
        id: '30164062719905277',
        gs_app_id: `${conversationId}-app`,
        object: 'whatsapp_business_account',
      },
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      executed: true,
    };

    socket.emit('new_message', {
      sender_wa_id: userWaId,
      receiver_wa_id: receiverWaId,
      messageDoc,
      statusDoc,
    });

    onMessageSent({
      _id: messageDoc.metaData.entry[0].changes[0].value.messages[0].id,
      data: messageDoc,
      status: 'sent',
    });

    setMessage('');
  };

  return (
    <div className="p-4 border-t border-gray-800 bg-gray-900 flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 outline-none"
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="ml-2 p-2 bg-green-500 rounded-full text-white hover:bg-green-600"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}