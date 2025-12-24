const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

// Create a new coupon
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json({ newCoupon });
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single coupon
const getCoupon = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const findCoupon = await Coupon.findById(id);
    if (!findCoupon) throw new Error("Coupon not found!");
    res.json({ findCoupon });
  } catch (error) {
    throw new Error(error);
  }
});

// Get all coupons
const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find().sort("-createdAt");
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

// Update coupon
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    validateMongodbId(id);
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedCoupon) throw new Error("Coupon not found!");
    res.json({ updatedCoupon });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    validateMongodbId(id);
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) throw new Error("Coupon not found!");
    res.json({ deletedCoupon });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon,
  getCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
};
