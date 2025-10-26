"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Pusher from "pusher-js";

// Example types for message
interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // Fetch chat messages from API
  const fetchMessages = async () => {
    const res = await fetch(`/api/chat/${chatId}/messages`);
    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    fetchMessages();

    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`chat-${chatId}`);
    channel.bind("new-message", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chatId]);

  // Send a message
  const handleSend = async () => {
    if (!input.trim()) return;

    await fetch(`/api/chat/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: input }),
    });

    setInput("");
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border rounded-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 my-1 rounded ${
              msg.senderId === "me" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"
            }`}
          >
            {msg.content}
            <div className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <div className="flex p-2 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 text-white px-4 py-1 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
