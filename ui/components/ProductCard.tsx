import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import { IProductCard } from "./SellerCardContainer";
import { useRouter } from "next/navigation";

const ProductCard = (props: IProductCard) => {
  const router = useRouter();
  return (
    <Box
      className="w-[320px] h-[400px] rounded-3xl shadow-2xl bg-white/70 backdrop-blur-md overflow-hidden 
                 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col"
    >
      <Box className="relative h-[180px] w-full cursor-pointer overflow-hidden">
        <Image
          onClick={() => {
            router.push(`/product-detail/${props._id}`);
          }}
          src="/mouseImage.jpg"
          alt="Wireless Mouse"
          fill
          className="object-contain transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 400px) 100vw, 50vw"
          priority
        />
      </Box>
      <Box className="p-3 flex flex-col flex-grow justify-between">
        <Box>
          <Box className="flex justify-between items-center">
            <Typography variant="h6">{props.name}</Typography>
            <Typography className="bg-green-600 text-white px-2 py-1 rounded-full text-xs shadow-md">
              {props.brand}
            </Typography>
          </Box>

          <Typography className="text-lg font-extrabold text-green-600">
            {props.price}
          </Typography>

          <Typography className="text-xs text-gray-600">
            {props.shortDescription}...
          </Typography>
        </Box>

        <Box className="flex gap-1 mt-2">
          {/* <Button fullWidth variant="contained" color="success" size="small">
            Add to Cart
          </Button> */}
          <Button
            fullWidth
            variant="contained"
            color="success"
            size="small"
            onClick={() => {
              router.push(`/product-detail/${props._id}`);
            }}
          >
            Details
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductCard;
