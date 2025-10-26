import { Server } from "socket.io";
import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/next"; // We'll define type for TS

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected", socket.id);

      socket.on("join_chat", (chatId: string) => {
        socket.join(chatId);
        console.log("Joined chat:", chatId);
      });

      socket.on("send_message", (data) => {
        // Broadcast message to other users in the chat
        io.to(data.chatId).emit("receive_message", data);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
      });
    });
  }
  res.end();
}
