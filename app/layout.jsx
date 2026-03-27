import { Poppins, Open_Sans } from "next/font/google";
import LayoutWrapper from "@/components/LayoutWrapper";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "ULAB Scholar Space | Scholar Space",
  description: "A smart study and collaboration system for ULAB students.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={`${poppins.variable} ${openSans.variable} font-sans min-h-screen flex flex-col bg-[#f3f4f6] text-gray-600`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
