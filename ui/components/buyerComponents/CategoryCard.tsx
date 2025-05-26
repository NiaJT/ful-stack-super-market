import { Box, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";

const CategoryCard = () => {
  return (
    <Box className="flex flex-col gap-4 justify-center items-center w-[200px] h-[250px] mt-4 rounded-2xl shadow-xl bg-gradient-to-br from-white/80 via-green-50 to-green-100 backdrop-blur-xl overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.025] hover:shadow-green-300/50 border border-green-100">
      <Image src="/mouseImage.jpg" alt="Mouse" width={180} height={100} />
      <Box>
        <Typography
          variant="h5"
          className="font-semibold text-green-800"
        >
          Category Name
        </Typography>
      </Box>
    </Box>
  );
};

export default CategoryCard;
