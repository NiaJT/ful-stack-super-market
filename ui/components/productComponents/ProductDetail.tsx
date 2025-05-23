"use client";
import { AddSharp, Remove } from "@mui/icons-material";
import { IconButton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IError } from "@/interface/error.interface";
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
import DeleteProductDialog from "../basic/DeleteProductDialog";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";
import AddtoCart from "../cartComponents/AddtoCart";
import BuyButton from "../buyerComponents/BuyButton";
import getUserRole from "../../utilities/get.user.role";
import { noProductImage } from "@/constants/noproductImage";

interface IProductDetail {
  name: string;
  brand: string;
  price: number;
  quantity: number;
  category: string;
  freeShipping: boolean;
  description: string;
  image?: string;
}
// Unchanged imports...

const ProductDetail = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [role, setRole] = useState("");
  const [count, setCount] = useState(1);

  useEffect(() => {
    const userRole = getUserRole() as string;
    setRole(userRole);
  }, []);

  const { isPending, data, error } = useQuery({
    queryKey: ["get-product-detail"],
    queryFn: async () => {
      return await axiosInstance.get(`/product/detail/${productId}`);
    },
  });

  useEffect(() => {
    if (error) {
      const err = error as IError;
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  }, [error]);

  const product: IProductDetail = data?.data?.productDetails;

  if (isPending) {
    return (
      <Box className="flex items-center justify-center h-full">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return null;
  }

  return (
    <Box className="flex flex-col md:flex-row gap-6 w-full max-w-5xl p-3 md:p-4 bg-white rounded-lg shadow-md mx-auto max-h-full overflow-hidden mt-6">
      {/* Image Section */}
      <Box className="md:w-1/2 relative h-48 md:h-[300px] bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
        <Image
          src={product.image || noProductImage}
          alt={product.name}
          fill
          className="object-cover object-center hover:scale-105 transition-transform duration-300"
          priority
          unoptimized
        />
      </Box>

      {/* Info Section */}
      <Box className="md:w-1/2 overflow-y-auto pr-1 space-y-4">
        <Typography
          variant="h4"
          className="text-xl font-semibold text-gray-800"
        >
          {product.name}
        </Typography>

        <Box className="flex gap-2 flex-wrap">
          <Chip
            label={`Brand: ${product.brand}`}
            size="small"
            className="bg-blue-100 text-blue-800"
          />
          <Chip
            label={`Category: ${product.category}`}
            size="small"
            className="bg-green-100 text-green-800"
          />
        </Box>

        <Divider className="my-2" />

        <Box className="space-y-3">
          <Typography variant="h5" className="text-lg text-red-600 font-bold">
            ${product.price}
          </Typography>

          <Box className="flex items-center gap-2 flex-wrap">
            <Typography className="text-sm">
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
            {product.freeShipping && (
              <Chip
                label="Free Shipping"
                className="bg-orange-100 text-orange-800"
                size="small"
              />
            )}
          </Box>
        </Box>

        <Divider className="my-2" />

        <Box>
          <Typography
            variant="h6"
            className="text-base font-semibold text-gray-700 mb-2"
          >
            Description
          </Typography>
          <Box className="text-gray-600 leading-relaxed text-sm text-justify break-words max-h-[120px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
            {product.description}
          </Box>
        </Box>

        {role === "seller" && (
          <Box className="flex gap-3 mt-4 justify-center md:justify-start">
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<EditIcon />}
              className="md:w-auto px-6 py-1.5 text-sm"
              onClick={() => router.push(`/edit-product/${productId}`)}
            >
              Edit
            </Button>
            <DeleteProductDialog id={productId} />
          </Box>
        )}

        {role === "buyer" && (
          <Box className="flex flex-col gap-3 justify-center">
            <Box className="flex items-center space-x-3">
              <Typography variant="h6" className="text-sm">
                Quantity:
              </Typography>

              <Box className="flex items-center space-x-2 px-2 py-1">
                <IconButton
                  color="secondary"
                  size="small"
                  disabled={count === 1}
                  onClick={() => setCount(count - 1)}
                >
                  <Remove fontSize="small" />
                </IconButton>

                <Box className="w-14">
                  <TextField
                    variant="outlined"
                    size="small"
                    type="number"
                    value={count}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1 && value <= product.quantity) {
                        setCount(value);
                      } else if (value < 1 || isNaN(value)) {
                        setCount(1);
                      } else {
                        setCount(product.quantity);
                      }
                    }}
                    sx={{
                      "& input[type=number]::-webkit-inner-spin-button": {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                      "& input[type=number]::-webkit-outer-spin-button": {
                        WebkitAppearance: "none",
                        margin: 0,
                      },
                      "& input[type=number]": { MozAppearance: "textfield" },
                    }}
                  />
                </Box>

                <IconButton
                  color="secondary"
                  size="small"
                  disabled={count === product.quantity}
                  onClick={() => setCount(count + 1)}
                >
                  <AddSharp fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Box className="flex gap-3 mt-2 justify-center">
              <AddtoCart productId={productId} quantity={count} />
              <BuyButton />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductDetail;
