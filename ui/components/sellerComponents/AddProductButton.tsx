"use client";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
const AddProductButton: React.FC = () => {
  const router = useRouter();
  return (
    <Box className="mt-8">
      <Button
        startIcon={<AddBoxIcon />}
        variant="contained"
        color="success"
        onClick={() => {
          router.push("/add-product");
        }}
      >
        Add Product
      </Button>
    </Box>
  );
};

export default AddProductButton;
