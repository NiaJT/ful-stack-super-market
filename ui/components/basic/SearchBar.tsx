"use client";
import { Autocomplete, Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import { axiosInstance } from "@/lib/axios.instance";
import axios, { CancelTokenSource } from "axios";
import { useRouter } from "next/navigation";
type Product = {
  name: string;
  _id: string;
};

const SearchBar = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    let cancelToken: CancelTokenSource;

    const delayDebounce = setTimeout(() => {
      if (input.trim()) {
        const fetchProducts = async () => {
          try {
            cancelToken = axios.CancelToken.source();
            const response = await axiosInstance.post(
              "/product/search",
              { search: input.trim() },
              { cancelToken: cancelToken.token }
            );
            setSuggestions(response.data.products || []);
          } catch (error) {
            if (axios.isCancel(error)) {
              console.log("Previous request canceled", error.message);
            } else {
              console.error("Search error:", error);
            }
          }
        };
        fetchProducts();
      } else {
        setSuggestions([]);
      }
    }, 500);

    // Cancel previous request & clear debounce if input changes fast
    return () => {
      clearTimeout(delayDebounce);
      if (cancelToken)
        cancelToken.cancel("Operation canceled due to new request.");
    };
  }, [input]);

  return (
    <Box className="flex gap-2 items-center w-[60%] h-12 max-w-md mx-auto bg-gray-100 px-3 py-2 rounded-lg shadow">
      <Autocomplete
        freeSolo
        disableClearable
        options={
          suggestions.length > 0
            ? suggestions
            : [{ name: "No product Found", _id: "0" }]
        }
        getOptionLabel={(option) => option.name || ""}
        onInputChange={(_, newInput) => setInput(newInput)}
        onChange={(_, newValue) => {
          setSelectedProduct(newValue);
          if (newValue && newValue._id !== "0") {
            router.replace(`/product-detail/${newValue._id}`);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Search for products"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
                "&:hover fieldset": { border: "none" },
                "&.Mui-focused fieldset": { border: "none" },
              },
            }}
          />
        )}
        // 👇 Style the dropdown and options here
        componentsProps={{
          paper: {
            sx: {
              backgroundColor: "#f0fdf4", // 🌿 Light green background for dropdown
            },
          },
        }}
        sx={{
          width: "100%",
          "& .MuiAutocomplete-option": {
            backgroundColor: "#f0fdf4", // match dropdown background
            "&[aria-selected='true']": {
              backgroundColor: "#bbf7d0", // selected item
            },
            "&:hover": {
              backgroundColor: "#bbf7d0", // hover effect
            },
          },
        }}
      />

      <SearchSharpIcon color="info" />
    </Box>
  );
};

export default SearchBar;
