import LoginForm from "@/components/guestForms/LoginForm";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Login",
  description: "This is a login page",
};
const LoginPage = () => {
  return <LoginForm />;
};

export default LoginPage;
