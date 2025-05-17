"use client";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GuestGuard = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      router.replace("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h5" className="text-center text-gray-600">
          Checking your authentication...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export default GuestGuard;
