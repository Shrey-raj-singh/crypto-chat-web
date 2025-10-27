"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // wait for session to load
    if (session) {
      router.push(callbackUrl); // redirect if already signed in
    }
  }, [session, status, router, callbackUrl]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="p-8 rounded-2xl bg-gray-800 shadow-lg w-full max-w-sm text-center space-y-6">
        <h1 className="text-2xl font-bold">Sign in to NovaNet</h1>

        <div className="space-y-4">
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold"
          >
            Continue with Google
          </button>

          <button
            onClick={() => signIn("github", { callbackUrl })}
            className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
          >
            Continue with GitHub
          </button>
        </div>

        <p className="text-sm text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
