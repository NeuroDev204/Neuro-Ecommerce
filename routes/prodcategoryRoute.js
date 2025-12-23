const express = require("express");
const route = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createCategory,
  getAllProdCategory,
  updateProdCategory,
  getProdCategory,
  deleteProdCategory,
} = require("../controller/prodcategoryController");
route.get("/:id", getProdCategory);

route.get("/", getAllProdCategory);
route.put("/:id", authMiddleware, isAdmin, updateProdCategory);
route.delete("/:id", authMiddleware, isAdmin, deleteProdCategory);
route.post("/", authMiddleware, isAdmin, createCategory);

module.exports = route;
