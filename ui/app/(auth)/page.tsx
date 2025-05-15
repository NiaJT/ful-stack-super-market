import React from "react";
import { NextPage } from "next";
import AddProductButton from "@/components/AddProductButton";
import DecideContainer from "@/components/DecideContainer";

const Home: NextPage = () => {
  return (
    <>
      <AddProductButton />
      <DecideContainer />
    </>
  );
};

export default Home;
