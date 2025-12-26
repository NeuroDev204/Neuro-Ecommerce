const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// Use memory storage - files stored in buffer, not on disk
const memoryStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const uploadPhoto = multer({
  storage: memoryStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5000000 }, // 5MB limit
});

const uploadBlogPhoto = multer({
  storage: memoryStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 5000000 }, // 5MB limit
});

const productImgResizze = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quantity: 90 })
        .toFile(`public/images/products/${file.filename}`);
    })
  );
  next();
};
const blogImgResizze = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
    req.files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quantity: 90 })
        .toFile(`public/images/blogs/${file.filename}`);
    })
  );
  next();
};
module.exports = { uploadPhoto, uploadBlogPhoto, productImgResizze, blogImgResizze };
