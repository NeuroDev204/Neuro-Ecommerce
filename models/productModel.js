const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    descript: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
      select: false,
    },
    image: [],
    color: [],
    tags:[],
    brand: {
      type: String,
      require: true,
    },
    sold: {
      type: Number,
      default: 0,
      select: false,
    },
    ratings: [
      {
        star: Number,
        comment: {
          type: String,
        },
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    totalRating: {
      type: String,

      default: 0,
    },
  },

  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
