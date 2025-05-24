"use client";
import { AddSharp, Remove } from "@mui/icons-material";
import {
  IconButton,
  TextField,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { IError } from "@/interface/error.interface";
import { axiosInstance } from "@/lib/axios.instance";
import AddtoCart from "../cartComponents/AddtoCart";
import BuyButton from "../buyerComponents/BuyButton";
import DeleteProductDialog from "../basic/DeleteProductDialog";
import getUserRole from "../../utilities/get.user.role";
import { noProductImage } from "@/constants/noproductImage";
import EditIcon from "@mui/icons-material/Edit";

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

const ProductDetail = () => {
  const router = useRouter();
  const params = useParams();
  const [role, setRole] = useState("");
  const [count, setCount] = useState(1);

  useEffect(() => {
    setRole(getUserRole() || "");
  }, []);

  const { data, isPending, error } = useQuery({
    queryKey: ["get-product-detail"],
    queryFn: async () =>
      await axiosInstance.get(`/product/detail/${params.id}`),
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
      <Box className="flex items-center justify-center h-full min-h-[400px]">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) return null;

  return (
    <Box className="flex flex-col md:flex-row gap-8 w-full max-w-4xl p-4 md:p-6 mx-auto mt-8 shadow-2xl rounded-3xl border border-green-100 bg-gradient-to-br from-white/90 via-green-50 to-green-100 overflow-hidden">
      {/* Image Section */}
      <Box className="md:w-[45%] relative h-56 md:h-[320px] rounded-2xl overflow-hidden flex items-center justify-center shadow-lg border border-green-200 bg-white">
        <Image
          src={product.image || noProductImage}
          alt={product.name}
          fill
          unoptimized
          priority
          className="object-contain p-4 rounded-xl transition-transform hover:scale-105"
        />
        {product.quantity === 0 && (
          <Box className="absolute top-4 right-[-36px] rotate-30 px-6 py-0.5 bg-red-600 text-white text-[12px] font-bold shadow-md z-10 tracking-wider">
            Out of Stock
          </Box>
        )}
      </Box>

      {/* Info Section */}
      <Box className="md:w-[55%] flex flex-col space-y-4">
        <Typography
          variant="h4"
          className="font-bold text-green-900 text-[1.7rem]"
        >
          {product.name}
        </Typography>

        <Box className="flex gap-2 flex-wrap">
          <Chip
            label={`Brand: ${product.brand}`}
            size="small"
            className="bg-green-700 text-white text-sm font-semibold shadow"
          />
          <Chip
            label={product.category}
            size="small"
            className="bg-green-200 text-green-900 text-sm font-semibold shadow"
          />
        </Box>

        <Divider className="border-green-200" />

        <Typography className="text-green-700 font-extrabold text-[1.6rem]">
          ${product.price}
        </Typography>

        <Box className="flex items-center gap-3 flex-wrap">
          <Typography className="text-sm font-medium text-gray-800">
            Availability:
            <span
              className={`ml-2 font-semibold ${
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
              size="small"
              className="bg-orange-100 text-orange-800 font-bold shadow"
            />
          )}
        </Box>

        <Divider className="border-green-200" />

        <Box>
          <Typography className="font-semibold text-green-800 text-[1.05rem] mb-2">
            Description
          </Typography>
          <Box className="text-gray-700 text-sm leading-relaxed text-justify break-words max-h-[120px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-200 hover:scrollbar-thumb-green-400">
            {product.description}
          </Box>
        </Box>

        {/* Seller Actions */}
        {role === "seller" && (
          <Box className="flex gap-3 justify-center md:justify-start mt-4">
            <Button
            fullWidth
              variant="contained"
              color="secondary"
              startIcon={<EditIcon />}
              onClick={() => router.push(`/edit-product/${params.id}`)}
              className="bg-slate-800 hover:bg-slate-900 px-6 py-1.5 text-sm rounded-full font-bold text-white shadow"
            >
              Edit
            </Button>
            <DeleteProductDialog id={params.id as string} />
          </Box>
        )}

        {/* Buyer Actions */}
        {role === "buyer" && (
          <Box className="flex flex-col gap-3">
            <Box className="flex items-center space-x-3">
              <Typography variant="h6" className="text-sm font-semibold">
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

            <Box className="flex gap-3 justify-center mt-2">
              <AddtoCart productId={params.id as string} quantity={count} />
              <BuyButton />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductDetail;
