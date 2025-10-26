import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function GET(req: Request, context: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await context.params;

  const messages = await prisma.message.findMany({
    where: { chatId },
    include: { sender: { select: { id: true, name: true, email: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}

export async function POST(req: Request, context: { params: Promise<{ chatId: string }> }) {
  try {
    const { chatId } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text } = await req.json();
    const sender = await prisma.user.findUnique({ where: { email: session.user.email } });

    if (!sender) return NextResponse.json({ error: "Sender not found" }, { status: 404 });

    // Save message (duplicates are naturally avoided by unique IDs)
    const message = await prisma.message.create({
      data: { chatId, senderId: sender.id, text },
      include: { sender: { select: { id: true, name: true, email: true, image: true } } },
    });

    // Broadcast via Pusher
    await pusher.trigger(`chat-${chatId}`, "new-message", message);

    return NextResponse.json(message);
  } catch (err) {
    console.error("Error sending message:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
