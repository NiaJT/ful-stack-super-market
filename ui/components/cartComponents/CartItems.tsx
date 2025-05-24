"use client";
import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Chip,
  IconButton, TextField, Button, Typography, Divider
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

  useEffect(() => {
    if (data) {
      const initialCounts = Object.fromEntries(
        data.map(item => [item._id, item.orderedQuantity || 1])
      );
      setCounts(initialCounts);
    }
  }, [data]);

  const handleCountChange = (id: string, value: number, max: number) => {
    const newValue = isNaN(value) ? 1 : Math.max(1, Math.min(value, max));
    setCounts(prev => ({ ...prev, [id]: newValue }));
  };

  if (isPending) return <CenteredText text="Loading your cart..." />;
  if (error) return <CenteredText text="Failed to load cart items." error />;
  if (!data?.length)
    return (
      <Box className="flex flex-col items-center mt-16 w-full md:w-1/3 p-10 gap-6 rounded-xl bg-gradient-to-br from-green-50 to-green-200 shadow-lg">
        <Typography variant="h5" className="font-semibold text-green-900 font-serif">Your cart is empty</Typography>
        <Button
          color="success"
          variant="contained"
          className="rounded-full px-6 py-2 text-lg font-semibold normal-case font-serif"
          onClick={() => router.replace("/")}
        >
          Continue Shopping
        </Button>
      </Box>
    );

  const totalAmount = data.reduce(
    (acc, item) => acc + (counts[item._id] || 1) * item.product.price,
    0
  );

  return (
    <Box className="flex flex-col items-center w-full px-4 md:px-0 md:w-4/5 lg:w-2/3 my-14">
      <FlushCart />
      <Typography variant="h4" className="font-bold text-green-900 font-serif mb-5">Shopping Cart</Typography>

      <TableContainer component={Paper} elevation={3} className="rounded-2xl bg-gradient-to-br from-slate-50 to-green-200 shadow-md">
        <Table>
          <TableHead>
            <TableRow className="bg-green-50">
              {["S.N.", "Image", "Name", "Quantity", "Amount", "Action"].map((head) => (
                <TableCell align="center" key={head} className="text-green-800 font-bold text-lg font-serif border-b-2 border-green-200">{head}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, i) => {
              const count = counts[item._id] || 1;
              const maxQty = item.product.totalQuantity;

              return (
                <TableRow key={item._id} className={i % 2 === 0 ? "bg-green-50/60" : "bg-white/90"}>
                  <TableCell align="center" className="font-semibold font-serif">{i + 1}</TableCell>
                  <TableCell align="center">
                    <Image
                      src={item.product.image || noProductImage}
                      width={75}
                      height={75}
                      alt="Product"
                      className="rounded-lg shadow border border-green-100 object-contain p-2 bg-white"
                      unoptimized
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box className="flex flex-col items-center">
                      <Typography className="font-bold text-green-900 font-serif">{item.product.name}</Typography>
                      <Chip label={item.product.brand} size="small" className="bg-slate-200 text-slate-900 font-serif font-bold mt-1" />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Box className="flex items-center justify-center gap-2 px-3 py-1 bg-green-50 rounded-xl shadow">
                      <IconButton
                        size="small"
                        disabled={count === 1}
                        onClick={() => handleCountChange(item._id, count - 1, maxQty)}
                        className="bg-zinc-200 hover:bg-zinc-300 rounded-full p-1"
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <TextField
                        type="number"
                        size="small"
                        value={count}
                        onChange={(e) => handleCountChange(item._id, Number(e.target.value), maxQty)}
                        className="w-14 [&_input]:text-center [&_input]:font-semibold [&_input]:text-green-800"
                        inputProps={{ min: 1, max: maxQty }}
                        sx={{
                          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
                          "& input[type=number]": { MozAppearance: "textfield" },
                        }}
                      />
                      <IconButton
                        size="small"
                        disabled={count === maxQty}
                        onClick={() => handleCountChange(item._id, count + 1, maxQty)}
                        className="bg-zinc-200 hover:bg-zinc-300 rounded-full p-1"
                      >
                        <AddSharp fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="center" className="text-emerald-600 font-bold font-serif">${(count * item.product.price).toFixed(2)}</TableCell>
                  <TableCell align="center"><RemoveCartItem _id={item._id} /></TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={3} />
              <TableCell align="right"><span className="font-bold text-lg font-serif">Total</span></TableCell>
              <TableCell align="center" className="text-green-900 font-bold text-lg font-serif">${totalAmount.toFixed(2)}</TableCell>
              <TableCell />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Divider className="my-8 w-full bg-green-200 h-1.5 rounded-full" />
      {/* Checkout button can be added here */}
    </Box>
  );
};

export default CartItems;

const CenteredText = ({ text, error = false }: { text: string; error?: boolean }) => (
  <Box className="mt-16 flex justify-center items-center">
    <Typography variant="h6" className={`font-serif ${error ? "text-red-600" : "text-zinc-600"}`}>
      {text}
    </Typography>
  </Box>
);
