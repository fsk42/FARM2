import { logoutAccount } from "@/lib/actions/user.actions";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";

import React from "react";

const Footer = ({ user, type = "desktop" }: FooterProps) => {
  const router = useRouter();
  const handleLogout = async () => {
    const loggedOut = await logoutAccount();

    if (loggedOut) {
      router.push("/sign-in");
    }
  };
  return (
    <footer className="footer">
      <div className={type === "mobile" ? "footer_name-mobile" : "footer_name"}>
      <p className="text-xl font-bold text-gray-700">
  {typeof user?.firstName === "string" && user.firstName.length > 0 ? user.firstName[0] : 'G'}
</p>
      </div>

      <div
        className={type === "mobile" ? "footer_email-mobile" : "footer_email"}
      >
        <h1 className="text-14 font-bold text-gray-700 ">
          {user?.firstName + " " + user?.lastName}
        </h1>
        <p className=" text-14 text-gray-700">{user?.email}</p>
      </div>
      <div className="footer_image" onClick={handleLogout}>
        <Image src="/icons/logout.png" fill alt={""} />
      </div>
    </footer>
  );
};

export default Footer;
