import * as yup from "yup";

export const userLoginSchema = yup.object({
  email: yup
    .string()
    .required("Email is a required field")
    .trim()
    .email("Must be a valid email")
    .max(100),
  password: yup
    .string()
    .required("Password is a required field")
    .trim()
    .min(4, "Must be atleast 4 characters"),
});
