"use client";
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import { axiosInstance } from "@/lib/axios.instance";

const SearchBar = () => {
  const [suggestions, setSuggesstions] = useState("");
  const [input, setInput] = useState("");
  useEffect(() => {
    if (input) {
      const fetchProducts = async () => {
        const suggestionList = await axiosInstance.post("/product/search", {
          search: input,
        });
        setSuggesstions(suggestionList.data);
        console.log(suggestions);
      };
      fetchProducts();
    }
  }, [input]);

  return (
    <Box className="flex gap-2 items-center w-[60%] h-12 max-w-md mx-auto bg-gray-100 px-3 py-2 rounded-lg shadow">
      <input
        type="text"
        placeholder="Search for products..."
        className="w-full p-2 focus:outline-none"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <SearchSharpIcon color="info" />
    </Box>
  );
};

export default SearchBar;
