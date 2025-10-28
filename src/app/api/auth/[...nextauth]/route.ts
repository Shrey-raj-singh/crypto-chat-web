import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        image: { label: "Profile Image URL", type: "url" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing fields");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) throw new Error("Invalid credentials");
        if (!user.emailVerified) throw new Error("Email not verified");

        const valid = await bcrypt.compare(credentials.password, user.password!);
        if (!valid) throw new Error("Invalid credentials");

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    
    async session({ session, token }) {
      if (session.user) session.user.id = token.sub!;
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        // If email exists but Google not linked yet, link it
        if (existingUser && existingUser.id !== user.id) {
          const linkedAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: "google",
            },
          });

          if (!linkedAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                provider: "google",
                providerAccountId: account.providerAccountId,
                type: account.type,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
              },
            });
          }
          return true;
        }
      }
      return true;
    },
    
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
  },
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
