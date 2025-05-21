"use client";
import getUserRole from "@/utilities/get.user.role";
import React, { useEffect, useState } from "react";
import SellerCardContainer from "../sellerComponents/SellerCardContainer";
import BuyerCardContainer from "../buyerComponents/BuyerCardContainer";

const DecideContainer = () => {
  const [role, setRole] = useState("");
  useEffect(() => {
    const userRole = getUserRole() as string;
    setRole(userRole);
  }, []);
  console.log(role);
  if (role === "seller") return <SellerCardContainer userRole={role} />;
  if (role === "buyer") return <BuyerCardContainer userRole={role} />;
};

export default DecideContainer;
