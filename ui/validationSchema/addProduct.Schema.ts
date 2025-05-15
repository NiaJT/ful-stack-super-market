import { productCategories } from "@/constants/general.constant";
import * as yup from "yup";

export const productSchema = yup.object({
  name: yup
    .string()
    .required("Product name is required.")
    .trim()
    .max(50, "Product name cannot exceed 50 characters."),

  brand: yup
    .string()
    .required("Brand name is required.")
    .trim()
    .max(50, "Brand name cannot exceed 50 characters."),

  price: yup
    .number()
    .required("Price is required.")
    .min(0, "Price cannot be negative."),

  quantity: yup
    .number()
    .required("Quantity is required.")
    .min(1, "Quantity must be at least 1.")
    .integer("Quantity must be a whole number."),

  category: yup
    .string()
    .required("Category is required.")
    .trim()
    .oneOf(productCategories, "Invalid category selected."),

  freeShipping: yup.boolean().notRequired().default(false),

  description: yup
    .string()
    .required("Description is required.")
    .trim()
    .min(10, "Description must be at least 10 characters long.")
    .max(1000, "Description cannot exceed 1000 characters."),
});
