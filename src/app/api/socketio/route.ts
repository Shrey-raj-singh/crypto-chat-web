import { NextRequest } from "next/server";
import { Server } from "socket.io";
import { Server as NetServer } from "http";

export const runtime = "nodejs"; // important for socket.io

export async function GET(req: NextRequest) {
  return new Response("Socket.IO endpoint");
}

// @ts-ignore
export const POST = async (req: NextRequest) => {
  // Next.js expects POST to be a function that takes (req: NextRequest)
  // But we’ll actually only initialize socket server once
  const { socket } = req as any;
  if (!socket.server.io) {
    console.log("Initializing Socket.IO server...");
    const io = new Server(socket.server as unknown as NetServer, {
      path: "/api/socketio",
    });
    socket.server.io = io;

    io.on("connection", (client) => {
      console.log("Client connected", client.id);

      client.on("send-message", (msg) => {
        // Broadcast to all in the room
        io.to(msg.chatId).emit("receive-message", msg);
      });

      client.on("join-chat", (chatId) => {
        client.join(chatId);
      });
    });
  }

  return new Response("Socket.IO server initialized");
};
