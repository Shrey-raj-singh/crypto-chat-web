import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!sender)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { receiverId } = await req.json();

    // ✅ Step 1: Find all chatIds linked to sender
    const senderChats = await prisma.userChat.findMany({
      where: { userId: sender.id },
      select: { chatId: true },
    });

    const senderChatIds = senderChats.map((uc: { chatId: any; }) => uc.chatId);

    // ✅ Step 2: Check if receiver has any of these chats
    const existingCommonChat = await prisma.userChat.findFirst({
      where: {
        userId: receiverId,
        chatId: { in: senderChatIds },
      },
      select: { chatId: true },
    });

    if (existingCommonChat) {
      // ✅ A chat already exists between both users
      return NextResponse.json({ chatId: existingCommonChat.chatId });
    }

    // ✅ Step 3: Create new chat if not found
    const newChat = await prisma.chat.create({
      data: {},
    });

    // ✅ Step 4: Link both users to chat
    await prisma.userChat.createMany({
      data: [
        { userId: sender.id, chatId: newChat.id },
        { userId: receiverId, chatId: newChat.id },
      ],
    });

    return NextResponse.json({ chatId: newChat.id });
  } catch (error) {
    console.error("Error creating/opening chat:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
