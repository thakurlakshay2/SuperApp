"use client";
import React, { useState } from "react";
import { LoginPage } from "./login/page";
import { RegisterPage } from "./register/page";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectBackURL = searchParams.get("redirectBackURL") || "/";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="mb-8 flex gap-4">
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            tab === "login"
              ? "bg-blue-600 text-white"
              : "bg-white/10 text-blue-100 hover:bg-white/20"
          }`}
          onClick={() => {
            setTab("login");
            setMessage(null);
          }}
        >
          Login
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
            tab === "register"
              ? "bg-blue-600 text-white"
              : "bg-white/10 text-blue-100 hover:bg-white/20"
          }`}
          onClick={() => {
            setTab("register");
            setMessage(null);
          }}
        >
          Register
        </button>
      </div>
      {message && (
        <div className="mb-4 text-center text-red-200 bg-red-900/40 px-4 py-2 rounded-lg">
          {message}
        </div>
      )}
      <div className="w-full max-w-md">
        {tab === "login" ? (
          <LoginPage
            onLogin={() => {
              router.replace(redirectBackURL);
            }}
            onSwitchToRegister={() => setTab("register")}
          />
        ) : (
          <RegisterPage
            onRegister={() => {
              setMessage("Registration successful! Please login.");
              setTab("login");
            }}
            onSwitchToLogin={() => setTab("login")}
          />
        )}
      </div>
    </div>
  );
}
