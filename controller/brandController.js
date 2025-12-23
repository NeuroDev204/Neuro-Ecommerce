const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.json({ newBrand });
  } catch (error) {
    throw new Error(error);
  }
});
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!brand) throw new Error("Brand not found");
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBrand = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (error) {
    throw new Error(error);
  }
});
const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const brand = await Brand.findById(id);
    if (!brand) throw new Error("Brand not found");
    res.json({ brand });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) throw new Error("Brand not found");
    res.json({ brand });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBrand,
  updateBrand,
  getAllBrand,
  getBrand,
  deleteBrand,
};
