import React, { useState, useEffect, useCallback, createContext, useContext } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 pointer-events-none">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onRemove={() => setToasts(p => p.filter(t => t.id !== toast.id))} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const ICONS = {
  success: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>,
  error:   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>,
  info:    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
};

const STYLES = {
  success: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
  error:   "bg-red-500/15 border-red-500/40 text-red-300",
  info:    "bg-ink-500/15 border-ink-500/40 text-ink-300",
};

const Toast = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  return (
    <div
      onClick={onRemove}
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-sm shadow-2xl font-body text-sm font-medium cursor-pointer transition-all duration-300 ${STYLES[toast.type] || STYLES.success} ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
    >
      <span className="flex-shrink-0">{ICONS[toast.type] || ICONS.success}</span>
      <span>{toast.message}</span>
    </div>
  );
};
