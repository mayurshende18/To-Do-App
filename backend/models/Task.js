const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: [true, "Task is required"],
      minlength: [10, "Task must be at least 10 characters long"],
      trim: true,
    },
    completed: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: { type: Date, default: null },
    order: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    notes: { type: String, default: "", maxlength: 500 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true }
);

// Text index for search
taskSchema.index({ task: "text", tags: "text", notes: "text" });

module.exports = mongoose.model("Task", taskSchema);
