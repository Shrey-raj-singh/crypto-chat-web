// example route: /api/link/google
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  // Example: trigger OAuth link flow
  return Response.redirect(`/api/auth/signin/google?callbackUrl=/api/link/callback`);
}

// callback example after OAuth success
// In /api/link/callback, link the provider to logged-in user manually
