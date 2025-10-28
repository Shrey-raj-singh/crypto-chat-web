"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  // Step 1: Send OTP
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      setMessage("OTP sent to your email. Enter the code below to verify.");
      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, otp, image }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "OTP verification failed");

      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <div className="w-full max-w-md rounded-2xl bg-[#1e293b]/70 p-8 shadow-2xl backdrop-blur">
        <h1 className="mb-6 text-center text-3xl font-bold tracking-wide text-cyan-400">
          Create Account
        </h1>

        {step === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg bg-[#0f172a] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            />
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

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg bg-[#0f172a] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
            <input
              type="text"
              placeholder="Profile Image URL (optional)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-lg bg-[#0f172a] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
            />

            {error && <p className="text-center text-red-400 text-sm">{error}</p>}
            {message && <p className="text-center text-green-400 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-500 py-2 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-center text-gray-400">Enter the OTP sent to {email}</p>

            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg bg-[#0f172a] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />

            {error && <p className="text-center text-red-400 text-sm">{error}</p>}
            {message && <p className="text-center text-green-400 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-cyan-500 py-2 font-semibold text-black transition hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}


// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SignupPage() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [image, setImage] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState<"signup" | "verify">("signup");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   async function handleSignup(e: React.FormEvent) {
//     e.preventDefault();
//     setError("");
//     setMessage("");
//     if (password !== confirm) {
//       setError("Passwords do not match");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password, image }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Signup failed");

//       setMessage(data.message);
//       setStep("verify");
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleVerify(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch("/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Verification failed");

//       setMessage(data.message);
//       router.push("/login");
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[#020617] text-white">
//       <div className="w-full max-w-md rounded-2xl bg-[#0f172a] p-8 shadow-lg">
//         <h1 className="mb-6 text-center text-2xl font-bold">
//           {step === "signup" ? "Create Account" : "Verify OTP"}
//         </h1>

//         {step === "signup" ? (
//           <form onSubmit={handleSignup} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full rounded-lg bg-[#1e293b] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full rounded-lg bg-[#1e293b] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full rounded-lg bg-[#1e293b] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               value={confirm}
//               onChange={(e) => setConfirm(e.target.value)}
//               className="w-full rounded-lg bg-[#1e293b] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
//               required
//             />
//             <input
//               type="text"
//               placeholder="Profile Image URL (optional)"
//               value={image}
//               onChange={(e) => setImage(e.target.value)}
//               className="w-full rounded-lg bg-[#1e293b] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
//             />
//             {error && <p className="text-red-400 text-sm">{error}</p>}
//             {message && <p className="text-green-400 text-sm">{message}</p>}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-lg bg-cyan-500 py-2 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50"
//             >
//               {loading ? "Sending OTP..." : "Sign Up"}
//             </button>
//           </form>
//         ) : (
//           <form onSubmit={handleVerify} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full rounded-lg bg-[#1e293b] px-4 py-2 text-white outline-none focus:ring-2 focus:ring-cyan-400"
//               required
//             />
//             {error && <p className="text-red-400 text-sm">{error}</p>}
//             {message && <p className="text-green-400 text-sm">{message}</p>}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-lg bg-cyan-500 py-2 font-semibold text-black hover:bg-cyan-400 disabled:opacity-50"
//             >
//               {loading ? "Verifying..." : "Verify OTP"}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }
