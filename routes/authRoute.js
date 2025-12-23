const express = require("express");
const {
  createUser,
  loginUser,
  getAllUser,
  getUser,
  deleteUser,
  updatedUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} = require("../controller/userController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);

router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.put("/password", authMiddleware, updatePassword);
router.get("/all-users", getAllUser);
router.get("/:id", authMiddleware, isAdmin, getUser);
router.delete("/:id", deleteUser);
router.put("/:id", updatedUser);

module.exports = router;
