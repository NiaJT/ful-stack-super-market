import CartTable from "./cart.model.js";

export const cartCount = async (req, res) => {
  const userId = req.loggedInUser;
  const cartCount = await CartTable.find({ buyerId: userId }).countDocuments();
  return res.status(200).send({ message: "Success", cartCount });
};
