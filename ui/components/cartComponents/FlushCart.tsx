"use client";
import { IError } from "@/interface/error.interface";
import { IResponse } from "@/interface/response.interface";
import { axiosInstance } from "@/lib/axios.instance";
import { Box, Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const FlushCart = () => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["flush-cart"],
    mutationFn: async (): Promise<IResponse> => {
      const response = await axiosInstance.delete("/cart/flush");
      return response.data;
    },
    onSuccess: (response: IResponse) => {
      toast.success(response.data.message);
    },
    onError: (error: IError) => {
      console.error(error);
      toast.error(error.response.data.message);
    },
  });

  return (
    <Box className="flex w-full justify-start items-center b-4">
      <Button variant="contained" color="error" onClick={() => mutate()} disabled={isPending}>
        {isPending ? "Flushing..." : "Flush Cart"}
      </Button>
    </Box>
  );
};

export default FlushCart;
