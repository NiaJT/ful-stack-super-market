"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import { Box, CircularProgress, Pagination } from "@mui/material";
import ProductCard from "../productComponents/ProductCard";
import toast from "react-hot-toast";
import { IProduct } from "@/interface/product.interface";
import getUserRole from "@/utilities/get.user.role";
import { useParams } from "next/navigation";
const CategoryCardContainer = () => {
  const category = useParams().category;
  console.log(category);
  const [currentPage, setPage] = useState(1);
  const { isPending, data, isError, error } = useQuery({
    queryKey: ["product-list-buyer", currentPage],
    queryFn: async () => {
      return await axiosInstance.post(
        `/product/buyer/category-list/${category}`,
        {
          page: currentPage,
          limit: 10,
        }
      );
    },
    enabled: getUserRole() === "buyer",
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
    <>
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
    </>
  );
};

export default CategoryCardContainer;
