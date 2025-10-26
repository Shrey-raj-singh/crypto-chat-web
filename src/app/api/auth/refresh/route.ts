import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken)
      return NextResponse.json({ error: "Missing refresh token" }, { status: 400 });

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: string; email: string };

    const newAccessToken = jwt.sign({ id: decoded.id, email: decoded.email }, JWT_SECRET, { expiresIn: "15m" });
    const newRefreshToken = jwt.sign({ id: decoded.id, email: decoded.email }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
  }
}
