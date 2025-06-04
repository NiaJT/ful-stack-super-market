import express from "express";
import mongoose from "mongoose";
import UserTable from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginCredentialsSchema, updateUserSchema } from "./user.validation.js";
import yup from "yup";
import { registerUserSchema } from "./user.validation.js";
const router = express.Router();
import validateReqbody from "../middlware/validatereqbody.js";
import { isUser } from "./../middlware/authentication.middleware.js";

router.post(
  "/user/register",
  validateReqbody(registerUserSchema),
  async (req, res) => {
    const newUser = req.body;

    const user = await UserTable.findOne({ email: newUser.email });
    if (user) return res.status(409).send({ message: "User already exists" });

    const hashSalt = 10;
    const hashedPassword = await bcrypt.hash(newUser.password, hashSalt);
    newUser.password = hashedPassword;
    await UserTable.create(newUser);

    return res.status(200).send({ message: "User added Successfully" });
  }
);
router.post(
  "/user/login",
  validateReqbody(loginCredentialsSchema),
  async (req, res) => {
    const loginCredentials = req.body;
    const user = await UserTable.findOne({ email: loginCredentials.email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
    const plainPassword = loginCredentials.password;
    const hashedPassword = user.password;
    const isPasswordmatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isPasswordmatch) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }
    //generate token
    //payload object inside token
    const payload = { email: user.email };
    const secretKey = "jfkasdhfkja";
    const token = jwt.sign(payload, secretKey, {
      expiresIn: "7d",
    });
    user.password = undefined;
    return res
      .status(200)
      .send({ message: "Success", accessToken: token, userDetails: user });
  }
);
router.post(
  "/user/update",
  isUser,
  validateReqbody(updateUserSchema),
  async (req, res) => {
    try {
      const userId = req.loggedInUser;

      // Extract allowed keys from Yup schema
      const allowedFields = Object.keys(updateUserSchema.fields);
      const updateData = {};

      // Build updateData with only allowed fields
      for (let key of allowedFields) {
        if (req.body[key] !== undefined) {
          updateData[key] = req.body[key];
        }
      }

      const updatedUser = await UserTable.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send({ message: "User not found" });
      }

      return res
        .status(200)
        .send({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }
);

export { router as userController };
