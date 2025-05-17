import productTable from "./product.model.js";
export const isOwnerofProduct = async (req, res, next) => {
  const productId = req.params.id;
  const product = await productTable.findOne({ _id: productId });
  if (!product) {
    return res.status(404).send({ message: "Product does not exists" });
  }
  const isOwner = product.sellerId?.equals(req.loggedInUser);
  if (!isOwner) {
    return res
      .status(200)
      .send({ message: "You have no access to this resource" });
  }
  next();
};
