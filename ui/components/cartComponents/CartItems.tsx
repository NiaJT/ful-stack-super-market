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
} from "@mui/material";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import { AddSharp, Remove } from "@mui/icons-material";
import FlushCart from "./FlushCart";
import RemoveCartItem from "./RemoveCartItem";
import { useRouter } from "next/navigation";
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
  // when the data is fetched
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
  // Ensure the count is between 1 and the maximum quantity available
  const handleCountChange = (id: string, value: number, max: number) => {
    const newValue = isNaN(value) ? 1 : Math.max(1, Math.min(value, max));
    setCounts((prev) => ({ ...prev, [id]: newValue }));
  };

  if (isPending) return <Box className="mt-10">Loading...</Box>;
  if (error)
    return <Box className="mt-10 text-red-600">Failed to load cart items.</Box>;

  if (data?.length === 0)
    return (
      <Box
        className="flex flex-col justify-center items-center mt-10 w-1/3 p-8 g-4"
        sx={{
          boxShadow:
            "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px",
        }}
      >
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            router.replace("/");
          }}
        >
          {" "}
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
    <Box className="flex flex-col items-center w-full px-4 md:px-0 md:w-3/4 lg:w-2/3 my-10">
      <FlushCart />
      <h2 className="text-2xl font-semibold mb-4">Your Cart Items</h2>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table sx={{ minWidth: 650 }} aria-label="cart table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {["S.N.", "Image", "Name", "Quantity", "Amount", "Action"].map(
                (head) => (
                  <TableCell align="center" key={head}>
                    <span className="font-bold">{head}</span>
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
                <TableRow key={item._id} hover>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    <Image
                      src="/mouseImage.jpg"
                      width={80}
                      height={80}
                      alt="Product"
                      className="rounded shadow object-contain"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box className="flex flex-col items-center">
                      <span className="font-semibold text-gray-800">
                        {item.product.name}
                      </span>
                      <Chip
                        color="secondary"
                        label={item.product.brand}
                        size="small"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box className="flex items-center space-x-2 px-3 py-1">
                      <IconButton
                        color="secondary"
                        size="small"
                        disabled={count === 1}
                        onClick={() =>
                          handleCountChange(item._id, count - 1, maxQty)
                        }
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
                      >
                        <AddSharp fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    ${count * item.product.price}
                  </TableCell>
                  <TableCell align="center">
                    <RemoveCartItem _id={item._id} />
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={4} />
              <TableCell align="center">
                <strong>${totalAmount}</strong>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CartItems;
