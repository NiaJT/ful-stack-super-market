import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
    maxlength: 255,
    unique: true,
  },
  password: { type: String, required: true, trim: true },
  firstName: { type: String, required: true, trim: true, maxlength: 255 },
  lastName: { type: String, required: true, trim: true, maxlength: 255 },
  dob: { type: Date, max: Date.now() },
  gender: { type: String, required: true, enum: ["male", "female", "other"] },
  role: { type: String, required: true, enum: ["buyer", "seller"] },
  address: { type: String, required: true, trim: true, maxlength: 255 },
});
const UserTable = mongoose.model("User", userSchema);
export default UserTable;
