"use client";
import * as React from "react";
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
} from "@mui/material";
import { SearchRounded } from "@mui/icons-material";
import { categories } from "./../buyerComponents/CategoryList";

const sortMethods = ["Latest", "Oldest", "A-Z", "Z-A"];

const ProductFilter = () => {
  const [category, setCategory] = React.useState("");
  const [sortBy, setSortBy] = React.useState("");

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleSearch = () => {
    console.log({ category, sortBy });
    // Add logic to navigate or filter
  };

  return (
    <Box
      className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-3xl mx-auto mt-6 px-4"
    >
      <Typography variant="h6" className="text-gray-800 font-semibold">
        Filter
      </Typography>

      <FormControl size="small" sx={{ minWidth: 120 }}>
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

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
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
        onClick={handleSearch}
        sx={{
          backgroundColor: "#22c55e",
          color: "white",
          "&:hover": {
            backgroundColor: "#16a34a",
          },
          width: 40,
          height: 40,
        }}
      >
        <SearchRounded />
      </IconButton>
    </Box>
  );
};

export default ProductFilter;
