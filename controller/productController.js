const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
const { Stream } = require("nodemailer/lib/xoauth2");
const { cloudinaryUploadFromBuffer, cloudinaryDeleteImg } = require("../utils/cloudinary");
const slugify = require("slugify").default;
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json({ newProduct });
  } catch (error) {
    throw new Error(error);
  }
});

// get a single product
const getProduct = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateMongodbId(id);
    const findProduct = await Product.findById(id);
    res.json({
      findProduct,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//get products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    //filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Product.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      // @ts-ignore
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //limit the fields
    if (req.query.fields) {
      // @ts-ignore
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //pagination
    const page = req.query.page;
    const limit = req.query.limit;
    // @ts-ignore
    const skip = (page - 1) * limit;
    // @ts-ignore
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error("This Page does not exists");
    }
    console.log(page, limit, skip);

    const product = await query;
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});
//update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    validateMongodbId(id);
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct) throw new Error("Product not found!");
    res.json({ updatedProduct });
  } catch (error) {
    throw new Error(error);
  }
});
//delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    validateMongodbId(id);
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) throw new Error("Product not found!");
    res.json({ deletedProduct });
  } catch (error) {
    throw new Error(error);
  }
});

//create many products
const createManyProducts = asyncHandler(async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      throw new Error("Request body must be an array of products");
    }
    const products = req.body.map((product) => {
      if (product.title) {
        product.slug = slugify(product.title);
      }
      return product;
    });
    const newProducts = await Product.insertMany(products);
    res.json({ newProducts });
  } catch (error) {
    throw new Error(error);
  }
});
const addToWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { productId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find(
      (id) => id.toString() === productId
    );
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: productId },
        },
        { new: true }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: productId },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, productId, comment } = req.body;

  try {
    const product = await Product.findById(productId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedBy.toString === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
      res.json(updateRating);
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: _id,
            },
          },
        },
        { new: true }
      );
    }
    const getAllRatings = await Product.findById(productId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingSum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(
      productId,
      {
        totalRating: actualRating,
      },
      { new: true }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});
const uploadImages = asyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const images = [];
    for (const file of req.files) {
      try {
        // Use file.buffer since multer uses memory storage
        const result = await cloudinaryUploadFromBuffer(file.buffer);
        images.push({
          url: result.url,
          asset_id: result.asset_id,
          public_id: result.public_id,
        });
      } catch (uploadError) {
        throw uploadError;
      }
    }
    res.json(images);
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

const deleteImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const result = await cloudinaryDeleteImg(id);
    res.json({ message: "Image deleted successfully", result });
  } catch (error) {
    throw error instanceof Error ? error : new Error(String(error));
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  createManyProducts,
  addToWishlist,
  rating,
  uploadImages,
  deleteImage,
};
