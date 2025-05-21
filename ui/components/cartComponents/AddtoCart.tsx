import React from "react";
import { Button } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";

import toast from "react-hot-toast";

interface IData {
  message: string;
  statusCode: number;
}

const AddtoCart = (props: { productId: string; quantity: number }) => {
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
    },
    onError: (error: Error) => {
      toast.error(error?.message);
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
