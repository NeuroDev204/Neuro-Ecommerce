const express = require("express");
const route = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBlogCategory,
  getAllBlogCategory,
  updateBlogCategory,
  getBlogCategory,
  deleteBlogCategory,
} = require("../controller/blogCategoryController");
route.get("/:id", getBlogCategory);
route.get("/", getAllBlogCategory);
route.put("/:id", authMiddleware, isAdmin, updateBlogCategory);
route.delete("/:id", authMiddleware, isAdmin, deleteBlogCategory);
route.post("/", authMiddleware, isAdmin, createBlogCategory);

module.exports = route;
