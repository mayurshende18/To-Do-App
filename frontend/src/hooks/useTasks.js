import { useState, useEffect, useCallback } from "react";
import * as api from "../services/api";
import { logActivity } from "../components/ActivityLog";

export const useTasks = (addToast) => {
  const [tasks, setTasks]   = useState([]);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding]   = useState(false);
  const [filters, setFilters] = useState({
    search: "", priority: "all", completed: "all",
    sortBy: "order", sortDir: "asc", category: "all",
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.getStats();
      setStats(res.data || null);
    } catch {}
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.search)               params.search    = filters.search;
      if (filters.priority !== "all")   params.priority  = filters.priority;
      if (filters.completed !== "all")  params.completed = filters.completed;
      if (filters.category !== "all")   params.category  = filters.category;
      params.sortBy  = filters.sortBy;
      params.sortDir = filters.sortDir;

      const [taskRes, statsRes] = await Promise.all([
        api.getAllTasks(params),
        api.getStats(),
      ]);
      setTasks(taskRes.data || []);
      setStats(statsRes.data || null);
    } catch {
      addToast("Failed to connect to backend", "error");
      logActivity("Failed to fetch tasks — is the backend running?", "error");
    } finally {
      setLoading(false);
    }
  }, [filters, addToast]);

  // Debounce search, immediate for other filter changes
  useEffect(() => {
    const delay = filters.search ? 300 : 0;
    const t = setTimeout(fetchTasks, delay);
    return () => clearTimeout(t);
  }, [fetchTasks, filters.search]);

  const handleAdd = async (payload) => {
    try {
      setAdding(true);
      const res = await api.createTask(payload);
      setTasks(prev => [res.data, ...prev]);
      fetchStats();
      addToast("Task added!", "success");
      logActivity(`Added: "${res.data.task.slice(0, 40)}${res.data.task.length > 40 ? "…" : ""}"`, "success");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add task";
      addToast(msg, "error");
      logActivity(`Add failed: ${msg}`, "error");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    const task = tasks.find(t => t._id === id);
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      fetchStats();
      addToast("Task deleted", "info");
      logActivity(`Deleted: "${(task?.task || "task").slice(0, 40)}"`, "info");
    } catch {
      addToast("Failed to delete task", "error");
      logActivity("Delete failed", "error");
    }
  };

  const handleDeleteCompleted = async () => {
    try {
      const res = await api.deleteCompleted();
      setTasks(prev => prev.filter(t => !t.completed));
      fetchStats();
      addToast("Cleared completed tasks", "info");
      logActivity(res.message, "info");
    } catch {
      addToast("Failed to clear tasks", "error");
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const res = await api.updateTask(id, updates);
      setTasks(prev => prev.map(t => t._id === id ? res.data : t));
      fetchStats();
      // Quiet on toggle-complete; verbose on edit
      if (updates.task !== undefined) {
        addToast("Task updated!", "success");
        logActivity(`Edited: "${res.data.task.slice(0, 40)}"`, "success");
      } else if (updates.completed !== undefined) {
        logActivity(`Marked ${updates.completed ? "complete" : "pending"}: "${res.data.task.slice(0, 40)}"`, "info");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update task";
      addToast(msg, "error");
      logActivity(`Update failed: ${msg}`, "error");
    }
  };

  const handleReorder = async (newOrder) => {
    setTasks(newOrder);
    try {
      await api.reorderTasks(newOrder.map(t => t._id));
      logActivity("Tasks reordered", "info");
    } catch {
      addToast("Failed to save order", "error");
    }
  };

  return {
    tasks, stats, loading, adding, filters,
    setFilters, handleAdd, handleDelete,
    handleDeleteCompleted, handleUpdate, handleReorder,
    refetch: fetchTasks,
  };
};
