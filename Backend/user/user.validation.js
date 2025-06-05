import * as yup from "yup";
import dayjs from "dayjs";
export const loginCredentialsSchema = yup.object({
  email: yup.string().email().required().lowercase().trim(),
  password: yup.string().required().trim(),
});

export const registerUserSchema = yup.object({
  email: yup.string().email().required().lowercase().trim().max(100),
  password: yup.string().required().trim().min(8).max(30),
  firstName: yup.string().required().trim().max(50),
  lastName: yup.string().required().trim().max(50),
  gender: yup
    .string()
    .lowercase()
    .required()
    .trim()
    .oneOf(["male", "female", "other"]),
  dob: yup.date().max(dayjs()).notRequired(),
  role: yup.string().lowercase().required().trim().oneOf(["seller", "buyer"]),
  address: yup.string().required().trim().max(255),
});
export const updateUserSchema = yup.object({
  firstName: yup.string().required().trim().max(50),
  lastName: yup.string().required().trim().max(50),
  gender: yup
    .string()
    .lowercase()
    .required()
    .trim()
    .oneOf(["male", "female", "other"]),
  dob: yup.date().max(dayjs()).notRequired(),
  address: yup.string().required().trim().max(255),
});
