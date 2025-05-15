"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import Image from "next/image";
import EditIcon from "@mui/icons-material/Edit";
import DeleteProductDialog from "./DeleteProductDialog";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";
import AddtoCart from "./AddtoCart";
import CountButton from "./CountButton";
import BuyButton from "./BuyButton";
import getUserRole from "../utilities/get.user.role";

interface IProductDetail {
  name: string;
  brand: string;
  price: number;
  quantity: number;
  category: string;
  freeShipping: boolean;
  description: string;
}
const ProductDetail = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [role, setRole] = useState("buyer");
  useEffect(() => {
    const userRole = getUserRole() as string;
    setRole(userRole);
  }, []);
  console.log(role);
  const { isPending, data, error } = useQuery({
    queryKey: ["get-product-detail"],
    queryFn: async () => {
      return await axiosInstance.get(`/product/detail/${productId}`);
    },
  });
  const product: IProductDetail = data?.data?.productDetails;

  if (isPending) {
    return <CircularProgress />;
  }

  if (error) {
    toast.error(error?.response?.data?.message);
    return;
  }

  return (
    <Box className="flex flex-col md:flex-row gap-8 w-full max-w-6xl p-6 bg-white rounded-xl shadow-lg m-8">
      <Box className="md:w-1/2 relative h-96 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <Image
          src="/mouseImage.jpg"
          alt={product.name}
          fill
          className="object-contain object-center hover:scale-105 transition-transform duration-300"
          priority
        />
      </Box>

      <Box className="md:w-1/2 space-y-6">
        <Typography variant="h4" className="text-3xl font-bold text-gray-800">
          {product.name}
        </Typography>

        <Box className="flex gap-2 flex-wrap">
          <Chip
            label={`Brand: ${product.brand}`}
            className="bg-blue-100 text-blue-800"
          />
          <Chip
            label={`Category: ${product.category}`}
            className="bg-green-100 text-green-800"
          />
        </Box>

        <Divider className="my-4" />

        <Box className="space-y-4">
          <Typography variant="h5" className="text-2xl text-red-600 font-bold">
            ${product.price}
          </Typography>

          <Box className="flex items-center gap-2 flex-wrap">
            <Typography className="text-base">
              Availability:
              <span
                className={`ml-2 font-medium ${
                  product.quantity > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.quantity > 0
                  ? `${product.quantity} in stock`
                  : "Out of stock"}
              </span>
            </Typography>
            {product.freeShipping === true && (
              <Chip
                label="Free Shipping"
                className="bg-orange-100 text-orange-800 ml-2"
                size="small"
              />
            )}
          </Box>
        </Box>

        <Divider className="my-4" />

        <Box className="mb-6">
          <Typography
            variant="h6"
            className="text-lg font-semibold text-gray-700 mb-3"
          >
            Product Description
          </Typography>
          <Box
            className="text-gray-600 leading-relaxed text-base text-justify break-words 
              max-h-[200px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 
              scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400"
          >
            {product.description}
          </Box>
        </Box>
        {role === "seller" && (
          <Box className="flex gap-4 mt-8 justify-center md:justify-start">
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<EditIcon />}
              className="md:w-auto px-8 py-2"
              onClick={() => {
                router.push(`/edit-product/${productId}`);
              }}
            >
              Edit
            </Button>
            <DeleteProductDialog id={productId} />
          </Box>
        )}
        {role == "buyer" && (
          <Box className="flex flex-col gap-4 justify-center md:justify-center">
            <CountButton />
            <Box className="flex gap-4 mt-4 justify-center md:justify-center">
              <AddtoCart />
              <BuyButton />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductDetail;
