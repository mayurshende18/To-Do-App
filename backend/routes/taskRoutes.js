const express = require("express");
const router = express.Router();
const validate = require("../middleware/validate");
const {
  getAllTasks, getStats, createTask, updateTask,
  reorderTasks, deleteTask, deleteCompleted, exportTasks,
} = require("../controllers/taskController");

router.get("/export", exportTasks);
router.get("/stats", getStats);
router.get("/", getAllTasks);
router.post("/", validate([{ field: "task", required: true, minLength: 10 }]), createTask);
router.put("/reorder", reorderTasks);
router.put("/:id", updateTask);
router.delete("/completed", deleteCompleted);
router.delete("/:id", deleteTask);

module.exports = router;
