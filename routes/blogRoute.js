const express = require("express");
const {
  createBlog,
  updateBlog,
  getABlog,
  deleteABlog,
  getAllBlogs,
  likeBlog,
  disLikeBlog,
  uploadBlogImage,
} = require("../controller/blogController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { uploadBlogPhoto } = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBlog);
router.put(
  "/upload/:id",
  authMiddleware,
  isAdmin,
  uploadBlogPhoto.array("images", 10),
  uploadBlogImage
);
router.put("/likes", authMiddleware, isAdmin, likeBlog);
router.put("/dislikes", authMiddleware, isAdmin, disLikeBlog);

router.put("/:id", authMiddleware, isAdmin, updateBlog);
router.get("/:id", getABlog);
router.delete("/:id", authMiddleware, isAdmin, deleteABlog);
router.get("/", getAllBlogs);
module.exports = router;
