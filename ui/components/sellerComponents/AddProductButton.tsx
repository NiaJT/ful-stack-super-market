"use client";
import { Box, Fab, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

const AddProductButton: React.FC = () => {
  const router = useRouter();

  return (
    <Box className="flex right-8 bottom-8 fixed z-50">
      <Tooltip title="Add Product" arrow placement="left">
        <Fab
          color="success"
          aria-label="add"
          onClick={() => router.push("/add-product")}
        >
          <AddIcon fontSize="large" />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default AddProductButton;
