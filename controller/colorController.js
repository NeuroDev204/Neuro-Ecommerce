const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.json({ newColor });
  } catch (error) {
    throw new Error(error);
  }
});
const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const color = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!color) throw new Error("Color not found");
    res.json(color);
  } catch (error) {
    throw new Error(error);
  }
});
const getAllColor = asyncHandler(async (req, res) => {
  try {
    const color = await Color.find();
    res.json(color);
  } catch (error) {
    throw new Error(error);
  }
});
const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const color = await Color.findById(id);
    if (!color) throw new Error("Color not found");
    res.json({ color });
  } catch (error) {
    throw new Error(error);
  }
});
const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const color = await Color.findByIdAndDelete(id);
    if (!color) throw new Error("Color not found");
    res.json({ color });
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createColor,
  updateColor,
  getAllColor,
  getColor,
  deleteColor,
};
