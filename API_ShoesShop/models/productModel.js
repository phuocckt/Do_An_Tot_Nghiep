const mongoose = require("mongoose");

// Định nghĩa schema con cho ratings
const ratingSchema = new mongoose.Schema(
  {
    star: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
    postedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

// Định nghĩa schema chính cho product
const productSchema = new mongoose.Schema(
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
    description: {
      type: String,
    },
    priceOld: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    image: [
      {
        public_id: String,
        url: String,
      },
    ],
    variants: [
      {
        size: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Size",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    ratings: [ratingSchema], // Sử dụng schema con
    totalrating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt cho product
  }
);

module.exports = mongoose.model("Product", productSchema);
