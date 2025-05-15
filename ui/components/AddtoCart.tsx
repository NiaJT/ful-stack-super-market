import React from "react";
import {  Button } from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const AddtoCart = () => {
  return (
 
      <Button fullWidth
        variant="contained"
        color="secondary"
        startIcon={<ShoppingCartIcon />}
          
        onClick={() => {
          console.log(`added item to cart`);
        }}
      >
        Add to Cart
      </Button>
   
  );
};

export default AddtoCart;
