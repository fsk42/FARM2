"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomInput from "./CustomInput";
import { authFormSchema } from "@/lib/utils";
import PageLoader from "next/dist/client/page-loader";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";
const AuthForm = ({ type }: { type: string }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const [user, setuser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      passwort: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const newUser = await signUp(data);
        setuser(newUser);
        if (newUser) {
          toast.success("Erfolgreich registriert!");
        } else {
          toast.error("Registrierung fehlgeschlagen!");
        }
      }
      if (type === "sign-in") {
        const response = await signIn({
          email: data.email,
          passwort: data.passwort,
        });
        if (response) {
          router.push("/");
          toast.success("Erfolgreich angemeldet!");
        } else {
          toast.error("Email oder Passwort sind falsch!");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="auth-form">
      <div className="bg-white p-8 rounded-3xl">
        <header className="flex flex-col gap-5 md-gap-8">
          <Link href="/" className=" flex cursor-pointer items-center gap-1">
            <Image src="/icons/instagram-icon.png" width={34} height={34} alt={""} />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-back-1">
              {" "}
              Instagram Uploader
            </h1>
          </Link>
          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
              {user
                ? "Link Account"
                : type === "sign-in"
                ? "Anmelden"
                : "Registrieren"}
              <p className="text-16 font-normal text-gray-600">
                {user
                  ? "Verbinde deinen Account, um zu starten"
                  : "Bitte gebe deine Informationen ein"}
              </p>
            </h1>
          </div>
        </header>
        {user ? (
          <div className="flex flex-col gap-4">{}</div>
        ) : (
          <>
            {" "}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {type === "sign-up" && (
                  <>
                    <div className="flex gap-4">
                      <CustomInput
                        control={form.control}
                        name="firstName"
                        label="Vorname"
                        placeholder="Gebe deinen Vornamen ein"
                      />
                      <CustomInput
                        control={form.control}
                        name="lastName"
                        label="Nachname"
                        placeholder="Gebe deinen Nachnamen ein"
                      />
                    </div>

                    <CustomInput
                      control={form.control}
                      name="course"
                      label="Kurs"
                      placeholder="z.B. WWI2023C"
                    />
                  </>
                )}

                <CustomInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Gebe deine Email ein"
                />
                <CustomInput
                  control={form.control}
                  name="passwort"
                  label="Passwort"
                  placeholder="Gebe dein Passwort ein"
                />
                <div className="flex flex-col">
                  <Button
                    type="submit"
                    className="form-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" /> &nbsp;
                        Lade...
                      </>
                    ) : type === "sign-in" ? (
                      "Anmelden"
                    ) : (
                      " Registrieren"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
            <footer className="flex justify-center gap-1">
              <p className="text-14 font-normal text-gray-600">
                {type === "sign-in"
                  ? "Noch keinen Account?"
                  : "Bereits einen Account?"}
              </p>
              <Link
                href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                className="form-link"
              >
                {type === "sign-in" ? "Registrieren" : "Anmelden"}
              </Link>
            </footer>
          </>
        )}
      </div>
    </section>
  );
};

export default AuthForm;
