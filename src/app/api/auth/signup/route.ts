import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Missing password" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
    
    await prisma.oTP.deleteMany({ where: { email } });

    await prisma.oTP.create({
      data: { email, code: otpCode, expiresAt },
    });

    // Send email via nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"NovaNet" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your verification code is: ${otpCode}`,
    });

    return NextResponse.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import bcrypt from "bcryptjs";

// export async function POST(req: NextRequest) {
//   const { email, password, name, image } = await req.json();
//   if (!email || !password || !name)
//     return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//   const existing = await prisma.user.findUnique({ where: { email } });
//   if (existing)
//     return NextResponse.json({ error: "User already exists" }, { status: 409 });

//   // Generate OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();
//   const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

//   // Store OTP
//   await prisma.oTP.create({ data: { email, code: otp, expiresAt } });

//   // Send OTP email here (optional)
//   console.log("OTP for", email, "=", otp);

//   return NextResponse.json({ message: "OTP sent successfully" });
// }
