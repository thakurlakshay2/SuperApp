"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Phone, Check } from "lucide-react";
import { User } from "@/app/payUrFren/types";

export const LoginPage = ({
  onLogin,
  onSwitchToRegister,
}: {
  onLogin: (user: LoginRequest) => void;
  onSwitchToRegister: () => void;
}) => {
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock successful login
    onLogin({
      email:
        loginMethod === "email" ? formData.emailOrPhone : "john@example.com",
      // phone: loginMethod === "phone" ? formData.emailOrPhone : "+1234567890",
      password: formData.password,
    });
  };

  return (
    <div className="w-full max-w-md transform transition-all duration-500 animate-in slide-in-from-bottom-4">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-100/80">Sign in to your account</p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setLoginMethod("email")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 ${
              loginMethod === "email"
                ? "bg-blue-500/80 text-white shadow-lg"
                : "text-blue-100/70 hover:text-white"
            }`}
          >
            <Mail size={16} />
            Email
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod("phone")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 ${
              loginMethod === "phone"
                ? "bg-blue-500/80 text-white shadow-lg"
                : "text-blue-100/70 hover:text-white"
            }`}
          >
            <Phone size={16} />
            Phone
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-100/90 mb-2">
                {loginMethod === "email" ? "Email Address" : "Phone Number"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {loginMethod === "email" ? (
                    <Mail className="h-5 w-5 text-blue-300/70" />
                  ) : (
                    <Phone className="h-5 w-5 text-blue-300/70" />
                  )}
                </div>
                <input
                  type={loginMethod === "email" ? "email" : "tel"}
                  placeholder={
                    loginMethod === "email"
                      ? "Enter your email"
                      : "Enter your phone"
                  }
                  value={formData.emailOrPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, emailOrPhone: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-100/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100/90 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-100/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300/70 hover:text-blue-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="sr-only" />
              <div className="w-4 h-4 bg-white/10 border border-white/30 rounded flex items-center justify-center">
                <Check size={12} className="text-blue-300 opacity-0" />
              </div>
              <span className="ml-2 text-sm text-blue-100/80">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm text-blue-300 hover:text-blue-200 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-blue-100/80">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
