import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";

const category = [
  { name: "Electronics", image: "/categoryImages/electronics.jpg" },
  { name: "Clothing", image: "/categoryImages/clothing.jpg" },
  { name: "Furniture", image: "/categoryImages/furniture.jpg" },
  { name: "Grocery", image: "/categoryImages/grocery.jpg" },
  { name: "Sports", image: "/categoryImages/sports.jpg" },
  { name: "Kids", image: "/categoryImages/kids.jpg" },
  { name: "Kitchen", image: "/categoryImages/kitchen.jpg" },
  { name: "Electrical", image: "/categoryImages/electrical.jpg" },
];

const CategoryContainer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < category.length - 1 ? prev + 1 : 0));
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const child = scrollRef.current.children[currentIndex] as HTMLElement;
      child?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  return (
    <Box className="w-full bg-green-50 py-8">
      <Box className="w-[90%] md:w-[85%] mx-auto">
        <Typography
          variant="h4"
          className="text-center font-bold text-green-800 mb-6"
        >
          Shop by Category
        </Typography>

        <Box
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory custom-scrollbar px-2"
        >
          {category.map((item, index) => (
            <Box
              key={index}
              className="flex-shrink-0 snap-start w-[70%] sm:w-[45%] md:w-[30%] lg:w-[22%] xl:w-[200px]"
            >
              <CategoryCard name={item.name} image={item.image} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryContainer;
