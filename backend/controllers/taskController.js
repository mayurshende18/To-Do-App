const Task = require("../models/Task");

// GET /api/tasks
const getAllTasks = async (req, res, next) => {
  try {
    const { search, priority, completed, sortBy = "order", sortDir = "asc", category } = req.query;
    const filter = {};
    if (search) filter.$or = [
      { task: { $regex: search, $options: "i" } },
      { tags: { $elemMatch: { $regex: search, $options: "i" } } },
      { notes: { $regex: search, $options: "i" } },
    ];
    if (priority && priority !== "all") filter.priority = priority;
    if (completed !== undefined && completed !== "all") filter.completed = completed === "true";
    if (category && category !== "all") filter.category = category === "none" ? null : category;

    const sortDir_ = sortDir === "desc" ? -1 : 1;
    const sortMap = {
      order: { order: sortDir_ },
      createdAt: { createdAt: sortDir_ },
      priority: { priority: sortDir_ },
      dueDate: { dueDate: sortDir_ },
      task: { task: sortDir_ },
    };

    const tasks = await Task.find(filter)
      .populate("category", "name color icon")
      .sort(sortMap[sortBy] || { order: 1 });

    res.json({ success: true, data: tasks, total: tasks.length });
  } catch (err) { next(err); }
};

// GET /api/tasks/stats
const getStats = async (req, res, next) => {
  try {
    const [total, completed, overdue, byPriority, byCategory, recentlyAdded] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ completed: true }),
      Task.countDocuments({ completed: false, dueDate: { $lt: new Date() } }),
      Task.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
      Task.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
      Task.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
    ]);

    res.json({
      success: true,
      data: {
        total, completed,
        pending: total - completed,
        overdue, recentlyAdded,
        byPriority: byPriority.reduce((a, p) => ({ ...a, [p._id]: p.count }), {}),
        byCategory: byCategory.reduce((a, c) => ({ ...a, [c._id || "uncategorized"]: c.count }), {}),
      },
    });
  } catch (err) { next(err); }
};

// POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { task, priority, dueDate, tags, notes, category } = req.body;
    const maxOrder = await Task.findOne().sort({ order: -1 }).select("order");
    const newTask = await Task.create({
      task: task.trim(), priority: priority || "medium",
      dueDate: dueDate || null,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : []),
      notes: notes || "",
      category: category || null,
      order: (maxOrder?.order ?? -1) + 1,
    });
    const populated = await newTask.populate("category", "name color icon");
    res.status(201).json({ success: true, data: populated, message: "Task created" });
  } catch (err) { next(err); }
};

// PUT /api/tasks/reorder
const reorderTasks = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) return res.status(400).json({ success: false, message: "orderedIds must be an array" });
    await Task.bulkWrite(orderedIds.map((id, i) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: i } } },
    })));
    res.json({ success: true, message: "Reordered" });
  } catch (err) { next(err); }
};

// PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { task, completed, priority, dueDate, tags, notes, category } = req.body;
    if (task !== undefined && task.trim().length < 10)
      return res.status(400).json({ success: false, message: "Task must be at least 10 characters" });

    const updates = {};
    if (task !== undefined) updates.task = task.trim();
    if (completed !== undefined) updates.completed = completed;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate || null;
    if (tags !== undefined) updates.tags = Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim()).filter(Boolean);
    if (notes !== undefined) updates.notes = notes;
    if (category !== undefined) updates.category = category || null;

    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate("category", "name color icon");
    if (!updated) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, data: updated, message: "Task updated" });
  } catch (err) { next(err); }
};

// DELETE /api/tasks/completed
const deleteCompleted = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({ completed: true });
    res.json({ success: true, message: `Deleted ${result.deletedCount} completed tasks` });
  } catch (err) { next(err); }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Task not found" });
    res.json({ success: true, message: "Task deleted" });
  } catch (err) { next(err); }
};

// GET /api/tasks/export
const exportTasks = async (req, res, next) => {
  try {
    const { format = "json" } = req.query;
    const tasks = await Task.find().populate("category", "name").lean();

    if (format === "csv") {
      const headers = ["ID", "Task", "Priority", "Status", "Category", "Tags", "Due Date", "Notes", "Created At"];
      const rows = tasks.map(t => [
        t._id, `"${t.task.replace(/"/g, '""')}"`, t.priority,
        t.completed ? "completed" : "pending",
        t.category?.name || "",
        t.tags.join(";"),
        t.dueDate ? new Date(t.dueDate).toISOString().split("T")[0] : "",
        `"${(t.notes || "").replace(/"/g, '""')}"`,
        new Date(t.createdAt).toISOString(),
      ]);
      const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=tasks.csv");
      return res.send(csv);
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=tasks.json");
    res.json({ exported_at: new Date().toISOString(), count: tasks.length, tasks });
  } catch (err) { next(err); }
};

module.exports = { getAllTasks, getStats, createTask, updateTask, reorderTasks, deleteTask, deleteCompleted, exportTasks };
