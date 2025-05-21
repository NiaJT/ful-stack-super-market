import express from "express";
import { isBuyer } from "../middlware/authentication.middleware.js";
import { validMongoId } from "../middlware/valid.mongoid.js";
import validateReqbody from "../middlware/validatereqbody.js";
import { addItemtoCartSchema } from "./cart.validation.js";
import mongoose from "mongoose";
import productTable from "../product/product.model.js";
import CartTable from "./cart.model.js";
import { isOwnerofProduct } from "./../product/product.middleware.js";
const router = express.Router();
router.post(
  "/cart/item/add",
  isBuyer,
  validateReqbody(addItemtoCartSchema),
  (req, res, next) => {
    const productId = req.body.productId;
    const validId = mongoose.isValidObjectId(productId);
    if (!validId) {
      return res.status(409).send({ message: "Invalid id" });
    }
    next();
  },
  async (req, res) => {
    const productId = req.body.productId;
    const orderedQuantity = req.body.orderedQuantity;
    const buyerId = req.loggedInUser;
    const product = await productTable.findOne({ _id: productId });
    const cartExists = await CartTable.findOne({ productId,buyerId });
    if (cartExists) {
      return res.status(409).send({
        message: "Product already in cart. Update quantity in the cart",
      });
    }
    if (!product) {
      return res.status(404).send({ message: "Product does not exist" });
    }

    if (orderedQuantity > product.quantity) {
      return res.status(409).send({
        message: "Order quantity should not be more than product quantity",
      });
    }
    await CartTable.create({ buyerId, productId, orderedQuantity });
    return res.status(200).send({ message: "Added Item to Cart Successfully" });
  }
);
router.delete(
  "/cart/item/delete/:id",
  isBuyer,
  validMongoId,
  async (req, res) => {
    const cartId = req.params.id;
    const cart = await CartTable.findById(cartId);
    if (!cart) {
      return res.status(404).send({ message: "Cart does not exist" });
    }
    const isOwnerofCart = cart.buyerId.equals(req.loggedInUser);
    if (!isOwnerofCart) {
      return res
        .status(409)
        .send({ message: "You cannot access this resource" });
    }
    await CartTable.deleteOne({ _id: cartId });
    return res.status(200).send({ message: "Cart item deleted Successfully" });
  }
);
router.delete("/cart/flush", isBuyer, async (req, res) => {
  const userId = req.loggedInUser;
  await CartTable.deleteMany({ buyerId: userId });
  return res.status(200).send({ message: "Cart Flushed Successfully" });
});
//cart list
router.get("/cart/list", isBuyer, async (req, res) => {
  const userId = req.loggedInUser;
  const CartList = await CartTable.aggregate([
    { $match: { buyerId: userId } },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "productDetail",
      },
    },
    {
      $project: {
        orderedQuantity: 1,
        product: {
          name: { $first: "$productDetail.name" },
          price: { $first: "$productDetail.price" },
          quantity: { $first: "$productDetail.quantity" },
          category: { $first: "$productDetail.category" },
          brand: { $first: "$productDetail.brand" },
          totalQuantity: { $first: "$productDetail.quantity" },
        },
      },
    },
  ]);
  return res.status(200).send({ message: "Success", CartList });
});
export { router as cartController };
