"use client";
import "./globals.css";
import Navbar from "./components/navbar/page";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
 
  const pathname = usePathname();

  // hide navbar for auth routes
  const hideNavbar = pathname.startsWith("/auth");

  return (
    <html lang="en">
      <body >
        {/* hide Navbar */}
        {!hideNavbar && <Navbar />}
        {children}
      </body>
    </html>
  );
}