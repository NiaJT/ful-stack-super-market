import React, { useState } from "react";
import { AddSharp, Remove } from "@mui/icons-material";
import { Box } from "@mui/material";
const CountButton = () => {
  const [count, setCount] = useState(1);
  return (
          <Box className="flex justify-center" >
        Quantity:
        <Remove  color="secondary"
          onClick={() => {
            setCount(count > 1 ? count - 1 : count);
          }}
        ></Remove>
         {count}
        <AddSharp  color="secondary"
          onClick={() => {
            setCount(count + 1);
          }}
        ></AddSharp>
      </Box>
   
  );
};

export default CountButton;
