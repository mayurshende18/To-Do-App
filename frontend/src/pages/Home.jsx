import React, { useRef, useState, useMemo } from "react";
import TodoForm from "../components/TodoForm";
import TodoTable from "../components/TodoTable";
import StatsBar from "../components/StatsBar";
import FilterBar from "../components/FilterBar";
import ProgressRing from "../components/ProgressRing";
import ActivityLog from "../components/ActivityLog";
import ExportButton from "../components/ExportButton";
import CategoryModal from "../components/modals/CategoryModal";
import ShortcutsModal from "../components/modals/ShortcutsModal";
import { useToast } from "../components/Toast";
import { useTheme } from "../context/ThemeContext";
import { useTasks } from "../hooks/useTasks";
import { useCategories } from "../hooks/useCategories";
import useKeyboard from "../hooks/useKeyboard";

const Home = () => {
  const { dark, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const {
    tasks, stats, loading, adding, filters,
    setFilters, handleAdd, handleDelete,
    handleDeleteCompleted, handleUpdate, handleReorder,
  } = useTasks(addToast);

  const { categories, create: createCat, update: updateCat, remove: removeCat } = useCategories(addToast);

  const [showCategories, setShowCategories] = useState(false);
  const [showShortcuts,  setShowShortcuts]  = useState(false);

  const formInputRef  = useRef(null);
  const searchInputRef = useRef(null);

  // Keyboard shortcuts
  const shortcuts = useMemo(() => [
    { key: "n",   action: () => formInputRef.current?.focus(),   description: "Focus new task" },
    { key: "f", ctrl: true, action: () => searchInputRef.current?.focus(), description: "Focus search" },
    { key: "t", ctrl: true, action: toggleTheme,                description: "Toggle theme" },
    { key: "e", ctrl: true, action: () => {},                   description: "Export (via button)" },
    { key: "/", ctrl: true, action: () => setShowShortcuts(true), description: "Show shortcuts" },
    { key: "k", ctrl: true, action: () => setShowShortcuts(true), description: "Show shortcuts" },
  ], [toggleTheme]);

  useKeyboard(shortcuts);

  const completedCount = stats?.completed ?? 0;
  const totalCount     = stats?.total     ?? 0;
  const hasCompleted   = tasks.some(t => t.completed);

  const card = `rounded-3xl border transition-colors duration-300 ${
    dark
      ? "bg-slate-900/50 border-slate-700/50 shadow-2xl shadow-slate-950/60"
      : "bg-white border-slate-200 shadow-xl shadow-slate-200/60"
  }`;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "" : "bg-slate-50"}`}>
      {/* Ambient background (dark only) */}
      {dark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-ink-700/20 rounded-full blur-[120px]"/>
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-ink-600/10 rounded-full blur-[120px]"/>
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-slate-700/15 rounded-full blur-[100px]"/>
        </div>
      )}

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">

        {/* ── Header ── */}
        <header className="flex items-start justify-between mb-8 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-10 h-10 rounded-2xl bg-ink-600 flex items-center justify-center shadow-lg shadow-ink-900/40 flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
              </div>
              <div>
                <h1 className={`font-display font-extrabold text-3xl tracking-tight leading-none ${dark ? "text-white" : "text-slate-900"}`}>
                  Todo Manager
                </h1>
                <p className={`text-xs font-body mt-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>
                  Stay organized · Ship what matters
                </p>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ActivityLog />
            <ExportButton />

            {/* Categories */}
            <button
              onClick={() => setShowCategories(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border font-display font-semibold transition-all ${
                dark
                  ? "bg-slate-800/80 border-slate-700 text-slate-400 hover:border-ink-500/50 hover:text-ink-400"
                  : "bg-white border-slate-200 text-slate-400 hover:border-ink-400/50 hover:text-ink-500 shadow-sm"
              }`}
              title="Manage categories"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              <span className="hidden sm:inline">Tags</span>
            </button>

            {/* Shortcuts help */}
            <button
              onClick={() => setShowShortcuts(true)}
              title="Keyboard shortcuts (Ctrl+/)"
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                dark
                  ? "bg-slate-800/80 border-slate-700 text-slate-500 hover:border-ink-500/50 hover:text-ink-400"
                  : "bg-white border-slate-200 text-slate-400 hover:border-ink-400/50 hover:text-ink-500 shadow-sm"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle theme (Ctrl+T)"
              className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                dark
                  ? "bg-slate-800/80 border-slate-700 text-slate-400 hover:border-ink-500/50 hover:text-ink-400"
                  : "bg-white border-slate-200 text-slate-500 hover:border-ink-400/50 hover:text-ink-500 shadow-sm"
              }`}
            >
              {dark
                ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              }
            </button>
          </div>
        </header>

        {/* ── Stats ── */}
        <StatsBar stats={stats} />

        {/* ── Progress + clear ── */}
        {totalCount > 0 && (
          <div className={`flex items-center justify-between mb-5 px-5 py-4 ${card} animate-slide-up`}
            style={{ animationDelay: "60ms" }}>
            <ProgressRing completed={completedCount} total={totalCount} dark={dark} />
            <div className="flex flex-col items-end gap-2">
              {/* Priority breakdown */}
              {stats?.byPriority && (
                <div className="flex gap-2">
                  {[["high","🔴"],["medium","🟡"],["low","🟢"]].map(([p, emoji]) =>
                    stats.byPriority[p] ? (
                      <span key={p} className={`text-xs px-2 py-0.5 rounded-lg font-display font-semibold ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                        {emoji} {stats.byPriority[p]}
                      </span>
                    ) : null
                  )}
                </div>
              )}
              {hasCompleted && (
                <button
                  onClick={handleDeleteCompleted}
                  className="text-xs font-display font-semibold text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 px-3 py-1.5 rounded-xl transition-all"
                >
                  Clear Completed
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Add Task ── */}
        <div className={`p-6 mb-5 ${card} animate-slide-up`} style={{ animationDelay: "80ms" }}>
          <h2 className={`font-display font-semibold text-xs mb-4 uppercase tracking-wider flex items-center gap-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
            <span className="w-1.5 h-1.5 bg-ink-500 rounded-full"/>New Task
            <span className={`ml-auto text-[10px] normal-case font-body ${dark ? "text-slate-700" : "text-slate-300"}`}>Press N to focus</span>
          </h2>
          <TodoForm
            onAdd={handleAdd}
            loading={adding}
            categories={categories}
            inputRef={formInputRef}
          />
        </div>

        {/* ── Task List ── */}
        <div className={`p-6 ${card} animate-slide-up`} style={{ animationDelay: "110ms" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className={`font-display font-semibold text-xs uppercase tracking-wider flex items-center gap-2 ${dark ? "text-slate-500" : "text-slate-400"}`}>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"/>
              Tasks
              {tasks.length > 0 && (
                <span className={`font-bold px-2 py-0.5 rounded-lg text-xs ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                  {tasks.length}
                </span>
              )}
            </h2>
            {tasks.length > 0 && (
              <span className={`text-[10px] font-body ${dark ? "text-slate-700" : "text-slate-300"}`}>
                Drag rows to reorder
              </span>
            )}
          </div>

          <FilterBar
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            searchRef={searchInputRef}
          />

          <TodoTable
            tasks={tasks}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onReorder={handleReorder}
            loading={loading}
            categories={categories}
          />
        </div>

        {/* Footer */}
        <footer className={`text-center mt-8 text-xs font-body animate-fade-in ${dark ? "text-slate-800" : "text-slate-300"}`}
          style={{ animationDelay: "180ms" }}>
          MongoDB · Express · React · Node.js &nbsp;·&nbsp; Press <kbd className={`px-1.5 py-0.5 rounded text-[10px] border font-display ${dark ? "border-slate-700 text-slate-600" : "border-slate-300 text-slate-400"}`}>Ctrl+/</kbd> for shortcuts
        </footer>
      </div>

      {/* Modals */}
      <CategoryModal
        open={showCategories}
        onClose={() => setShowCategories(false)}
        categories={categories}
        onCreate={createCat}
        onDelete={removeCat}
      />
      <ShortcutsModal
        open={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
};

export default Home;
