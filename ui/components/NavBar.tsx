"use client";
import React, { useState } from "react";
import { Box, Button, Typography, IconButton, Drawer } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";

const NavBar = () => {
  const navLinks = ["Home", "Products", "About", "Contact"];
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };
  const logOut = () => {
    window.localStorage.clear();
    router.replace("/login");
  };
  const drawer = (
    <Box className="w-[250px] h-full bg-white p-4">
      <Box className="flex justify-end mb-6">
        <IconButton onClick={toggleDrawer}>
          <CloseIcon className="text-gray-700" />
        </IconButton>
      </Box>
      <nav>
        <ul className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <li
              key={link}
              className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 cursor-pointer"
            >
              <a href="#" className="block font-medium">
                {link}
              </a>
            </li>
          ))}
          <li className="mt-6">
            <Button
              fullWidth
              variant="contained"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={logOut}
            >
              Log Out
            </Button>
          </li>
        </ul>
      </nav>
    </Box>
  );

  return (
    <Box className="bg-green-700 shadow-sm w-full py-3 px-4">
      <Box className="max-w-7xl mx-auto flex items-center justify-between">
        <Typography
          variant="h5"
          className="text-white font-semibold font-playfair italic"
        >
          EMart
        </Typography>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-8 text-green-100">
            {navLinks.map((link) => (
              <li
                key={link}
                className="hover:text-white cursor-pointer font-medium"
              >
                <a href="#">{link}</a>
              </li>
            ))}
            <li>
              <Button
                onClick={logOut}
                variant="outlined"
                sx={{
                  backgroundColor: "white",
                  color: "green",
                  borderColor: "green",
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: "#f0fdf4",
                    borderColor: "darkgreen",
                  },
                }}
              >
                Log Out
              </Button>
            </li>
          </ul>
        </nav>

        <Box className="block md:hidden">
          <IconButton className="text-white" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
    </Box>
  );
};

export default NavBar;
