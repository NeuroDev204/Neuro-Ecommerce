const express = require("express");
const route = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createBrand,
  getAllBrand,
  updateBrand,
  getBrand,
  deleteBrand,
} = require("../controller/brandController");
route.get("/:id", getBrand);

route.get("/", getAllBrand);
route.put("/:id", authMiddleware, isAdmin, updateBrand);
route.delete("/:id", authMiddleware, isAdmin, deleteBrand);
route.post("/", authMiddleware, isAdmin, createBrand);

module.exports = route;
