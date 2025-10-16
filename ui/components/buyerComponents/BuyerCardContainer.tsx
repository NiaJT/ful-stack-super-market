"use client";
import { IProduct } from "@/interface/product.interface";
import { axiosInstance } from "@/lib/axios.instance";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  Pagination,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ProductCard from "../productComponents/ProductCard";
import CategoryList from "./CategoryList";

const BuyerCardContainer = (props: { userRole: string }) => {
  const [currentPage, setPage] = useState(1);

  const { isPending, data, isError, error } = useQuery({
    queryKey: ["product-list-buyer", currentPage],
    queryFn: async () => {
      return await axiosInstance.post("/product/buyer/list", {
        page: currentPage,
        limit: 8,
      });
    },
    enabled: props.userRole === "buyer",
  });

  const productList: IProduct[] = data?.data?.productList;
  const totalPages: number = data?.data?.totalPages;

  if (isPending) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    toast.error(error.message);
    return null;
  }

  return (
    <Box className="min-h-screen py-12 px-4 bg-gray-50">
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h2"
          className="text-center mb-8 font-bold"
        >
          Browse Products
        </Typography>

        {/* Categories */}
        <Box className="mb-12">
          <CategoryList />
        </Box>

        {/* Product Grid */}
        <Box className="flex flex-wrap justify-center gap-6">
          {productList?.length > 0 ? (
            productList.map((item) => (
              <Box key={item._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <ProductCard {...item} />
              </Box>
            ))
          ) : (
            <Typography variant="body1" className="text-center">
              No products available.
            </Typography>
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box className="flex justify-center mt-10">
            <Pagination
              page={currentPage}
              count={totalPages}
              color="primary"
              onChange={(_, value: number) => setPage(value)}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BuyerCardContainer;
