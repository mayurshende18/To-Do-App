import React from "react";
import { useTheme } from "../context/ThemeContext";

const StatCard = ({ label, value, color, icon }) => {
  const { dark } = useTheme();
  return (
    <div className={`flex-1 min-w-[100px] rounded-2xl px-4 py-3 flex items-center gap-3 border transition-all duration-300 ${
      dark
        ? "bg-slate-900/60 border-slate-700/40 hover:border-slate-600/60"
        : "bg-white/80 border-slate-200 hover:border-slate-300 shadow-sm"
    }`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${color}`}>
        {icon}
      </div>
      <div>
        <p className={`text-xl font-display font-extrabold leading-none ${dark ? "text-white" : "text-slate-800"}`}>{value ?? "—"}</p>
        <p className={`text-xs mt-0.5 font-body ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
      </div>
    </div>
  );
};

const StatsBar = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-6 animate-slide-up" style={{ animationDelay: "60ms" }}>
      <StatCard
        label="Total"
        value={stats.total}
        icon="📋"
        color="bg-ink-500/20 text-ink-400"
      />
      <StatCard
        label="Done"
        value={stats.completed}
        icon="✅"
        color="bg-emerald-500/20 text-emerald-400"
      />
      <StatCard
        label="Pending"
        value={stats.pending}
        icon="⏳"
        color="bg-amber-500/20 text-amber-400"
      />
      <StatCard
        label="Overdue"
        value={stats.overdue}
        icon="🔴"
        color="bg-red-500/20 text-red-400"
      />
    </div>
  );
};

export default StatsBar;
