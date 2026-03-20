import React, { useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const PRIORITY_CONFIG = {
  high:   { label: "High",   dot: "bg-red-500",     text: "text-red-400",     badge: "bg-red-500/10 border-red-500/30" },
  medium: { label: "Med",    dot: "bg-amber-500",   text: "text-amber-400",   badge: "bg-amber-500/10 border-amber-500/30" },
  low:    { label: "Low",    dot: "bg-emerald-500", text: "text-emerald-400", badge: "bg-emerald-500/10 border-emerald-500/30" },
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (diff < 0) return { label, overdue: true };
  if (diff === 0) return { label: "Today", overdue: false, today: true };
  if (diff === 1) return { label: "Tomorrow", overdue: false };
  return { label, overdue: false };
};

const TodoTable = ({ tasks, onDelete, onUpdate, onReorder, loading }) => {
  const { dark } = useTheme();
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [editTouched, setEditTouched] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const dragNode = useRef(null);

  const startEdit = (t) => {
    setEditingId(t._id);
    setEditValue(t.task);
    setEditPriority(t.priority || "medium");
    setEditDueDate(t.dueDate ? t.dueDate.split("T")[0] : "");
    setEditTouched(false);
  };

  const saveEdit = async (id) => {
    if (editValue.trim().length < 10) return;
    await onUpdate(id, { task: editValue.trim(), priority: editPriority, dueDate: editDueDate || null });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
    setConfirmId(null);
  };

  // Drag and drop
  const handleDragStart = (e, id) => {
    setDragId(id);
    dragNode.current = e.target;
    e.dataTransfer.effectAllowed = "move";
    setTimeout(() => { if (dragNode.current) dragNode.current.style.opacity = "0.4"; }, 0);
  };

  const handleDragEnd = () => {
    if (dragNode.current) dragNode.current.style.opacity = "1";
    setDragId(null);
    setDragOverId(null);
    dragNode.current = null;
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id !== dragId) setDragOverId(id);
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (dragId === targetId) return;
    const fromIndex = tasks.findIndex(t => t._id === dragId);
    const toIndex = tasks.findIndex(t => t._id === targetId);
    const reordered = [...tasks];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onReorder(reordered);
    setDragOverId(null);
  };

  const base = dark ? "bg-slate-900/60 border-slate-700/40" : "bg-white border-slate-200 shadow-sm";

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-16 rounded-2xl animate-pulse ${dark ? "bg-slate-800/50" : "bg-slate-100"}`} style={{ animationDelay: `${i * 80}ms` }}/>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 animate-fade-in">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-3xl ${dark ? "bg-slate-800/60" : "bg-slate-100"}`}>
          🎉
        </div>
        <div className="text-center">
          <p className={`font-display font-semibold text-lg ${dark ? "text-slate-400" : "text-slate-500"}`}>Nothing here!</p>
          <p className={`text-sm mt-1 ${dark ? "text-slate-600" : "text-slate-400"}`}>Add a task above or adjust your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className={`grid grid-cols-[32px_40px_1fr_80px_100px] px-4 py-2 gap-2 text-xs font-display font-semibold uppercase tracking-wider ${dark ? "text-slate-600" : "text-slate-400"}`}>
        <span/>
        <span>#</span>
        <span>Task</span>
        <span>Due</span>
        <span className="text-right">Actions</span>
      </div>

      {tasks.map((t, index) => {
        const pc = PRIORITY_CONFIG[t.priority] || PRIORITY_CONFIG.medium;
        const due = formatDate(t.dueDate);
        const isEditing = editingId === t._id;
        const isConfirm = confirmId === t._id;
        const isDeleting = deletingId === t._id;
        const isDragOver = dragOverId === t._id;

        return (
          <div
            key={t._id}
            draggable={!isEditing}
            onDragStart={e => handleDragStart(e, t._id)}
            onDragEnd={handleDragEnd}
            onDragOver={e => handleDragOver(e, t._id)}
            onDrop={e => handleDrop(e, t._id)}
            className={`
              group relative grid grid-cols-[32px_40px_1fr_80px_100px] items-start
              px-4 py-3.5 rounded-2xl border gap-2
              transition-all duration-300 cursor-default
              ${isDeleting ? "opacity-0 scale-95 pointer-events-none" : "animate-slide-up"}
              ${isDragOver ? (dark ? "border-ink-500/60 bg-ink-900/30" : "border-ink-400/60 bg-ink-50") : base}
              ${t.completed ? (dark ? "opacity-60" : "opacity-70") : ""}
            `}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            {/* Drag handle */}
            <div className={`flex items-center justify-center mt-0.5 cursor-grab active:cursor-grabbing ${dark ? "text-slate-700 group-hover:text-slate-500" : "text-slate-300 group-hover:text-slate-400"} transition-colors`}>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
                <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
              </svg>
            </div>

            {/* Index + priority dot */}
            <div className="flex flex-col items-center gap-1 mt-0.5">
              <span className={`font-display font-bold text-xs ${dark ? "text-ink-500" : "text-ink-400"}`}>{String(index + 1).padStart(2, "0")}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${pc.dot}`} title={pc.label}/>
            </div>

            {/* Task content */}
            <div className="flex flex-col gap-1.5 min-w-0">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={() => setEditTouched(true)}
                    className={`w-full px-3 py-1.5 rounded-xl border-2 outline-none text-sm font-body transition-all ${
                      dark ? "bg-slate-800 border-ink-500/60 text-slate-100" : "bg-white border-ink-400/60 text-slate-800 shadow-sm"
                    }`}
                    autoFocus
                  />
                  <div className="flex gap-2 flex-wrap">
                    {["low","medium","high"].map(p => {
                      const pp = PRIORITY_CONFIG[p];
                      return (
                        <button key={p} type="button" onClick={() => setEditPriority(p)}
                          className={`px-2 py-0.5 rounded-lg text-xs border font-display font-semibold transition-all ${editPriority === p ? `${pp.badge} ${pp.text}` : dark ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-400"}`}>
                          {pp.label}
                        </button>
                      );
                    })}
                    <input type="date" value={editDueDate} onChange={e => setEditDueDate(e.target.value)}
                      className={`px-2 py-0.5 rounded-lg text-xs border outline-none font-body ${dark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-600"}`}
                    />
                  </div>
                  {editTouched && editValue.trim().length < 10 && (
                    <p className="text-red-400 text-xs">Min. 10 characters required</p>
                  )}
                </div>
              ) : (
                <>
                  <span className={`font-body text-sm leading-snug break-words ${t.completed ? "line-through opacity-50" : dark ? "text-slate-200" : "text-slate-700"}`}>
                    {t.task}
                  </span>
                  {/* Tags */}
                  {t.tags && t.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {t.tags.map(tag => (
                        <span key={tag} className={`text-xs px-1.5 py-0.5 rounded-md font-display font-semibold ${dark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400"}`}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Due date */}
            <div className="mt-0.5">
              {due && !isEditing && (
                <span className={`text-xs px-2 py-0.5 rounded-lg font-display font-semibold border ${
                  due.overdue
                    ? "text-red-400 bg-red-500/10 border-red-500/30"
                    : due.today
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                    : dark ? "text-slate-500 bg-slate-800 border-slate-700" : "text-slate-400 bg-slate-100 border-slate-200"
                }`}>
                  {due.overdue ? "⚠ " : ""}{due.label}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1.5 flex-shrink-0 mt-0.5">
              {isEditing ? (
                <>
                  <button onClick={() => saveEdit(t._id)} disabled={editValue.trim().length < 10}
                    className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/30 transition-all disabled:opacity-30"
                    title="Save">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${dark ? "bg-slate-800 text-slate-500 hover:bg-slate-700" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}
                    title="Cancel">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                </>
              ) : isConfirm ? (
                <>
                  <button onClick={() => handleDelete(t._id)}
                    className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-display font-bold hover:bg-red-500/30 transition-all">
                    Yes
                  </button>
                  <button onClick={() => setConfirmId(null)}
                    className={`px-2 py-1 rounded-lg text-xs font-display font-bold transition-all ${dark ? "bg-slate-800 text-slate-500 hover:bg-slate-700" : "bg-slate-100 text-slate-400 hover:bg-slate-200"}`}>
                    No
                  </button>
                </>
              ) : (
                <>
                  {/* Complete */}
                  <button onClick={() => onUpdate(t._id, { completed: !t.completed })}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${t.completed ? "bg-emerald-500/20 text-emerald-400" : dark ? "bg-slate-800 text-slate-600 hover:bg-emerald-500/10 hover:text-emerald-400" : "bg-slate-100 text-slate-300 hover:bg-emerald-50 hover:text-emerald-500"}`}
                    title={t.completed ? "Mark pending" : "Mark done"}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                  </button>
                  {/* Edit */}
                  <button onClick={() => startEdit(t)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${dark ? "bg-slate-800 text-slate-600 hover:bg-ink-500/20 hover:text-ink-400" : "bg-slate-100 text-slate-300 hover:bg-ink-50 hover:text-ink-500"}`}
                    title="Edit">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  {/* Delete */}
                  <button onClick={() => setConfirmId(t._id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${dark ? "bg-slate-800 text-slate-600 hover:bg-red-500/20 hover:text-red-400" : "bg-slate-100 text-slate-300 hover:bg-red-50 hover:text-red-400"}`}
                    title="Delete">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TodoTable;
