import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// POST /api/messages/send
export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const user = requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { receiverId, content } = await req.json();
    if (!receiverId || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Save message to database
    const message = await prisma.message.create({
      data: {
        senderId: user.id,
        receiverId,
        content,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    console.error("Send message error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
