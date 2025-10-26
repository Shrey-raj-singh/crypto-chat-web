"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const { token } = await res.json();
      localStorage.setItem("access_token", token);
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "google" | "github") {
    window.location.href = `/api/auth/oauth?provider=${provider}`;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <div className="w-full max-w-md rounded-2xl bg-[#1e293b]/70 p-8 shadow-2xl backdrop-blur">
        <h1 className="mb-6 text-center text-3xl font-bold tracking-wide text-cyan-400">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-[#0f172a] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-[#0f172a] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            required
          />

          {error && <p className="text-center text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-cyan-500 py-2 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center space-y-3">
          <button
            onClick={() => handleOAuth("google")}
            className="w-full rounded-lg bg-white py-2 text-black font-medium hover:bg-gray-200"
          >
            Continue with Google
          </button>
          <button
            onClick={() => handleOAuth("github")}
            className="w-full rounded-lg bg-gray-800 py-2 text-white font-medium hover:bg-gray-700"
          >
            Continue with GitHub
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
