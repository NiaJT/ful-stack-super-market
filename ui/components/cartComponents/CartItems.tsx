"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  IconButton,
  TextField,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import { AddSharp, Remove } from "@mui/icons-material";
import FlushCart from "./FlushCart";
import RemoveCartItem from "./RemoveCartItem";
import { useRouter } from "next/navigation";
import { noProductImage } from "@/constants/noproductImage";

interface ICartItem {
  _id: string;
  orderedQuantity: number;
  product: {
    name: string;
    brand: string;
    price: number;
    quantity: number;
    category: string;
    totalQuantity: number;
    image?: string;
  };
}

const CartItems = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const router = useRouter();

  const { isPending, data, error } = useQuery<ICartItem[]>({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const res = await axiosInstance.get("/cart/list");
      return res.data.CartList;
    },
  });

  // Initialize counts state with ordered quantities from the data
  useEffect(() => {
    if (data) {
      const initialCounts: Record<string, number> = {};
      data.forEach((item) => {
        initialCounts[item._id] = item.orderedQuantity || 1;
      });
      setCounts(initialCounts);
    }
  }, [data]);

  // Handle count change for each item
  const handleCountChange = (id: string, value: number, max: number) => {
    const newValue = isNaN(value) ? 1 : Math.max(1, Math.min(value, max));
    setCounts((prev) => ({ ...prev, [id]: newValue }));
  };

  if (isPending)
    return (
      <Box className="mt-16 flex justify-center items-center">
        <Typography variant="h6" color="grey.700">
          Loading your cart...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Box className="mt-16 flex justify-center items-center">
        <Typography variant="h6" color="error">
          Failed to load cart items.
        </Typography>
      </Box>
    );

  if (data?.length === 0)
    return (
      <Box
        className="flex flex-col justify-center items-center mt-16 w-full md:w-1/3 p-10 gap-6"
        sx={{
          boxShadow:
            "rgba(16,185,129,0.15) 0px 8px 32px, rgba(0,0,0,0.06) 0px 1.5px 5px",
          borderRadius: 6,
          background: "linear-gradient(135deg, #f0fdf4 70%, #bbf7d0 100%)",
        }}
      >
        <Typography variant="h5" className="font-semibold text-green-900 mb-2" sx={{ fontFamily: "serif" }}>
          Your cart is empty
        </Typography>
        <Button
          color="success"
          variant="contained"
          sx={{
            bgcolor: "green.700",
            borderRadius: "999px",
            fontWeight: 600,
            px: 4,
            py: 1.5,
            fontFamily: "serif",
            textTransform: "none",
            fontSize: "1.1rem",
            "&:hover": { bgcolor: "green.800" },
          }}
          onClick={() => {
            router.replace("/");
          }}
        >
          Continue Shopping
        </Button>
      </Box>
    );

  const totalAmount =
    data?.reduce(
      (acc, item) => acc + (counts[item._id] || 1) * item.product.price,
      0
    ) ?? 0;

  return (
    <Box className="flex flex-col items-center w-full px-4 md:px-0 md:w-4/5 lg:w-2/3 my-14">
      <FlushCart />
      <Typography
        variant="h4"
        className="font-bold mb-5"
        sx={{
          color: "#166534",
          fontFamily: "serif",
          letterSpacing: 0.5,
        }}
      >
        Shopping Cart
      </Typography>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          borderRadius: 5,
          background: "linear-gradient(135deg, #f8fafc 85%, #bbf7d0 100%)",
          boxShadow:
            "rgba(16,185,129,0.10) 0px 4px 24px, rgba(0,0,0,0.03) 0px 1.5px 3px",
        }}
      >
        <Table sx={{ minWidth: 750 }} aria-label="cart table">
          <TableHead>
            <TableRow sx={{ background: "#f0fdf4" }}>
              {["S.N.", "Image", "Name", "Quantity", "Amount", "Action"].map(
                (head) => (
                  <TableCell
                    align="center"
                    key={head}
                    sx={{
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      color: "#166534",
                      fontFamily: "serif",
                      borderBottom: "2px solid #bbf7d0",
                    }}
                  >
                    {head}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item, index) => {
              const count = counts[item._id] || 1;
              const maxQty = item.product.totalQuantity;

              return (
                <TableRow
                  key={item._id}
                  hover
                  sx={{
                    background:
                      index % 2 === 0
                        ? "rgba(236,253,245,0.6)"
                        : "rgba(255,255,255,0.95)",
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 600, fontFamily: "serif" }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell align="center">
                    <Image
                      src={item.product.image || noProductImage}
                      width={75}
                      height={75}
                      alt="Product"
                      className="rounded shadow object-contain border border-green-100"
                      unoptimized
                      style={{
                        background: "#fff",
                        padding: 8,
                        borderRadius: 12,
                        boxShadow:
                          "0 2px 12px 0 rgba(16,185,129,0.09)",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box className="flex flex-col items-center">
                      <Typography
                        className="font-semibold text-green-900"
                        sx={{
                          fontFamily: "serif",
                          fontWeight: 700,
                          fontSize: "1.07rem",
                        }}
                      >
                        {item.product.name}
                      </Typography>
                      <Chip
                        label={item.product.brand}
                        size="small"
                        sx={{
                          bgcolor: "#e2e8f0",
                          color: "#0f172a",
                          fontWeight: 700,
                          fontFamily: "serif",
                          letterSpacing: 0.4,
                          mt: 0.5,
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box className="flex items-center justify-center space-x-2 px-3 py-1 bg-green-50 rounded-xl shadow">
                      <IconButton
                        color="secondary"
                        size="small"
                        disabled={count === 1}
                        onClick={() =>
                          handleCountChange(item._id, count - 1, maxQty)
                        }
                        sx={{
                          bgcolor: "#e4e4e7",
                          "&:hover": { bgcolor: "#d1d5db" },
                          borderRadius: "999px",
                          p: 0.8,
                        }}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Box className="w-16">
                        <TextField
                          variant="outlined"
                          size="small"
                          type="number"
                          value={count}
                          onChange={(e) =>
                            handleCountChange(
                              item._id,
                              Number(e.target.value),
                              maxQty
                            )
                          }
                          sx={{
                            "& input[type=number]::-webkit-inner-spin-button": {
                              WebkitAppearance: "none",
                              margin: 0,
                            },
                            "& input[type=number]::-webkit-outer-spin-button": {
                              WebkitAppearance: "none",
                              margin: 0,
                            },
                            "& input[type=number]": {
                              MozAppearance: "textfield",
                            },
                            "& .MuiInputBase-input": {
                              textAlign: "center",
                              fontWeight: 600,
                              fontSize: "1rem",
                              px: 0,
                              py: 0.5,
                              borderRadius: "8px",
                              color: "#166534",
                              background: "#fff",
                              fontFamily: "serif",
                            },
                          }}
                        />
                      </Box>
                      <IconButton
                        color="secondary"
                        size="small"
                        disabled={count === maxQty}
                        onClick={() =>
                          handleCountChange(item._id, count + 1, maxQty)
                        }
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
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: "#059669",
                      fontWeight: 700,
                      fontFamily: "serif",
                      fontSize: "1.07rem",
                    }}
                  >
                    ${(count * item.product.price).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <RemoveCartItem _id={item._id} />
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={3} />
              <TableCell align="right">
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "1.13rem",
                    fontFamily: "serif",
                  }}
                >
                  Total
                </Typography>
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: "#166534",
                  fontWeight: 800,
                  fontSize: "1.18rem",
                  fontFamily: "serif",
                }}
              >
                ${totalAmount.toFixed(2)}
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Divider sx={{ my: 4, width: "100%", background: "#bbf7d0", height: 3 }} />
      {/* Checkout Button (optional, can be added here if needed) */}
    </Box>
  );
};

export default CartItems;