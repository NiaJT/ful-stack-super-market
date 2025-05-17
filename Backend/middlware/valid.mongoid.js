import mongoose from "mongoose";
export const validMongoId = (req, res, next) => {
  const id = req.params.id;
  const validId = mongoose.isValidObjectId(id);
  if (!validId) {
    return res.status(400).send({ message: "Not a valid mongoID" });
  }
  next();
};
