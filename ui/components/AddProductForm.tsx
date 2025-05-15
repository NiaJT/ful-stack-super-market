"use client";
import { productCategoriesForDropDown } from "@/constants/general.constant";
import { IError } from "@/interface/error.interface";
import { IResponse } from "@/interface/response.interface";
import { axiosInstance } from "@/lib/axios.instance";
import { productSchema } from "@/validationSchema/addProduct.Schema";

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export interface IAddProductForm {
  name: string;
  brand: string;
  price: number;
  quantity: number;
  category: string;
  freeShipping: boolean | string;
  description: string;
}
const AddProductForm = () => {
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationKey: ["add-product"],
    mutationFn: async (values: IAddProductForm) => {
      return await axiosInstance.post("/product/add", values);
    },
    onSuccess: (res: IResponse) => {
      toast.success(res.data.message);
      router.push("/");
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });
  return (
    <Box>
      {isPending && <LinearProgress />}
      <Formik
        initialValues={{
          name: "",
          brand: "",
          price: 0,
          quantity: 1,
          category: "",
          freeShipping: false,
          description: "",
        }}
        validationSchema={productSchema}
        onSubmit={(values: IAddProductForm) => {
          mutate({
            ...values,
            freeShipping: Boolean(values.freeShipping),
          });
        }}
      >
        {(formik) => {
          return (
            <form
              className="flex flex-col gap-2 items-center justify-center p-4 min-w-[350px] shadow-lg rounded-xl bg-white"
              onSubmit={formik.handleSubmit}
            >
              <Typography variant="h5">Add Product</Typography>
              <FormControl fullWidth>
                <TextField
                  label="Name"
                  {...formik.getFieldProps("name")}
                ></TextField>
                {formik.touched.name && formik.errors.name ? (
                  <FormHelperText error>{formik.errors.name}</FormHelperText>
                ) : null}
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="Brand"
                  {...formik.getFieldProps("brand")}
                ></TextField>
                {formik.touched.brand && formik.errors.brand ? (
                  <FormHelperText error>{formik.errors.brand}</FormHelperText>
                ) : null}
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="Price"
                  type="number"
                  slotProps={{ htmlInput: { min: 0 } }}
                  {...formik.getFieldProps("price")}
                ></TextField>
                {formik.touched.price && formik.errors.price ? (
                  <FormHelperText error>{formik.errors.price}</FormHelperText>
                ) : null}
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label="Quantity"
                  type="number"
                  slotProps={{ htmlInput: { min: 0 } }}
                  {...formik.getFieldProps("quantity")}
                ></TextField>
                {formik.touched.quantity && formik.errors.quantity ? (
                  <FormHelperText error>
                    {formik.errors.quantity}
                  </FormHelperText>
                ) : null}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select {...formik.getFieldProps("category")} label="Category">
                  {productCategoriesForDropDown.map((item) => {
                    return (
                      <MenuItem key={item.id} value={item.value}>
                        {item.label}
                      </MenuItem>
                    );
                  })}
                </Select>
                {formik.touched.category && formik.errors.category ? (
                  <FormHelperText error>
                    {formik.errors.category}
                  </FormHelperText>
                ) : null}
              </FormControl>
              <FormControl
                fullWidth
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <FormLabel sx={{ marginRight: 2 }}>Free Shipping</FormLabel>
                <RadioGroup
                  sx={{ display: "flex", flexDirection: "row" }} // Space between radio buttons
                  {...formik.getFieldProps("freeShipping")}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio color="secondary" />}
                    label="Yes"
                  />
                  <FormControlLabel
                    value=""
                    control={<Radio color="secondary" />}
                    label="No"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  multiline
                  minRows={3}
                  maxRows={8}
                  label="Description"
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description ? (
                  <FormHelperText error>
                    {formik.errors.description}
                  </FormHelperText>
                ) : null}
              </FormControl>

              <Button
                fullWidth
                type="submit"
                color="success"
                variant="contained"
                disabled={isPending}
              >
                SUBMIT
              </Button>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};
export default AddProductForm;
