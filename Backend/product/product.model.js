import mongoose from "mongoose";
import UserTable from "../user/user.model.js";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 255 },
  brand: { type: String, required: true, trim: true, maxlength: 255 },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: [
      "grocery",
      "clothing",
      "kids",
      "kitchen",
      "electronics",
      "furniture",
      "electrical",
      "sports",
    ],
  },
  image: { type: String, default: null }, // Removed nullable
  freeShipping: { type: Boolean, default: false }, // Added default value
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000,
  },
  sellerId: {
    type: mongoose.ObjectId,
    ref: "UserTable",
    required: true,
  }, // Ensure correct reference
});

const productTable = mongoose.model("Product", productSchema);
export default productTable;
