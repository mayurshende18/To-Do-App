import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const getAllTasks = (params = {}) => api.get("/tasks", { params }).then(r => r.data);
export const getStats = () => api.get("/tasks/stats").then(r => r.data);
export const createTask = (payload) => api.post("/tasks", payload).then(r => r.data);
export const updateTask = (id, updates) => api.put(`/tasks/${id}`, updates).then(r => r.data);
export const reorderTasks = (orderedIds) => api.put("/tasks/reorder", { orderedIds }).then(r => r.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then(r => r.data);
export const deleteCompleted = () => api.delete("/tasks/completed").then(r => r.data);

export default api;

// Category endpoints
export const getAllCategories = () => api.get("/categories").then(r => r.data);
export const createCategory = (payload) => api.post("/categories", payload).then(r => r.data);
export const updateCategory = (id, payload) => api.put(`/categories/${id}`, payload).then(r => r.data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`).then(r => r.data);

// Export
export const exportTasks = (format = "json") =>
  api.get("/tasks/export", { params: { format }, responseType: format === "csv" ? "blob" : "json" }).then(r => r);
