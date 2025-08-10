import { useState } from "react";
import secureFetch from "@/utils/securefetch";

export default function ChatInputBar({ conversationId, onMessageSent }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return; // Don't send empty messages

    setSending(true);
    try {
      const res = await secureFetch(
        '/messages/send',
        {
          conversationId,
          content: message.trim(),
        },
        'POST'
      );

      if (res && res.code === 1) {
        onMessageSent(res.data); // Notify parent component to update message list
        setMessage(""); // Clear input on success
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Send message error:", error);
      alert("Error sending message");
    } finally {
      setSending(false);
    }
  };

  // Send on Enter key press
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 border-t border-gray-800 bg-[#121212] flex items-center gap-3">
      <textarea
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type a message"
        className="flex-grow resize-none rounded-md bg-gray-900 text-white placeholder-gray-500 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
        disabled={sending}
      />
      <button
        onClick={handleSendMessage}
        disabled={sending || !message.trim()}
        className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Send
      </button>
    </div>
  );
}
