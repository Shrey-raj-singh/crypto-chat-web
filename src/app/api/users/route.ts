import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    // Use NextRequest for App Router
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      where: { NOT: { email: session.user.email } },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ users });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
