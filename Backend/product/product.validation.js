import yup, { number } from "yup";
export const productSchema = yup.object({
  name: yup.string().required().trim().max(50),
  brand: yup.string().required().trim().max(50),
  price: yup.number().required().min(0),
  quantity: yup.number().required().min(1).integer(),
  category: yup
    .string()
    .required()
    .trim()
    .oneOf([
      "grocery",
      "clothing",
      "kids",
      "kitchen",
      "electronics",
      "furniture",
      "electrical",
      "sports",
    ]),
  freeShipping: yup.boolean().notRequired().default(false),
  description: yup.string().required().trim().min(10).max(1000),
});
export const paginationSchema = yup.object({
  page: number().integer().default(1).min(1),
  limit: number().integer().default(2).min(1),
});
