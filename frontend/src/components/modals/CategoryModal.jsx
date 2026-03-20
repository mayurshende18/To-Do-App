import React, { useState } from "react";
import Modal from "./Modal";
import { useTheme } from "../../context/ThemeContext";

const PRESET_COLORS = ["#6272f5","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"];
const PRESET_ICONS  = ["📁","💼","🏠","🎯","🚀","📚","💡","🛒","❤️","🎨","⚙️","🔬"];

const CategoryModal = ({ open, onClose, categories, onCreate, onDelete }) => {
  const { dark } = useTheme();
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6272f5");
  const [icon, setIcon] = useState("📁");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleCreate = async () => {
    if (name.trim().length < 2) return;
    await onCreate({ name: name.trim(), color, icon });
    setName(""); setColor("#6272f5"); setIcon("📁");
  };

  const inp = `w-full px-3 py-2 rounded-xl text-sm border outline-none font-body transition-all ${
    dark ? "bg-slate-800 border-slate-700 text-slate-100 focus:border-ink-500" : "bg-white border-slate-200 text-slate-800 focus:border-ink-400 shadow-sm"
  }`;

  return (
    <Modal open={open} onClose={onClose} title="Manage Categories">
      {/* Create new */}
      <div className="space-y-3 mb-6">
        <p className={`text-xs font-display font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>New Category</p>
        <input className={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Category name (min 2 chars)" />

        {/* Icon picker */}
        <div>
          <p className={`text-xs mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Icon</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_ICONS.map(ic => (
              <button key={ic} onClick={() => setIcon(ic)}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 transition-all ${
                  icon === ic ? "border-ink-500 scale-110" : dark ? "border-slate-700 hover:border-slate-600" : "border-slate-200 hover:border-slate-300"
                }`}>
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <p className={`text-xs mb-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>Color</p>
          <div className="flex gap-2 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)}
                className={`w-7 h-7 rounded-lg border-2 transition-all ${color === c ? "scale-125 border-white" : "border-transparent"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={name.trim().length < 2}
          className={`w-full py-2.5 rounded-xl text-sm font-display font-semibold transition-all ${
            name.trim().length >= 2
              ? "bg-ink-600 hover:bg-ink-500 text-white"
              : dark ? "bg-slate-800 text-slate-600 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          + Create Category
        </button>
      </div>

      {/* Existing categories */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <p className={`text-xs font-display font-semibold uppercase tracking-wider ${dark ? "text-slate-500" : "text-slate-400"}`}>
            Existing ({categories.length})
          </p>
          {categories.map(cat => (
            <div key={cat._id} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${dark ? "border-slate-800 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{cat.icon}</span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}/>
                <span className={`text-sm font-body ${dark ? "text-slate-300" : "text-slate-700"}`}>{cat.name}</span>
                <span className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>({cat.taskCount || 0})</span>
              </div>
              {confirmDelete === cat._id ? (
                <div className="flex gap-1.5">
                  <button onClick={() => { onDelete(cat._id); setConfirmDelete(null); }}
                    className="text-xs px-2 py-1 rounded-lg bg-red-500/20 text-red-400 font-display font-semibold">
                    Delete
                  </button>
                  <button onClick={() => setConfirmDelete(null)}
                    className={`text-xs px-2 py-1 rounded-lg font-display font-semibold ${dark ? "bg-slate-700 text-slate-400" : "bg-slate-200 text-slate-500"}`}>
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(cat._id)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${dark ? "text-slate-600 hover:bg-red-500/20 hover:text-red-400" : "text-slate-300 hover:bg-red-50 hover:text-red-400"}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default CategoryModal;
