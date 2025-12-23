const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandle = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

const createBlog = asyncHandle(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json({
      newBlog,
    });
  } catch (error) {}
});
const updateBlog = asyncHandle(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedBlog) throw new Error("Blog not found");
    res.json({ updatedBlog });
  } catch (error) {
    throw new Error(error);
  }
});
const getABlog = asyncHandle(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const blog = await Blog.findById(id).populate("likes").populate("dislikes");
    const updatedViews = await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );
    if (!blog) throw new Error("Blog not found");
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});
const deleteABlog = asyncHandle(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) throw new Error("Blog not found");
    res.json({ deletedBlog });
  } catch (error) {
    throw new Error(error);
  }
});
const getAllBlogs = asyncHandle(async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});
const likeBlog = asyncHandle(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);
  try {
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;
    const isLiked = blog?.isLiked;
    const alreadyDisliked = blog?.dislikes?.find(
      (userId) => userId.toString() === loginUserId.toString()
    );
    if (alreadyDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
});
const disLikeBlog = asyncHandle(async (req, res) => {
  const { blogId } = req.body;
  validateMongodbId(blogId);
  try {
    const blog = await Blog.findById(blogId);
    const loginUserId = req?.user?._id;
    const isDisliked = blog?.isDisliked;
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId.toString() === loginUserId.toString()
    );
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isDisliked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { dislikes: loginUserId },
          isDisliked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBlog,
  updateBlog,
  getABlog,
  deleteABlog,
  getAllBlogs,
  likeBlog,
  disLikeBlog,
};
