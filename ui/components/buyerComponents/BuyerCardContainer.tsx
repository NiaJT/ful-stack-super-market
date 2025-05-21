"use client";
import { IProduct } from "@/interface/product.interface";
import { axiosInstance } from "@/lib/axios.instance";
import { Box, CircularProgress, Pagination } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../productComponents/ProductCard";

const BuyerCardContainer = (props: { userRole: string }) => {
  const [currentPage, setPage] = useState(1);
  const { isPending, data, isError, error } = useQuery({
    queryKey: ["product-list-buyer", currentPage],
    queryFn: async () => {
      return await axiosInstance.post("/product/buyer/list", {
        page: currentPage,
        limit: 5,
      });
    },
    enabled: props.userRole === "buyer",
  });
  const productList: IProduct[] = data?.data?.productList;
  console.log(productList);
  const totalPages: number = data?.data?.totalPages;
  console.log(totalPages);
  if (isPending) {
    return <CircularProgress />;
  }
  if (isError) {
    toast.error(error.message);
    return;
  }

  return (
    <Box className="flex flex-col justify-center items-center m-8 gap-4 ">
      <Box className="flex flex-wrap justify-center items-center m-8 gap-4">
        {productList.map((item) => {
          return <ProductCard key={item._id} {...item} />;
        })}
      </Box>
      <Pagination
        page={currentPage}
        count={totalPages}
        color="secondary"
        onChange={(_, value: number) => {
          setPage(value);
        }}
      />
    </Box>
  );
};

export default BuyerCardContainer;
