import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const PRIORITIES = [
  { value: "low",    label: "Low",    color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
  { value: "medium", label: "Medium", color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/30" },
  { value: "high",   label: "High",   color: "text-red-400",     bg: "bg-red-500/10 border-red-500/30" },
];

const TodoForm = ({ onAdd, loading, categories = [], inputRef }) => {
  const { dark } = useTheme();
  const [task,     setTask]     = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate,  setDueDate]  = useState("");
  const [tags,     setTags]     = useState("");
  const [notes,    setNotes]    = useState("");
  const [category, setCategory] = useState("");
  const [touched,  setTouched]  = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isValid   = task.trim().length >= 10;
  const showError = touched && !isValid;
  const charCount = task.trim().length;

  const reset = () => {
    setTask(""); setTags(""); setDueDate(""); setNotes("");
    setPriority("medium"); setCategory(""); setTouched(false); setExpanded(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);
    await onAdd({ task: task.trim(), priority, dueDate: dueDate || undefined, tags: tagList, notes, category: category || undefined });
    reset();
  };

  const sel = PRIORITIES.find(p => p.value === priority);
  const baseInput = `w-full px-3 py-2 rounded-xl text-xs border outline-none font-body transition-all ${
    dark ? "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-600 focus:border-ink-500" : "bg-white border-slate-200 text-slate-700 placeholder-slate-400 focus:border-ink-400 shadow-sm"
  }`;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      {/* Main textarea */}
      <div className="relative">
        <textarea
          ref={inputRef}
          value={task}
          onChange={e => setTask(e.target.value)}
          onBlur={() => setTouched(true)}
          onFocus={() => setExpanded(true)}
          placeholder="What needs to be done? (minimum 10 characters)"
          rows={expanded ? 3 : 2}
          disabled={loading}
          className={`w-full px-5 py-4 rounded-2xl resize-none outline-none transition-all duration-200 font-body text-sm leading-relaxed border-2 ${
            dark
              ? `bg-slate-900/60 text-slate-100 placeholder-slate-500 ${showError ? "border-red-500/60" : isValid ? "border-ink-500/60 focus:border-ink-400" : "border-slate-700/60 focus:border-ink-500/40"}`
              : `bg-slate-50 text-slate-800 placeholder-slate-400 ${showError ? "border-red-400/60" : isValid ? "border-ink-400/60 focus:border-ink-400" : "border-slate-200 focus:border-ink-400/60"}`
          }`}
        />
        <span className={`absolute bottom-3 right-4 text-xs font-display font-semibold transition-colors ${charCount >= 10 ? "text-ink-400" : dark ? "text-slate-700" : "text-slate-300"}`}>
          {charCount}/10{charCount > 10 ? "+" : ""}
        </span>
      </div>

      {/* Validation error */}
      <div className={`overflow-hidden transition-all duration-200 ${showError ? "max-h-6 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="text-red-400 text-xs flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
          Task must be at least 10 characters
        </p>
      </div>

      {/* Expanded options */}
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3">
          {/* Priority */}
          <div className="col-span-2 sm:col-span-3">
            <p className={`text-[10px] font-display font-semibold uppercase tracking-wider mb-1.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>Priority</p>
            <div className="flex gap-1.5">
              {PRIORITIES.map(p => (
                <button key={p.value} type="button" onClick={() => setPriority(p.value)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-display font-semibold border-2 transition-all ${priority === p.value ? `${p.bg} ${p.color}` : dark ? "border-slate-700/60 text-slate-600 hover:border-slate-600" : "border-slate-200 text-slate-400 hover:border-slate-300"}`}>
                  {p.label} 
                </button>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div>
            <p className={`text-[10px] font-display font-semibold uppercase tracking-wider mb-1.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>Due Date</p>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} className={baseInput} />
          </div>

          {/* Category */}
          {categories.length > 0 && (
            <div>
              <p className={`text-[10px] font-display font-semibold uppercase tracking-wider mb-1.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>Category</p>
              <select value={category} onChange={e => setCategory(e.target.value)} className={baseInput}>
                <option value="">None</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
          )}

          {/* Tags */}
          <div className={categories.length > 0 ? "" : "col-span-2"}>
            <p className={`text-[10px] font-display font-semibold uppercase tracking-wider mb-1.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>Tags (comma-separated)</p>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)}
              placeholder="work, urgent, …" className={baseInput} />
          </div>

          {/* Notes */}
          <div className="col-span-2 sm:col-span-3">
            <p className={`text-[10px] font-display font-semibold uppercase tracking-wider mb-1.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>Notes (optional)</p>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Any additional context…" maxLength={500} className={baseInput} />
          </div>
        </div>
      </div>

      {/* Actions row */}
      <div className="flex gap-2">
        {expanded && (
          <button type="button" onClick={() => setExpanded(false)}
            className={`px-3 py-3 rounded-xl text-xs border font-display font-semibold transition-all ${dark ? "border-slate-700 text-slate-500 hover:border-slate-600" : "border-slate-200 text-slate-400 hover:border-slate-300"}`}>
            Less
          </button>
        )}
        <button type="submit" disabled={!isValid || loading}
          className={`flex-1 py-3.5 rounded-xl font-display font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
            isValid && !loading
              ? "bg-ink-600 hover:bg-ink-500 text-white shadow-lg shadow-ink-900/30 hover:-translate-y-0.5 active:translate-y-0"
              : dark ? "bg-slate-800 text-slate-600 cursor-not-allowed" : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}>
          {loading
            ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Adding…</>
            : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
                Add Task
                {priority && <span className={`text-xs px-1.5 py-0.5 rounded-lg border ml-1 ${sel?.bg} ${sel?.color}`}>{sel?.label}</span>}
              </>
          }
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
