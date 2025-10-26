import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

// POST /api/auth/refresh
export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Missing refresh token" },
        { status: 400 }
      );
    }

    // Verify refresh token validity
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      id: string;
      email: string;
    };

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Optionally, generate a new refresh token
    const newRefreshToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Refresh token expired" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }
}
