import { Box, Typography } from "@mui/material";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CategoryCard = (props: { name: string; image: string }) => {
  const router = useRouter();
  const categoryName = props.name.toLowerCase();

  return (
    <Box
      onClick={() => {
        router.push(`/category/${categoryName}`);
      }}
      className="flex flex-col gap-4 justify-center items-center w-[200px] h-[250px] rounded-2xl shadow-xl bg-gradient-to-br from-white/80 via-green-50 to-green-100 backdrop-blur-xl overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.025] hover:shadow-green-300/50 border border-green-100 cursor-pointer"
    >
      <Box className="w-[180px] h-[180px] relative overflow-hidden rounded-lg">
        <Image
          src={props.image}
          alt={props.name}
          fill
          style={{ objectFit: "cover", borderRadius: "12px" }}
        />
      </Box>
      <Box>
        <Typography variant="h5" className="font-semibold text-green-800">
          {props.name}
        </Typography>
      </Box>
    </Box>
  );
};

export default CategoryCard;
