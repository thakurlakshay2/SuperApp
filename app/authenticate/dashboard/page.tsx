"use client";
import { Mail, Phone, User } from "lucide-react";
import { User as BaseUser } from "@/app/payUrFren/types";

export const Dashboard = ({
  user,
  onLogout,
}: {
  user: LoginResponse;
  onLogout: () => void;
}) => {
  return (
    <div className="w-full max-w-2xl transform transition-all duration-500 animate-in slide-in-from-top-4">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400/30 to-slate-400/30 border-2 border-white/20 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-blue-300" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome, {user.username}!
          </h1>
          <p className="text-blue-100/80">You have successfully logged in</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-300" />
              <div>
                <p className="text-sm text-blue-100/70">Email</p>
                <p className="text-white font-medium">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-300" />
              <div>
                <p className="text-sm text-blue-100/70">Phone</p>
                <p className="text-white font-medium">{user.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full bg-gradient-to-r from-slate-600 to-slate-500 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
