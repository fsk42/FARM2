import AuthForm from "@/components/AuthForm";
import React from "react";
import { Toaster } from "sonner";

const SignIn = () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <Toaster />
      <AuthForm type="sign-in" />
    </section>
  );
};

export default SignIn;
