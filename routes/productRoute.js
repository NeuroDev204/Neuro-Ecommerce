const express = require("express");
const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  createManyProducts,
  addToWishlist,
  rating,
  uploadImages,
} = require("../controller/productController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadPhoto } = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadPhoto.array("images", 10),
  uploadImages
);
router.get("/:id", getProduct);
router.get("/", getAllProducts);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.post("/many", authMiddleware, isAdmin, createManyProducts);

module.exports = router;
