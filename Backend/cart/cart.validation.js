import yup from "yup";
export const addItemtoCartSchema = yup.object({
  productId: yup.string().required().trim(),
  orderedQuantity: yup.number().required().min(1),
});
