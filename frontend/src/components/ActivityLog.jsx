import React, { useState, useCallback } from "react";
import { useTheme } from "../context/ThemeContext";

// Singleton log stored in module scope so it persists across renders without context
let _listeners = [];
let _log = [];

export const logActivity = (message, type = "info") => {
  const entry = { id: Date.now(), message, type, time: new Date() };
  _log = [entry, ..._log].slice(0, 50); // keep last 50
  _listeners.forEach(fn => fn([..._log]));
};

export const useActivityLog = () => {
  const [log, setLog] = useState([..._log]);

  const subscribe = useCallback((fn) => {
    _listeners.push(fn);
    return () => { _listeners = _listeners.filter(l => l !== fn); };
  }, []);

  React.useEffect(() => subscribe(setLog), [subscribe]);

  return log;
};

const TYPE_STYLES = {
  success: { dot: "bg-emerald-500", text: "text-emerald-400" },
  error:   { dot: "bg-red-500",     text: "text-red-400" },
  info:    { dot: "bg-ink-500",     text: "text-slate-400" },
  warn:    { dot: "bg-amber-500",   text: "text-amber-400" },
};

const ActivityLog = () => {
  const { dark } = useTheme();
  const [open, setOpen] = useState(false);
  const log = useActivityLog();

  const fmt = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border font-display font-semibold transition-all ${
          dark
            ? "bg-slate-800/80 border-slate-700 text-slate-400 hover:border-ink-500/50 hover:text-ink-400"
            : "bg-white border-slate-200 text-slate-400 hover:border-ink-400/50 hover:text-ink-500 shadow-sm"
        }`}
        title="Activity log"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Log
        {log.length > 0 && (
          <span className="w-4 h-4 rounded-full bg-ink-600 text-white text-[10px] flex items-center justify-center">
            {Math.min(log.length, 9)}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)}/>
          <div className={`absolute right-0 top-10 z-40 w-80 rounded-2xl border shadow-2xl overflow-hidden ${
            dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
          }`}>
            <div className={`flex items-center justify-between px-4 py-3 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
              <span className={`text-xs font-display font-bold uppercase tracking-wider ${dark ? "text-slate-400" : "text-slate-500"}`}>Activity Log</span>
              <button onClick={() => { _log = []; _listeners.forEach(fn => fn([])); }}
                className={`text-xs font-display font-semibold ${dark ? "text-slate-600 hover:text-slate-400" : "text-slate-400 hover:text-slate-600"}`}>
                Clear
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {log.length === 0 ? (
                <p className={`text-xs text-center py-8 font-body ${dark ? "text-slate-600" : "text-slate-400"}`}>No activity yet</p>
              ) : log.map(entry => {
                const s = TYPE_STYLES[entry.type] || TYPE_STYLES.info;
                return (
                  <div key={entry.id} className={`flex items-start gap-2.5 px-4 py-2.5 border-b last:border-0 ${dark ? "border-slate-800/60" : "border-slate-50"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${s.dot}`}/>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-body leading-snug ${dark ? "text-slate-300" : "text-slate-700"}`}>{entry.message}</p>
                      <p className={`text-[10px] mt-0.5 font-body ${dark ? "text-slate-600" : "text-slate-400"}`}>{fmt(entry.time)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityLog;
