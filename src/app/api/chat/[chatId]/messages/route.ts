// src/app/api/chats/[chatId]/messages/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET(req: Request, { params }: { params: { chatId: string } }) {
  const messages = await prisma.message.findMany({
    where: { chatId: params.chatId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ messages });
}

export async function POST(req: Request, { params }: { params: { chatId: string } }) {
  const body = await req.json();
  const message = await prisma.message.create({
    data: {
      chatId: params.chatId,
      senderId: body.senderId,
      text: body.text,
    },
  });
  return NextResponse.json(message);
}
