import dayjs from "dayjs";
import * as yup from "yup";
export const RegisterFormSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .trim()
    .email("Invalid email format")
    .max(100),
  password: yup
    .string()
    .required("Password is required")
    .trim()
    .min(4, "Password must be at least 4 characters"),
  firstName: yup.string().required("First Name is required").trim().max(100),
  lastName: yup.string().required("Last Name is required").trim().max(100),
  gender: yup
    .string()
    .lowercase()
    .required("Gender is required")
    .trim()
    .oneOf(["male", "female", "other"]),
  dob: yup
    .date()
    .max(dayjs().toDate(), "Date of birth cannot be in the future")
    .nullable(),
  role: yup
    .string()
    .lowercase()
    .required("Role is required")
    .trim()
    .oneOf(["seller", "buyer"]),
  address: yup.string().required("Address is required").trim().max(255),
});
