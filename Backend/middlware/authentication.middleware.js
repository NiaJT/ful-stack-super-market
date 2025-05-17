import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import UserTable from "../user/user.model.js";

const SECRET_KEY = "jfkasdhfkja"; // Move secret key to a constant

export const isSeller = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .send({ message: "Unauthorized: No token provided" });

    const payload = jwt.verify(token, SECRET_KEY);
    const user = await UserTable.findOne({ email: payload.email });

    if (!user)
      return res.status(401).send({ message: "Unauthorized: User not found" });
    if (user.role !== "seller")
      return res.status(403).send({ message: "Forbidden: Not a seller" });

    req.loggedInUser = user._id;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized: Invalid token" });
  }
};

export const isBuyer = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .send({ message: "Unauthorized: No token provided" });

    const payload = jwt.verify(token, SECRET_KEY);
    const user = await UserTable.findOne({ email: payload.email });

    if (!user)
      return res.status(401).send({ message: "Unauthorized: User not found" });
    if (user.role !== "buyer")
      return res.status(403).send({ message: "Forbidden: Not a buyer" });

    req.loggedInUser = user._id;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized: Invalid token" });
  }
};

export const isUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .send({ message: "Unauthorized: No token provided" });

    const payload = jwt.verify(token, SECRET_KEY);
    const user = await UserTable.findOne({ email: payload.email });

    if (!user)
      return res.status(401).send({ message: "Unauthorized: User not found" });

    req.loggedInUser = user._id;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized: Invalid token" });
  }
};
