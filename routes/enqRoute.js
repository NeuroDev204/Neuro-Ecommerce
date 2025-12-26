const express = require("express");
const route = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createEnquiry,
  getAllEnquiry,
  updateEnquiry,
  getEnquiry,
  deleteEnquiry,
} = require("../controller/enqControler");
route.get("/:id", getEnquiry);

route.get("/", getAllEnquiry);
route.put("/:id", authMiddleware, isAdmin, updateEnquiry);
route.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);
route.post("/", createEnquiry);

module.exports = route;
