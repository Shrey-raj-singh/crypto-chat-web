"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/home";
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return; // wait for session to load
    if (session) router.push(callbackUrl); // redirect if already signed in
  }, [session, status, router, callbackUrl]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signin failed");

      localStorage.setItem("access_token", data.token);
      router.push(callbackUrl);
    } catch (err: any) {
      setError(err.message || "Signin failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="p-8 rounded-2xl bg-gray-800 shadow-lg w-full max-w-sm text-center space-y-6">
        <h1 className="text-2xl font-bold">Sign in to NovaNet</h1>

        {/* OAuth Login */}
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

        <hr className="my-4 border-gray-600" />

        {/* Email/Password Login */}
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 py-2 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
