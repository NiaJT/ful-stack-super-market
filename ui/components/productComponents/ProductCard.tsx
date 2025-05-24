import { Box, Typography, Button, Chip, Tooltip } from "@mui/material";
import Image from "next/image";
import { IProductCard } from "../sellerComponents/SellerCardContainer";
import { useRouter } from "next/navigation";
import { noProductImage } from "@/constants/noproductImage";
import { useState } from "react";

const ProductCard = (props: IProductCard) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  return (
    <Box className="w-[280px] h-[440px] rounded-2xl shadow-xl bg-gradient-to-br from-white/80 via-green-50 to-green-100 backdrop-blur-xl overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.025] hover:shadow-green-300/50 flex flex-col border border-green-100">
      {/* Image Section */}
      <Box className="relative w-full pt-[56.25%] bg-gradient-to-br from-green-50 to-green-200 cursor-pointer overflow-hidden group flex-grow">
        <Box className="absolute top-1/2 left-1/2 w-[85%] h-[62%] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-105">
          <Image
            onClick={() => router.push(`/product-detail/${props._id}`)}
            src={imageError ? noProductImage : props.image || noProductImage}
            alt={props.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 280px"
            style={{
              objectFit: "contain",
              padding: "10px",
              borderRadius: "14px",
              background: "#fff",
              boxShadow: "0 3px 14px 0 rgba(16,185,129,0.09)",
            }}
            priority
            onError={() => setImageError(true)}
          />
        </Box>

        {/* Out of Stock Ribbon */}
        {props.quantity === 0 && (
          <Box className="absolute top-4 right-[-36px] rotate-30 px-6 py-0.5 bg-red-600 text-white text-[12px] font-bold shadow-md z-10 tracking-wider">
            Out of Stock
          </Box>
        )}
      </Box>

      {/* Content Section */}
      <Box className="p-4 flex flex-col h-[44%]">
        <Box className="flex justify-between items-center mb-1 gap-2">
          <Tooltip title={props.name}>
            <Typography
              variant="subtitle1"
              className="font-semibold text-[#1a3a25] text-ellipsis whitespace-nowrap overflow-hidden text-[1.1rem] font-bold tracking-wide flex-grow"
            >
              {props.name}
            </Typography>
          </Tooltip>
          <Chip
            label={props.brand}
            className="bg-green-700 text-white text-[12px] font-semibold shadow"
            size="small"
          />
        </Box>

        <Typography className="text-green-700 font-extrabold text-[1.4rem] mb-1 tracking-wide">
          ${props.price.toFixed(2)}
        </Typography>

        <Typography className="text-gray-700 text-[0.98rem] font-medium line-clamp-3 min-h-[3.1em] mb-1 flex-grow">
          {props.shortDescription || "No description available."}
        </Typography>

        <Box className="flex justify-between items-center mt-auto">
          <Typography
            variant="caption"
            className={`uppercase font-semibold tracking-wide text-[0.9rem] ${
              props.quantity === 0 ? "text-red-600" : "text-green-700"
            }`}
          >
            Qty: {props.quantity}
          </Typography>
          <Button
            variant="contained"
            color="success"
            disabled={props.quantity === 0}
            onClick={() => router.push(`/product-detail/${props._id}`)}
            className="bg-green-700 hover:bg-green-800 text-white px-2.5 py-1 rounded-full font-bold text-sm shadow-md normal-case"
          >
            Details
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductCard;
