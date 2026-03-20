import React, { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

const Modal = ({ open, onClose, title, children, width = "max-w-md" }) => {
  const { dark } = useTheme();

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Panel */}
      <div className={`relative w-full ${width} rounded-3xl border shadow-2xl animate-pop-in ${
        dark
          ? "bg-slate-900 border-slate-700/60"
          : "bg-white border-slate-200"
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 pt-5 pb-4 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
          <h2 className={`font-display font-bold text-base ${dark ? "text-white" : "text-slate-800"}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${dark ? "text-slate-500 hover:bg-slate-800 hover:text-slate-300" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
