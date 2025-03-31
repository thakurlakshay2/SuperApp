// components/Toast.tsx
import React, { useEffect } from "react";

type ToastType = "info" | "success" | "warning" | "error";

interface ToastProps {
  title: string;
  description: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ title, description, type, onClose }) => {
  const typeClasses = {
    info: "bg-blue-500 border-blue-600 text-white",
    success: "bg-green-500 border-green-600 text-white",
    warning: "bg-yellow-500 border-yellow-600 text-white",
    error: "bg-red-500 border-red-600 text-white",
  };

  return (
    <div
      className={`flex items-center p-4 rounded-lg border-l-4 mb-4 shadow-lg transition-all animate-slide-up ${typeClasses[type]}`}
      role="alert"
    >
      <div className="flex-1">
        <strong className="font-bold">{title}</strong>
        <p className="text-sm">{description}</p>
      </div>
      <button onClick={onClose} className="ml-3 text-white">
        <svg
          className="w-6 h-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 17L17 7M17 17L7 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
