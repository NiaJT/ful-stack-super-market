"use client";
import { productCategoriesForDropDown } from "@/constants/general.constant";
import { productSchema } from "@/validationSchema/addProduct.Schema";

import {
  Box,
  Button,
  CircularProgress,
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
import { Formik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import { IError } from "@/interface/error.interface";
import toast from "react-hot-toast";
import { IAddProductForm } from "./AddProductForm";
import Image from "next/image";
import { useState } from "react";
import axios from "axios";
const EditProductForm = () => {
  const [localUrl, setLocalUrl] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const handleImageUploadToCloudinary = async (image: File) => {
    try {
      const uploadPreset = "nextjs-emart";
      const cloudName = "ddw2isstw";

      const formData = new FormData();

      formData.append("file", image);
      formData.append("upload_preset", uploadPreset);
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      console.log("Cloudinary Full Response:", response);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    }
  };
  const router = useRouter();
  const params = useParams();
  const { isPending, data } = useQuery<IAddProductForm, IError>({
    queryKey: ["product-details"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/product/detail/${params.id}`);
      return response.data?.productDetails;
    },
  });
  const { isPending: editPending, mutate } = useMutation<
    { message: string },
    IError,
    IAddProductForm
  >({
    mutationKey: ["get-product"],
    mutationFn: async (values) => {
      const res = await axiosInstance.put(`/product/edit/${params.id}`, values);
      return res.data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success(data.message);
      router.push(`/product-detail/${params.id}`);
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });
  if (isPending) {
    return <CircularProgress />;
  }

  return (
    <Box className="flex justify-center items-center min-h-screen mt-4">
      <Formik
        enableReinitialize
        initialValues={{
          image: data?.image || "",
          name: data?.name || "",
          brand: data?.brand || "",
          price: data?.price || 0,
          quantity: data?.quantity || 1,
          category: data?.category || "",
          freeShipping: data?.freeShipping || false,
          description: data?.description || "",
        }}
        validationSchema={productSchema}
        onSubmit={async (values: IAddProductForm) => {
          let url = "";
          if (image) {
            url = await handleImageUploadToCloudinary(image);
          }
          const newValues = {
            ...values,
            freeShipping: values.freeShipping === "true",
            image: url ? url : data?.image || "",
          };
          mutate(newValues);
        }}
      >
        {(formik) => {
          return (
            <form
              className="flex flex-col gap-2 items-center justify-center p-4 min-w-[350px] shadow-lg rounded-xl bg-white"
              onSubmit={formik.handleSubmit}
            >
              {editPending && <LinearProgress />}
              <Typography variant="h5">Edit Product</Typography>
              <Box className="relative h-[250px] w-full">
                <Image
                  src={localUrl || data?.image || ""}
                  alt="Product Image"
                  fill
                  style={{
                    objectFit: "contain",
                  }}
                />
              </Box>
              <input
                type="file"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  if (!event || !event.target || !event.target.files) {
                    return;
                  }
                  const image = event.target.files[0];
                  const Url = URL.createObjectURL(image);
                  setLocalUrl(Url);
                  setImage(image);
                }}
              />
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
                    value="false"
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
export default EditProductForm;
