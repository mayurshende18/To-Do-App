import React from "react";
import { useTheme } from "../context/ThemeContext";

const PRIORITY_OPTIONS = [
  { value: "all",    label: "All Priorities" },
  { value: "high",   label: "🔴 High" },
  { value: "medium", label: "🟡 Medium" },
  { value: "low",    label: "🟢 Low" },
];

const STATUS_OPTIONS = [
  { value: "all",   label: "All Status" },
  { value: "false", label: "⏳ Pending" },
  { value: "true",  label: "✅ Done" },
];

const SORT_OPTIONS = [
  { value: "order",     label: "Custom Order" },
  { value: "createdAt", label: "Date Created" },
  { value: "priority",  label: "Priority" },
  { value: "dueDate",   label: "Due Date" },
  { value: "task",      label: "Alphabetical" },
];

const Sel = ({ value, onChange, options, dark }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    className={`px-3 py-2 rounded-xl text-xs font-body border outline-none cursor-pointer transition-all ${
      dark
        ? "bg-slate-800/80 border-slate-700/60 text-slate-300 hover:border-ink-500/50 focus:border-ink-500"
        : "bg-white border-slate-200 text-slate-600 hover:border-ink-400/50 focus:border-ink-400 shadow-sm"
    }`}
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const FilterBar = ({ filters, setFilters, categories = [], searchRef }) => {
  const { dark } = useTheme();
  const upd = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  const categoryOptions = [
    { value: "all",  label: "All Categories" },
    { value: "none", label: "📂 Uncategorized" },
    ...categories.map(c => ({ value: c._id, label: `${c.icon} ${c.name}` })),
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-5">
      {/* Search */}
      <div className="relative flex-1 min-w-[160px]">
        <svg className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${dark ? "text-slate-500" : "text-slate-400"}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          ref={searchRef}
          type="text"
          value={filters.search}
          onChange={e => upd("search", e.target.value)}
          placeholder="Search tasks, tags, notes…"
          className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs font-body border outline-none transition-all ${
            dark
              ? "bg-slate-800/80 border-slate-700/60 text-slate-200 placeholder-slate-600 focus:border-ink-500"
              : "bg-white border-slate-200 text-slate-700 placeholder-slate-400 focus:border-ink-400 shadow-sm"
          }`}
        />
        {filters.search && (
          <button onClick={() => upd("search", "")}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full ${dark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      <Sel value={filters.priority}  onChange={v => upd("priority", v)}  options={PRIORITY_OPTIONS}  dark={dark} />
      <Sel value={filters.completed} onChange={v => upd("completed", v)} options={STATUS_OPTIONS}    dark={dark} />
      {categories.length > 0 && (
        <Sel value={filters.category} onChange={v => upd("category", v)} options={categoryOptions} dark={dark} />
      )}
      <Sel value={filters.sortBy}    onChange={v => upd("sortBy", v)}    options={SORT_OPTIONS}      dark={dark} />

      {/* Sort direction */}
      <button
        onClick={() => upd("sortDir", filters.sortDir === "asc" ? "desc" : "asc")}
        title={`Sort ${filters.sortDir === "asc" ? "descending" : "ascending"}`}
        className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
          dark
            ? "bg-slate-800/80 border-slate-700/60 text-slate-400 hover:border-ink-500/50 hover:text-ink-400"
            : "bg-white border-slate-200 text-slate-400 hover:border-ink-400/50 hover:text-ink-500 shadow-sm"
        }`}
      >
        {filters.sortDir === "asc"
          ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/></svg>
          : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"/></svg>
        }
      </button>

      {/* Reset filters */}
      {(filters.search || filters.priority !== "all" || filters.completed !== "all" || filters.category !== "all") && (
        <button
          onClick={() => setFilters(f => ({ ...f, search: "", priority: "all", completed: "all", category: "all" }))}
          className={`px-2.5 py-2 rounded-xl text-xs border font-display font-semibold transition-all ${
            dark
              ? "border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              : "border-amber-400/40 text-amber-500 hover:bg-amber-50"
          }`}
          title="Clear all filters"
        >
          ✕ Reset
        </button>
      )}
    </div>
  );
};

export default FilterBar;
