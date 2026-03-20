import React from "react";

const ProgressRing = ({ completed, total, dark }) => {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex items-center gap-3">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke={dark ? "#1e293b" : "#e2e8f0"} strokeWidth="6"/>
        <circle
          cx="36" cy="36" r={r}
          fill="none"
          stroke="#6272f5"
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
        <text x="36" y="36" textAnchor="middle" dominantBaseline="central"
          fill={dark ? "#e2e8f0" : "#0f172a"}
          fontSize="14"
          fontFamily="Syne, sans-serif"
          fontWeight="700"
        >{pct}%</text>
      </svg>
      <div>
        <p className={`font-display font-bold text-lg leading-none ${dark ? "text-white" : "text-slate-800"}`}>{completed}/{total}</p>
        <p className={`text-xs mt-0.5 font-body ${dark ? "text-slate-500" : "text-slate-400"}`}>tasks completed</p>
      </div>
    </div>
  );
};

export default ProgressRing;
