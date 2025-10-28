// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import prisma  from "@/lib/prisma";

// const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// export async function POST(req: NextRequest) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password)
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user)
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

//     const valid = await bcrypt.compare(password, user.password!);
//     if (!valid)
//       return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     const response = NextResponse.json({ token });
//     response.cookies.set("access_token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 24, 
//     });

//     return response;
//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }
