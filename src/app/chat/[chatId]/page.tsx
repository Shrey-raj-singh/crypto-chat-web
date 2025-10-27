"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Pusher from "pusher-js";
import { useSession, signOut } from "next-auth/react";

interface User {
  id: string;
  name?: string | null;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  sender?: User;
}

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId;
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${chatId}/messages`);
      if (res.status===200) {
        setAuthorized(true);
      }
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };


  useEffect(() => {
  fetchMessages(); // fetch initial messages once

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  });

  const channel = pusher.subscribe(`chat-${chatId}`);
  channel.bind("new-message", (newMessage: Message) => {
    setMessages((prev) => {
      if (prev.find((msg) => msg.id === newMessage.id)) return prev; // prevent duplicates
      return [...prev, newMessage];
    });
  });

  return () => {
    channel.unbind_all();
    channel.unsubscribe();
  };
}, [chatId]); 


  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const textToSend = input;
    setInput("");

    try {
      await fetch(`/api/chat/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend }),
      });
      // No need to update messages manually; Pusher will handle it
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto border rounded-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {authorized?messages.map((msg) => {
          const isMe = msg.senderId === session?.user.id; // check if sender is current user
          return (
            <div
              key={msg.id}
              className={`p-2 my-1 rounded max-w-[70%] ${
                isMe ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 mr-auto text-black"
              }`}
            >
              <div className="font-semibold text-sm">
                {msg.sender?.name || (isMe ? "You" : "Unknown")}
              </div>
              <div>{msg.text}</div>
              <div className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          );
        }):"You are not authorized to view messages."}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex p-2 border-t">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
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
