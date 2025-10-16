"use client";
import React, { useState } from "react";
import {
  Box,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  IconButton,
  Typography,
  Pagination,
} from "@mui/material";
import { SearchRounded } from "@mui/icons-material";
import { categories } from "./../buyerComponents/CategoryList";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import toast from "react-hot-toast";
import ProductCard from "./ProductCard";
import { IResponse } from "@/interface/response.interface";
import { IError } from "@/interface/error.interface";
import { IProduct } from "@/interface/product.interface";

interface ISortValues {
  category: string;
  sortby: string;
  page: number;
  limit: number;
}

const sortMethods = ["Price: Low to High", "Price: High to Low", "A-Z", "Z-A"];

const ProductFilter = () => {
  const [category, setCategory] = useState("");
  const [sortby, setSortby] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { mutate, data } = useMutation({
    mutationKey: ["Sort-products", currentPage],
    mutationFn: async (value: ISortValues) => {
      const response = await axiosInstance.post(
        "/product/buyer/sortlist",
        value
      );
      return response;
    },
    onSuccess: (res: IResponse) => {
      toast.success(res.data.message);
    },
    onError: (error: IError) => {
      toast.error(error.response.data.message);
    },
  });

  const productList: IProduct[] = data?.data?.productList || [];
  const totalPages: number = data?.data?.totalPages || 1;

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortby(event.target.value);
  };

  return (
    <Box>
      <Box className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-3xl mx-auto mt-6 px-4">
        <Typography variant="h6" className="text-gray-800 font-semibold">
          Filter
        </Typography>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            input={<OutlinedInput label="Category" />}
          >
            {categories.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortby}
            onChange={handleSortByChange}
            input={<OutlinedInput label="Sort By" />}
          >
            {sortMethods.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          onClick={() => {
            mutate({ category, sortby, page: currentPage, limit: 5 });
          }}
          sx={{
            backgroundColor: "#22c55e",
            color: "white",
            "&:hover": { backgroundColor: "#16a34a" },
            width: 40,
            height: 40,
          }}
        >
          <SearchRounded />
        </IconButton>
      </Box>
      <Box className="flex flex-col justify-center items-center m-8 gap-4 w-full">
        <Box className="flex flex-wrap justify-center items-center gap-4">
          {productList.map((item) => (
            <ProductCard key={item._id} {...item} />
          ))}
        </Box>

        {productList.length > 0 && (
          <Pagination
            page={currentPage}
            count={totalPages}
            color="secondary"
            onChange={(_, value: number) => {
              setCurrentPage(value);
              mutate({ category, sortby, page: value, limit: 5 });
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProductFilter;
