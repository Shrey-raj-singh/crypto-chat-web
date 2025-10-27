// src/app/login/page.tsx
import { Suspense } from "react";
import SignInForm from "./SignInForm";

// A simple loading component as a fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900" />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SignInForm />
    </Suspense>
  );
}