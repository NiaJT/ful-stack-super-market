"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Drawer,
  Divider,
  Badge,
  Avatar,
  Tooltip,
  MenuItem,
  Menu,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Category as CategoryIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.instance";
import { IError } from "@/interface/error.interface";
import GreetUser from "./GreetUser";

const NavBar = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    const userName = localStorage.getItem("firstName");
    if (userRole) setRole(userRole);
    if (userName) setUserName(userName);
  }, []);
  const initial = userName?.charAt(0)?.toUpperCase() || "U";
  const { data: cartCount = 0 } = useQuery<number, IError>({
    queryKey: ["get-cart-items-count"],
    queryFn: async () => {
      const res = await axiosInstance.get("/cart/item/count");
      return res.data.cartCount;
    },
    enabled: role === "buyer",
  });

  const navLinks = [
    { name: "Home", link: "/", icon: <HomeIcon className="text-white" /> },
    {
      name: "Products",
      link: "/products",
      icon: <CategoryIcon className="text-white" />,
    },
    {
      name: "Orders",
      link: "/orders",
      icon: <BookmarkBorderIcon className="text-white" />,
    },
  ];

  const handleNavigate = (link: string) => {
    router.replace(link);
    setMobileOpen(false);
  };

  const logOut = () => {
    localStorage.clear();
    router.replace("/login");
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawerContent = (
    <Box className="w-[280px] h-full bg-green-500 p-6 flex flex-col justify-between">
      <Box>
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h6" className="text-white font-bold">
            EMart Menu
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon className="text-gray-700" />
          </IconButton>
        </Box>

        <Divider className="mb-4 bg-white/40" />

        <ul className="flex flex-col gap-3">
          <li>
            <GreetUser />
          </li>

          {navLinks.map((item, idx) => (
            <li key={idx}>
              <Button
                fullWidth
                startIcon={item.icon}
                className="justify-start normal-case text-white hover:bg-green-600"
                onClick={() => handleNavigate(item.link)}
              >
                <Box className="text-white">{item.name}</Box>
              </Button>
            </li>
          ))}
          {role === "buyer" && (
            <li>
              <Button
                fullWidth
                startIcon={
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCartIcon className="text-white" />
                  </Badge>
                }
                className="justify-start normal-case text-white hover:bg-green-600"
                onClick={() => handleNavigate("/cart")}
              >
                <Box className="text-white">Cart</Box>
              </Button>
            </li>
          )}
        </ul>
      </Box>
      <Box>
        <Box className="flex items-center gap-3 mb-3">
          <Avatar sx={{ bgcolor: "purple", width: 36, height: 36 }}>
            {initial}
          </Avatar>
          <Typography className="text-white font-semibold">
            {userName}
          </Typography>
        </Box>
        <Button
          fullWidth
          startIcon={<LogoutIcon className="text-white" />}
          className="bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 normal-case"
          onClick={logOut}
        >
          <Box className="text-white font-bold">Log Out</Box>
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box className="bg-green-700 w-full py-3 px-4 shadow">
      <Box className="max-w-7xl mx-auto flex items-center justify-between">
        <Typography variant="h5" className="text-white font-semibold italic">
          EMart
        </Typography>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          <GreetUser />
          <Divider orientation="vertical" className="h-6 bg-white/40" />
          {navLinks.map((item, idx) => (
            <Tooltip key={idx} title={item.name} placement="bottom" arrow>
              <Button
                startIcon={item.icon}
                className="text-white hover:bg-green-800 normal-case"
                onClick={() => router.replace(item.link)}
              >
                <Box className="text-white">{item.name}</Box>
              </Button>
            </Tooltip>
          ))}
          {role === "buyer" && (
            <Tooltip title="Cart" placement="bottom" arrow>
              <Button
                startIcon={
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCartIcon className="text-white" />
                  </Badge>
                }
                className="text-white hover:bg-green-800 normal-case"
                onClick={() => router.push("/cart")}
              >
                <Box className="text-white">Cart</Box>
              </Button>
            </Tooltip>
          )}
          <Box>
            <Tooltip title="Account" placement="bottom" arrow>
              <IconButton onClick={handleMenuOpen}>
                <Avatar sx={{ bgcolor: "purple" }}>{initial}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  bgcolor: "green.700",
                  color: "white",
                  mt: 1,
                },
              }}
            >
              <MenuItem disabled>{userName}</MenuItem>
              <MenuItem onClick={logOut}>
                <LogoutIcon fontSize="small" className="mr-2" /> Log Out
              </MenuItem>
            </Menu>
          </Box>
        </nav>

        {/* Mobile Menu Icon */}
        <Box className="md:hidden">
          <IconButton onClick={() => setMobileOpen(true)}>
            <MenuIcon className="text-white" />
          </IconButton>
          <Drawer
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            anchor="left"
            ModalProps={{ keepMounted: true }}
          >
            {drawerContent}
          </Drawer>
        </Box>
      </Box>
    </Box>
  );
};

export default NavBar;
