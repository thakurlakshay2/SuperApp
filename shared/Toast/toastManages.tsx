// components/ToastManager.tsx
import React, { useState, useEffect } from "react";
import Toast from "./index";

interface ToastMessage {
  id: number;
  title: string;
  description: string;
  type: "info" | "success" | "warning" | "error";
}

const ToastManager: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  let nextId = 1;

  const addToast = (
    title: string,
    description: string,
    type: "info" | "success" | "warning" | "error"
  ) => {
    const newToast = { id: nextId++, title, description, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(newToast.id);
    }, 5000); // Auto dismiss after 5 seconds
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <div className="fixed bottom-5 right-5 space-y-3 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastManager;

// Function to generate a toast
export const generateToast = (
  title: string,
  description: string,
  type: "info" | "success" | "warning" | "error"
) => {
  const toastEvent = new CustomEvent("add-toast", {
    detail: { title, description, type },
  });
  window.dispatchEvent(toastEvent);
};
