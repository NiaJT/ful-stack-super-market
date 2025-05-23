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
    <Box
      className="w-[280px] h-[440px] rounded-2xl shadow-xl bg-gradient-to-br from-white/80 via-green-50 to-green-100 backdrop-blur-xl overflow-hidden 
                 transition-transform duration-300 hover:-translate-y-2 hover:scale-[1.025] hover:shadow-green-300/50 flex flex-col border border-green-100"
    >
      {/* Image Container */}
      <Box
        className="relative w-full cursor-pointer overflow-hidden group"
        sx={{
          flexGrow: 1,
          paddingTop: "56.25%",
          background: "linear-gradient(135deg, #f0fdf4 70%, #bbf7d0 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "85%",
            height: "62%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s",
          }}
          className="group-hover:scale-105"
        >
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
        {/* Status Ribbon */}
        {props.quantity === 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 15,
              right: -36,
              bgcolor: "error.main",
              color: "#fff",
              transform: "rotate(30deg)",
              px: 6,
              py: 0.5,
              fontWeight: 700,
              fontSize: 12,
              boxShadow: 2,
              zIndex: 2,
              letterSpacing: 1,
            }}
          >
            Out of Stock
          </Box>
        )}
      </Box>

      {/* Content Section */}
      <Box className="p-4 flex flex-col" sx={{ height: "44%" }}>
        <Box className="flex justify-between items-center mb-1 gap-2">
          <Tooltip title={props.name}>
            <Typography
              variant="subtitle1"
              className="font-semibold"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flexGrow: 1,
                color: "#1a3a25",
                fontWeight: 700,
                letterSpacing: 0.1,
                fontSize: "1.1rem",
              }}
            >
              {props.name}
            </Typography>
          </Tooltip>
          <Chip
            label={props.brand}
            className="bg-green-700 text-white px-2 py-1 text-xs shadow-lg"
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: 0.5,
              bgcolor: "green.700",
            }}
          />
        </Box>

        <Typography
          className="text-xl font-extrabold text-green-700 mb-1"
          variant="h6"
          sx={{
            fontWeight: 800,
            color: "#059669",
            letterSpacing: 0.4,
            fontSize: "1.4rem",
          }}
        >
          ${props.price.toFixed(2)}
        </Typography>

        {/* Fixed Description Styling */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            minHeight: "3.1em", // ~3 lines of text space
            mb: 1,
            flexGrow: 1,
            fontSize: "0.98rem",
            color: "#374151",
            fontWeight: 500,
          }}
        >
          {props.shortDescription || "No description available."}
        </Typography>

        <Box className="flex justify-between items-center mt-auto">
          <Typography
            variant="caption"
            className="text-green-700"
            sx={{
              fontWeight: 600,
              color: props.quantity === 0 ? "#dc2626" : "#059669",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              fontSize: "0.9rem",
            }}
          >
            Qty: {props.quantity}
          </Typography>
          <Button
            variant="contained"
            color="success"
            disabled={props.quantity === 0}
            onClick={() => router.push(`/product-detail/${props._id}`)}
            sx={{
              bgcolor: "green.700",
              "&:hover": { bgcolor: "green.800" },
              px: 2.5,
              py: 0.7,
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: 14,
              minWidth: 0,
              boxShadow: "0 2px 10px 0 rgba(16,185,129,0.11)",
              textTransform: "none",
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
