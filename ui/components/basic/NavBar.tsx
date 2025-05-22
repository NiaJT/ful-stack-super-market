"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import LogoutIcon from "@mui/icons-material/Logout";

const NavBar = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState("");
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole) {
      setRole(userRole);
    }
  }, []);
  const hasAccess = (role: string, itemName: string) => {
    const accesMatrix: Record<string, string[]> = {
      seller: ["Home", "Products", "Orders"],
      buyer: ["Home", "Products", "Cart", "Orders"],
    };
    return accesMatrix[role]?.includes(itemName);
  };

  const navLinks = [
    { name: "Home", link: "/", icon: <HomeIcon sx={{ color: "white" }} /> },
    {
      name: "Products",
      link: "/products",
      icon: <CategoryIcon sx={{ color: "white" }} />,
    },
    {
      name: "Cart",
      link: "/cart",
      icon: <ShoppingCartIcon sx={{ color: "white" }} />,
    },
    {
      name: "Orders",
      link: "/orders",
      icon: <BookmarkBorderIcon sx={{ color: "white" }} />,
    },
  ];

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const logOut = () => {
    localStorage.clear();
    router.replace("/login");
  };

  const drawer = (
    <Box className="w-[280px] h-full bg-green-500 p-6 shadow-lg flex flex-col justify-between">
      <Box>
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h6" className="text-white font-bold">
            EMart Menu
          </Typography>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon className="text-gray-700" />
          </IconButton>
        </Box>

        <Divider className="mb-4" />

        <nav>
          <ul className="flex flex-col gap-3">
            {navLinks
              .filter((item) => hasAccess(role, item.name))
              .map((item, index) => (
                <li key={index}>
                  <Button
                    startIcon={item.icon}
                    fullWidth
                    onClick={() => {
                      router.replace(item.link);
                      toggleDrawer();
                    }}
                  >
                    <Typography
                      variant="body1"
                      className="text-white font-medium"
                    >
                      {item.name}
                    </Typography>
                  </Button>
                </li>
              ))}
          </ul>
        </nav>
      </Box>

      <Box className="mt-6">
        <Button
          startIcon={<LogoutIcon sx={{ color: "white" }} />}
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: "green",
            color: "white",
            borderRadius: "10px",
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: 3,
            "&:hover": {
              backgroundColor: "#166534", // darker green
              boxShadow: 4,
            },
          }}
          onClick={logOut}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box className="bg-green-700 shadow-md w-full py-3 px-4">
      <Box className="max-w-7xl mx-auto flex items-center justify-between">
        <Typography
          variant="h5"
          className="text-white font-semibold font-playfair italic"
        >
          EMart
        </Typography>

        {/* Desktop Menu */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navLinks
              .filter((item) => hasAccess(role, item.name))
              .map((item, index) => (
                <li key={index}>
                  <Button
                    startIcon={item.icon}
                    onClick={() => router.replace(item.link)}
                    className="text-white hover:bg-green-800 normal-case"
                  >
                    <Typography
                      variant="body1"
                      className="text-white font-medium"
                    >
                      {item.name}
                    </Typography>
                  </Button>
                </li>
              ))}
            <li>
              <Button
                onClick={logOut}
                startIcon={<LogoutIcon sx={{ color: "white" }} />}
                variant="outlined"
                sx={{
                  backgroundColor: "green",
                  color: "white",
                  border: "0px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  boxShadow:
                    " rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
                  "&:hover": {
                    backgroundColor: "darkgreen",
                  },
                }}
              >
                Log Out
              </Button>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Icon */}
        <Box className="block md:hidden">
          <IconButton className="text-white" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
            anchor="right"
            PaperProps={{
              sx: {
                width: 280,
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
    </Box>
  );
};

export default NavBar;
