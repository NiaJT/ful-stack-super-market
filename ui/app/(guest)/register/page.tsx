import RegisterForm from "@/components/RegisterForm";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Register",
  description: "This is a Register page",
};

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
