const Category = require("../models/Category");
const Task = require("../models/Task");

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: 1 });
    // Attach task counts
    const counts = await Task.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const countMap = counts.reduce((m, c) => ({ ...m, [c._id]: c.count }), {});
    const data = categories.map(c => ({ ...c.toObject(), taskCount: countMap[c._id] || 0 }));
    res.json({ success: true, data });
  } catch (err) { next(err); }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, color, icon } = req.body;
    const cat = await Category.create({ name, color, icon });
    res.status(201).json({ success: true, data: cat, message: "Category created" });
  } catch (err) { next(err); }
};

const updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, data: cat, message: "Category updated" });
  } catch (err) { next(err); }
};

const deleteCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ success: false, message: "Category not found" });
    // Unlink tasks
    await Task.updateMany({ category: req.params.id }, { $set: { category: null } });
    res.json({ success: true, message: "Category deleted, tasks unlinked" });
  } catch (err) { next(err); }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
