import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, otp } = await req.json();
    if (!email || !password || !otp) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Find OTP
    const otpEntry = await prisma.oTP.findFirst({
      where: { email, code: otp },
      orderBy: { createdAt: "desc" },
    });

    if (!otpEntry || otpEntry.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        emailVerified: new Date(),
      },
    });

    // Delete OTP entry
    await prisma.oTP.deleteMany({ where: { email } });

    return NextResponse.json({ message: "User verified and created", userId: user.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
