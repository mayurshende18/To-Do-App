import { useState, useEffect, useCallback } from "react";
import * as api from "../services/api";

export const useCategories = (addToast) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAllCategories();
      setCategories(res.data || []);
    } catch {
      // categories are optional, don't toast on failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (payload) => {
    try {
      const res = await api.createCategory(payload);
      setCategories(prev => [...prev, res.data]);
      addToast("Category created!", "success");
      return res.data;
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to create category", "error");
    }
  };

  const update = async (id, payload) => {
    try {
      const res = await api.updateCategory(id, payload);
      setCategories(prev => prev.map(c => c._id === id ? res.data : c));
      addToast("Category updated!", "success");
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to update category", "error");
    }
  };

  const remove = async (id) => {
    try {
      await api.deleteCategory(id);
      setCategories(prev => prev.filter(c => c._id !== id));
      addToast("Category deleted, tasks unlinked", "info");
    } catch {
      addToast("Failed to delete category", "error");
    }
  };

  return { categories, loading, create, update, remove, refetch: fetch };
};
