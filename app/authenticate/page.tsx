"use client";
import React, { useState } from "react";

import { LoginPage } from "./login/page";
import { RegisterPage } from "./register/page";
import { Dashboard } from "./dashboard/page";
import { User } from "../payUrFren/types";
import { register } from "module";

// Main App Component (App Router Layout)
export default function Page() {
  const [currentView, setCurrentView] = useState<
    "login" | "register" | "dashboard"
  >("login");

  const [loginResponse, setLoginResponse] = useState<LoginResponse | null>(
    null
  );
  const handleLogin = (loginRequest: LoginRequest) => {
    setCurrentView("dashboard");
    authAPI
      .login(loginRequest)
      .then(() => {
        setLoginResponse(loginResponse);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  const handleRegister = (registerRequest: RegisterRequest) => {
    setCurrentView("dashboard");
    authAPI
      .register(registerRequest)
      .then(() => {
        setLoginResponse(loginResponse);
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  };

  const handleLogout = () => {
    setLoginResponse(null);
    setCurrentView("login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {currentView === "login" && (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView("register")}
          />
        )}
        {currentView === "register" && (
          <RegisterPage
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentView("login")}
          />
        )}
        {currentView === "dashboard" && loginResponse && (
          <Dashboard user={loginResponse} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}
