import {Button } from "@mui/material";
import React from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const BuyButton = () => {
  return (
      <Button
      fullWidth
      variant="contained"
      color="primary"
      startIcon={<AttachMoneyIcon />}
        
      onClick={() => {
        console.log("Buy this product");
      }}
    >
      Buy now
    </Button>
   
  );
};

export default BuyButton;
