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
    <Box
      className="flex flex-col md:flex-row gap-8 w-full max-w-4xl p-4 md:p-6 mx-auto overflow-hidden mt-8 shadow-2xl rounded-3xl border border-green-100 bg-gradient-to-br from-white/90 via-green-50 to-green-100"
    >
      {/* Image Section */}
      <Box
        className="md:w-[45%] relative h-56 md:h-[320px] rounded-2xl overflow-hidden flex items-center justify-center shadow-lg bg-gradient-to-br from-green-50 via-white to-green-100"
        sx={{
          border: "1.5px solid #bbf7d0",
        }}
      >
        <Image
          src={product.image || noProductImage}
          alt={product.name}
          fill
          className="object-contain object-center hover:scale-105 transition-transform duration-300 bg-white rounded-xl"
          priority
          unoptimized
          style={{
            padding: "18px",
          }}
        />
        {/* Out of Stock Ribbon */}
        {product.quantity === 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 18,
              right: -40,
              bgcolor: "error.main",
              color: "#fff",
              transform: "rotate(30deg)",
              px: 7,
              py: 0.5,
              fontWeight: 700,
              fontSize: 13,
              boxShadow: 2,
              zIndex: 2,
              letterSpacing: 1,
            }}
          >
            Out of Stock
          </Box>
        )}
      </Box>

      {/* Info Section */}
      <Box className="md:w-[55%] flex flex-col overflow-y-auto pr-1 space-y-4">
        <Typography
          variant="h4"
          className="font-bold text-green-900"
          sx={{
            fontSize: { xs: "1.35rem", md: "1.7rem" },
            letterSpacing: "0.5px",
            mb: 1,
          }}
        >
          {product.name}
        </Typography>

        <Box className="flex gap-2 flex-wrap">
          <Chip
            label={`Brand: ${product.brand}`}
            size="small"
            className="shadow bg-green-700 text-white"
            sx={{
              fontWeight: 600,
              fontSize: 13,
              bgcolor: "green.700",
              color: "#166534",
              letterSpacing: 0.5,
            }}
          />
          <Chip
            label={product.category}
            size="small"
            className="shadow bg-green-200 text-green-900"
            sx={{
              fontWeight: 600,
              fontSize: 13,
              bgcolor: "green.200",
              color: "#166534",
              letterSpacing: 0.5,
            }}
          />
        </Box>

        <Divider className="my-2" sx={{ borderColor: "#bbf7d0" }} />

        <Typography
          variant="h5"
          className="text-green-700 font-extrabold"
          sx={{
            fontSize: { xs: "1.3rem", md: "1.6rem" },
            fontWeight: 800,
            color: "#059669",
            mb: 1,
            letterSpacing: "0.5px",
          }}
        >
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
              className="bg-orange-100 text-orange-800 font-bold"
              size="small"
              sx={{
                bgcolor: "#fbbf24",
                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
              }}
            />
          )}
        </Box>

        <Divider className="my-2" sx={{ borderColor: "#bbf7d0" }} />

        <Box>
          <Typography
            variant="h6"
            className="font-semibold text-green-800 mb-2"
            sx={{ fontSize: "1.08rem" }}
          >
            Description
          </Typography>
          <Box className="text-gray-700 leading-relaxed text-[0.99rem] text-justify break-words max-h-[120px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50 hover:scrollbar-thumb-green-400">
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
              className="md:w-auto px-6 py-1.5 text-sm rounded-full shadow"
              onClick={() => router.push(`/edit-product/${productId}`)}
              sx={{
                fontWeight: 700,
                textTransform: "none",
                bgcolor: "#334155",
                "&:hover": { bgcolor: "#1e293b" },
              }}
            >
              Edit
            </Button>
            <DeleteProductDialog id={productId} />
          </Box>
        )}

        {role === "buyer" && (
          <Box className="flex flex-col gap-3 justify-center">
            <Box className="flex items-center space-x-3">
              <Typography variant="h6" className="text-sm font-semibold">
                Quantity:
              </Typography>
              <Box className="flex items-center space-x-2 px-2 py-1 bg-green-50 rounded-xl shadow">
                <IconButton
                  color="secondary"
                  size="small"
                  disabled={count === 1}
                  onClick={() => setCount(count - 1)}
                  sx={{
                    bgcolor: "#e4e4e7",
                    "&:hover": { bgcolor: "#d1d5db" },
                    borderRadius: "999px",
                    p: 0.8,
                  }}
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
                      "& .MuiInputBase-input": {
                        textAlign: "center",
                        fontWeight: 600,
                        fontSize: "1rem",
                        px: 0,
                        py: 0.5,
                        borderRadius: "8px",
                        color: "#166534",
                        background: "#fff",
                      },
                    }}
                  />
                </Box>
                <IconButton
                  color="secondary"
                  size="small"
                  disabled={count === product.quantity}
                  onClick={() => setCount(count + 1)}
                  sx={{
                    bgcolor: "#e4e4e7",
                    "&:hover": { bgcolor: "#d1d5db" },
                    borderRadius: "999px",
                    p: 0.8,
                  }}
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