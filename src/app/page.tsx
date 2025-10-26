"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) router.push("/home");
    else router.push("/login");
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-wide">
          Secure Social Chat
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Redirecting to authentication...
        </p>
      </div>
    </main>
  );
}
