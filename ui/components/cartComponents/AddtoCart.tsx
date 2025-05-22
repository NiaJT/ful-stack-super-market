"use client";
import React from "react";
import { Button } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";

import toast from "react-hot-toast";
import { IError } from "@/interface/error.interface";
import { useRouter } from "next/navigation";

interface IData {
  message: string;
  statusCode: number;
}

const AddtoCart = (props: { productId: string; quantity: number }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isPending, mutate } = useMutation({
    mutationKey: ["add-to-cart"],
    mutationFn: async (values: {
      productId: string;
      orderedQuantity: number;
    }) => {
      const response = await axiosInstance.post("/cart/item/add", values);

      return response.data as IData;
    },
    onSuccess: (response: IData) => {
      toast.success(response?.message);
      queryClient.invalidateQueries({ queryKey: ["get-cart-items-count"] });
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
      router.replace("/cart");
    },
  });
  if (isPending) {
    return (
      <Button
        fullWidth
        variant="contained"
        color="secondary"
        startIcon={<ShoppingCartIcon />}
        disabled
      >
        Adding...
      </Button>
    );
  }
  return (
    <Button
      fullWidth
      variant="contained"
      color="secondary"
      startIcon={<ShoppingCartIcon />}
      onClick={() => {
        mutate({ productId: props.productId, orderedQuantity: props.quantity });
      }}
    >
      Add to Cart
    </Button>
  );
};

export default AddtoCart;
