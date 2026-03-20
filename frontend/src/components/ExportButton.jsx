import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import * as api from "../services/api";
import { logActivity } from "./ActivityLog";

const ExportButton = () => {
  const { dark } = useTheme();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null);

  const doExport = async (format) => {
    setLoading(format);
    try {
      const res = await api.exportTasks(format);
      if (format === "csv") {
        const url = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url; a.download = "tasks.csv"; a.click();
        URL.revokeObjectURL(url);
      } else {
        const json = JSON.stringify(res.data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "tasks.json"; a.click();
        URL.revokeObjectURL(url);
      }
      logActivity(`Exported tasks as ${format.toUpperCase()}`, "success");
      setOpen(false);
    } catch {
      logActivity(`Export failed`, "error");
    } finally {
      setLoading(null);
    }
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
        title="Export tasks (Ctrl+E)"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Export
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)}/>
          <div className={`absolute right-0 top-10 z-40 rounded-2xl border shadow-2xl overflow-hidden w-44 ${
            dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
          }`}>
            {["json", "csv"].map(fmt => (
              <button
                key={fmt}
                onClick={() => doExport(fmt)}
                disabled={loading === fmt}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-body text-left transition-all border-b last:border-0 ${
                  dark ? "border-slate-800 text-slate-300 hover:bg-slate-800" : "border-slate-100 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="text-base">{fmt === "json" ? "{ }" : "📊"}</span>
                <div>
                  <p className={`text-xs font-display font-semibold uppercase ${dark ? "text-slate-200" : "text-slate-700"}`}>{fmt}</p>
                  <p className={`text-[10px] ${dark ? "text-slate-600" : "text-slate-400"}`}>{fmt === "json" ? "Full data" : "Spreadsheet"}</p>
                </div>
                {loading === fmt && <svg className="animate-spin w-3.5 h-3.5 ml-auto text-ink-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;
