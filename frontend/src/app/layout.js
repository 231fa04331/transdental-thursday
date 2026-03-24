import { Cinzel, Poppins } from "next/font/google";
import "./globals.css";
import RotatingBackground from "@/components/RotatingBackground";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata = {
  title: "Temple Spiritual Management System",
  description: "Devotional dashboard for students and admin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${cinzel.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col relative">
        <RotatingBackground />
        <div className="relative z-10 flex min-h-full flex-col">{children}</div>
      </body>
    </html>
  );
}
