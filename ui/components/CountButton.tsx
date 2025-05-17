import React, { useState } from "react";
import { AddSharp, Remove } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

const CountButton = (props: { quantity: number }) => {
  const [count, setCount] = useState(1);

  return (
    <Box className="flex items-center space-x-4">
      <Typography variant="h6" className="min-w-max">
        Quantity:
      </Typography>

      <Box className="flex items-center space-x-2 px-3 py-1">
        <IconButton
          color="secondary"
          size="small"
          disabled={count === 1}
          onClick={() => setCount(count - 1)}
        >
          <Remove fontSize="small" />
        </IconButton>

        <Typography variant="body1" className="w-6 text-center">
          {count}
        </Typography>

        <IconButton
          color="secondary"
          size="small"
          disabled={count == props.quantity}
          onClick={() => setCount(count + 1)}
        >
          <AddSharp fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CountButton;
