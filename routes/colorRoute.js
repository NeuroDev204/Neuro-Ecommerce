const express = require("express");
const route = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createColor,
  getAllColor,
  updateColor,
  getColor,
  deleteColor,
} = require("../controller/colorController");
route.get("/:id", getColor);

route.get("/", getAllColor);
route.put("/:id", authMiddleware, isAdmin, updateColor);
route.delete("/:id", authMiddleware, isAdmin, deleteColor);
route.post("/", authMiddleware, isAdmin, createColor);

module.exports = route;
