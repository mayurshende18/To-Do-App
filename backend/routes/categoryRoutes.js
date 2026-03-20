const express = require("express");
const router = express.Router();
const { getAllCategories, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const validate = require("../middleware/validate");

router.get("/", getAllCategories);
router.post("/", validate([{ field: "name", required: true, minLength: 2 }]), createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
