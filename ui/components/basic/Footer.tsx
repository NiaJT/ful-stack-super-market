import { Box, Typography, Link, Button } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import { SvgIconComponent } from "@mui/icons-material";

const Footer = () => {
  const categories = [
    "grocery",
    "clothing",
    "kids",
    "kitchen",
    "electronics",
    "furniture",
    "electrical",
    "sports",
  ];
  const paymentMethods = [
    "Esewa",
    "Khalti",
    "Mobile Banking",
    "Cash on Delivery",
  ];
  const socialMedias = ["Facebook", "Twitter", "Instagram"];
  const iconMap: Record<string, SvgIconComponent> = {
    Facebook: FacebookIcon,
    Twitter: TwitterIcon,
    Instagram: InstagramIcon,
  };
  return (
    <Box className="bg-gray-900 text-white mt-16 py-12 w-full">
      <Box className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between gap-12">
        <Box className="flex-1">
          <Typography variant="h6" className="text-green-400 font-bold mb-3">
            EMart
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            Your trusted online grocery store delivering fresh produce and
            household essentials straight to your door.
          </Typography>
        </Box>

        <Box className="flex-1">
          <Typography variant="h6" className="text-green-400 font-bold mb-3">
            Categories
          </Typography>
          <Box className="flex flex-col gap-2">
            {categories.map((item) => (
              <Link
                key={item}
                href="#"
                className="capitalize text-gray-400 hover:text-green-400 transition"
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>
        <Box className="flex-1">
          <Typography variant="h6" className="text-green-400 font-bold mb-3">
            Payment Methods
          </Typography>
          <Box className="flex flex-col gap-2">
            {paymentMethods.map((item) => (
              <Link
                key={item}
                href="#"
                className="capitalize text-gray-400 hover:text-green-400 transition"
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>
        <Box className="flex-1">
          <Typography variant="h6" className="text-green-400 font-bold mb-3">
            Support
          </Typography>
          <Box className="flex flex-col gap-2">
            {["Contact Us", "FAQ", "Shipping Policy", "Returns & Refunds"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition"
                >
                  {item}
                </Link>
              )
            )}
          </Box>
        </Box>

        <Box className="flex-1">
          <Typography variant="h6" className="text-green-400 font-bold mb-3">
            About Us
          </Typography>
          <Box className="text-gray-400 text-sm mb-4 space-y-1">
            <p>New Road, Bishal Bazaar</p>
            <p>Kathmandu 44600, Nepal</p>
            <p>Email: support@emart.com</p>
            <p>Phone: +977-1-4234567</p>
          </Box>{" "}
          <Typography variant="h6" className="text-green-400 font-bold mb-3">
            Follow Us On
          </Typography>
          <Box className="flex gap-3">
            {socialMedias.map((name) => {
              const IconComponent = iconMap[name];
              return (
                <Button
                  startIcon={<IconComponent />}
                  key={name}
                  size="small"
                  variant="contained"
                ></Button>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Box className="border-t border-gray-800 mt-10 pt-6 text-center px-4">
        <Typography variant="body2" className="text-gray-400">
          © 2024 EMart. All rights reserved. |
          <Link href="#" className="ml-2 text-gray-400 hover:text-green-400">
            Privacy Policy
          </Link>{" "}
          |
          <Link href="#" className="ml-2 text-gray-400 hover:text-green-400">
            Terms of Service
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
