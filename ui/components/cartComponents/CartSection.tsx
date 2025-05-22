"use client";
import React, { useEffect, useState } from "react";
import CartItems from "./CartItems";
import CartAmount from "./CartAmount";
import { useRouter } from "next/navigation";

const CartSection = () => {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole === "seller") {
      router.replace("/");
      return;
    } else {
      setAllowed(true);
    }
  }, [router]);

  return (
    <>
      {allowed && (
        <>
          <CartItems />
          <CartAmount />
        </>
      )}
    </>
  );
};

export default CartSection;
