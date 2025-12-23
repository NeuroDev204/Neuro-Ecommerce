const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");
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

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  createManyProducts,
};
