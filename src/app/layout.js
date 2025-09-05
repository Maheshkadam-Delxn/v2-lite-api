// src/app/layout.js
import "./globals.css";
import connectDB from "@/lib/mongoose";

connectDB(); // ✅ Connects as soon as server starts

export const metadata = {
  title: "SkyStruct",
  description: "Construction management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
