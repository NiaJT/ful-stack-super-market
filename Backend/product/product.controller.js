import express from "express";
import yup from "yup";
import { productSchema } from "./product.validation.js";
import productTable from "./product.model.js";
import { validMongoId } from "../middlware/valid.mongoid.js";
import {
  isSeller,
  isBuyer,
  isUser,
} from "../middlware/authentication.middleware.js";
import validateReqbody from "../middlware/validatereqbody.js";
import { paginationSchema } from "./product.validation.js";
import { isOwnerofProduct } from "./product.middleware.js";
const router = express.Router();
//get product by id
router.get(
  "/product/detail/:id",
  isUser,
  validMongoId,
  async (req, res, next) => {
    let productDetails = await productTable.findOne({ _id: req.params.id });
    if (!productDetails) {
      return res.status(400).send({ message: "Product not found" });
    }

    return res.status(200).send({ message: "Product found", productDetails });
  }
);
//product list for seller
router.post(
  "/product/seller/list",
  isSeller,
  validateReqbody(paginationSchema),
  async (req, res, next) => {
    const page = req.body.page;
    const limit = req.body.limit;
    const skip = (page - 1) * limit;
    const totalItems = await productTable
      .find({ sellerId: req.loggedInUser })
      .countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const products = await productTable.aggregate([
      { $match: { sellerId: req.loggedInUser } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          seller_id: 1,
          _id: 1,
          name: 1,
          brand: 1,
          price: 1,
          quantity: 1,
          image: 1,
          shortDescription: { $substr: ["$description", 0, 150] },
        },
      },
    ]);
    res.status(200).send({
      message: "product list",
      productList: products,
      totalPages: totalPages,
    });
  }
);
//product list for buyer
router.post(
  "/product/buyer/list",
  isBuyer,
  validateReqbody(paginationSchema),
  async (req, res, next) => {
    const page = req.body.page;
    const limit = req.body.limit;
    const skip = (page - 1) * limit;
    const totalItems = await productTable.find().countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const products = await productTable.aggregate([
      { $match: {} },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          seller_id: 1,
          _id: 1,
          name: 1,
          brand: 1,
          price: 1,
          quantity: 1,
          image: 1,
          shortDescription: { $substr: ["$description", 0, 150] },
        },
      },
    ]);
    res.status(200).send({
      message: "product list",
      productList: products,
      totalPages: totalPages,
    });
  }
);
router.post(
  "/product/buyer/sortlist",
  isBuyer,
  validateReqbody(paginationSchema),
  async (req, res, next) => {
    console.log(req.body);
    const page = req.body.page;
    const limit = req.body.limit;
    const category = req.body.category.toLowerCase();
    const sortby = req.body.sortby;
    let sortField = "name";
    let sortValue = 1;
    const matchStage = category ? { category } : {};

    switch (sortby) {
      case "A-Z":
        sortField = "name";
        sortValue = 1;
        break;
      case "Z-A":
        sortField = "name";
        sortValue = -1;
        break;
      case "Price: Low to High":
        sortField = "price";
        sortValue = 1;
        break;
      case "Price: High to Low":
        sortField = "price";
        sortValue = -1;
        break;

      default:
        sortField = "name";
        sortValue = 1;
    }

    const skip = (page - 1) * limit;
    const totalItems = await productTable.countDocuments(matchStage);
    console.log(totalItems);
    const totalPages = Math.ceil(totalItems / limit);
    const products = await productTable.aggregate([
      { $match: matchStage },
      { $sort: { [sortField]: sortValue } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          seller_id: 1,
          _id: 1,
          name: 1,
          brand: 1,
          price: 1,
          quantity: 1,
          image: 1,
          shortDescription: { $substr: ["$description", 0, 150] },
        },
      },
    ]);
    res.status(200).send({
      message: "product list",
      productList: products,
      totalPages: totalPages,
    });
  }
);
router.post("/product/search", isUser, async (req, res) => {
  try {
    const keyword = req.body.search?.trim();
    if (!keyword) {
      return res.status(400).send({ message: "Search keyword is required" });
    }

    if (keyword.length < 2) {
      return res.status(400).send({ message: "Keyword too short" });
    }

    function escapeRegex(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    const escapedKeyword = escapeRegex(keyword);
    let products = [];

    if (isBuyer) {
      products = await productTable.aggregate([
        { $match: { name: { $regex: escapedKeyword, $options: "i" } } },
        { $limit: 5 },
        { $project: { seller_id: 1, _id: 1, name: 1 } },
      ]);
    } else if (isSeller) {
      products = await productTable.aggregate([
        {
          $match: {
            name: { $regex: escapedKeyword, $options: "i" },
            sellerId: req.loggedInUser,
          },
        },
        { $limit: 5 },
        { $project: { seller_id: 1, _id: 1, name: 1 } },
      ]);
    } else {
      return res.status(403).send({ message: "Unauthorized role" });
    }

    if (!products.length) {
      return res
        .status(200)
        .send({ message: "No products found", products: [] });
    }

    return res.status(200).send({
      message: "Search results",
      products,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).send({ message: "Internal Server Error", error });
  }
});

//add product by seller
router.post(
  "/product/add",
  isSeller,
  validateReqbody(productSchema),
  async (req, res) => {
    try {
      const newProduct = req.body;
      const sellerId = req.loggedInUser;

      if (!sellerId)
        return res.status(400).send({ message: "Seller ID is required" });

      await productTable.create({ ...newProduct, sellerId });
      return res
        .status(200)
        .send({ message: "Product has been added Successfully" });
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error", error });
    }
  }
);
//delete product by id by seller
router.delete(
  "/product/delete/:id",
  isSeller,
  validMongoId,
  isOwnerofProduct,
  async (req, res) => {
    await productTable.deleteOne({ _id: req.params.id });
    return res.status(200).send({ message: "Deleted product Successfully" });
  }
);
router.post(
  "/product/buyer/category-list/:category",
  isBuyer,
  validateReqbody(paginationSchema),
  async (req, res, next) => {
    const page = req.body.page;
    const limit = req.body.limit;
    const skip = (page - 1) * limit;
    const totalItems = await productTable
      .find({ category: req.params.category })
      .countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const products = await productTable.aggregate([
      { $match: { category: req.params.category } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          seller_id: 1,
          _id: 1,
          name: 1,
          brand: 1,
          price: 1,
          quantity: 1,
          category: 1,
          image: 1,
          shortDescription: { $substr: ["$description", 0, 150] },
        },
      },
    ]);
    res.status(200).send({
      message: "product list",
      productList: products,
      totalPages: totalPages,
    });
  }
);
router.put(
  "/product/edit/:id",
  isSeller,
  validMongoId,
  isOwnerofProduct,
  validateReqbody(productSchema),
  async (req, res) => {
    const productId = req.params.id;
    const newProduct = req.body;
    await productTable.updateOne(
      { _id: productId },
      {
        $set: {
          ...newProduct,
        },
      }
    );
    return res
      .status(200)
      .send({ message: "Product has been updated Successfully" });
  }
);
export { router as productController };
