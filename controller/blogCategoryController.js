const BlogCategory = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createBlogCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await BlogCategory.create(req.body);
    res.json({ newCategory });
  } catch (error) {
    throw new Error(error);
  }
});
const updateBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blogCategory = await BlogCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!blogCategory) throw new Error("Product Category not found");
    res.json(blogCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBlogCategory = asyncHandler(async (req, res) => {
  try {
    const blogCategories = await BlogCategory.find();
    res.json(blogCategories);
  } catch (error) {
    throw new Error(error);
  }
});
const getBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blogCategory = await BlogCategory.findById(id);
    if (!blogCategory) throw new Error("Product Category not found");
    res.json({ blogCategory });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blogCategory = await BlogCategory.findByIdAndDelete(id);
    if (!blogCategory) throw new Error("Product Category not found");
    res.json({ blogCategory });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBlogCategory,
  updateBlogCategory,
  getAllBlogCategory,
  getBlogCategory,
  deleteBlogCategory,
};
