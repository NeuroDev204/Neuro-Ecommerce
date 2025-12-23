const ProdCategory = require("../models/prodcategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await ProdCategory.create(req.body);
    res.json({ newCategory });
  } catch (error) {
    throw new Error(error);
  }
});
const updateProdCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const prodCategory = await ProdCategory.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!prodCategory) throw new Error("Product Category not found");
    res.json(prodCategory);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllProdCategory = asyncHandler(async (req, res) => {
  try {
    const prodCategories = await ProdCategory.find();
    res.json(prodCategories);
  } catch (error) {
    throw new Error(error);
  }
});
const getProdCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const prodCategory = await ProdCategory.findById(id);
    if (!prodCategory) throw new Error("Product Category not found");
    res.json({ prodCategory });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteProdCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const prodCategory = await ProdCategory.findByIdAndDelete(id);
    if (!prodCategory) throw new Error("Product Category not found");
    res.json({ prodCategory });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createCategory,
  updateProdCategory,
  getAllProdCategory,
  getProdCategory,
  deleteProdCategory,
};
