const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [30, "Name must be under 30 characters"],
    },
    color: {
      type: String,
      default: "#6272f5",
      match: [/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"],
    },
    icon: {
      type: String,
      default: "📁",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
